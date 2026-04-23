const tools = [
  {
    key: "youtube",
    title: "YouTube Script Generator",
    hint: "Create viral, high-retention scripts in a structured format.",
    prompt: `You are a top-tier YouTube content strategist and scriptwriter.

Create a HIGHLY engaging, viral YouTube script.

Topic: {input}

Structure:
1. Hook (0–5 sec) – shocking, curiosity-driven
2. Intro (5–15 sec) – set expectation
3. Main Content – storytelling + value + pattern interrupts
4. Engagement Hooks – questions, curiosity loops
5. Climax / Key Insight
6. Conclusion
7. Strong Call-To-Action

Style:
- Conversational, simple English
- High retention (short sentences)
- Emotional + curiosity-driven
- Avoid boring or generic lines

Also generate:
- 3 viral titles
- 5 thumbnail text ideas

Format your response in clear headings and bullet points.
Make it feel like a video that gets millions of views.`
  },
  {
    key: "story",
    title: "Story Generator",
    hint: "Generate cinematic, emotional short stories.",
    prompt: `You are a cinematic storyteller.

Write a powerful, emotional story.

Topic: {input}

Requirements:
- Strong opening hook
- Relatable characters
- Clear conflict
- Emotional build-up
- Unexpected twist ending
- Meaningful lesson

Style:
- Simple, visual language
- Short paragraphs
- High emotional impact

Also include:
- Story title
- 1-line moral

Format your response in clean headings, spacing, and bullets for mobile reading.
Make it feel like a viral short story or reel.`
  },
  {
    key: "thumbnail",
    title: "Thumbnail + Caption Generator",
    hint: "Get viral thumbnails, titles, and IG caption packs.",
    prompt: `You are a viral content expert for YouTube and Instagram.

Topic: {input}

Generate:

1. Thumbnail Text (5 options)
- 2–5 words max
- Bold, curiosity-driven
- Emotional triggers (shock, fear, curiosity, excitement)

2. YouTube Titles (3 options)
- High CTR
- Use power words
- Create curiosity gap

3. Instagram Caption:
- Hook in first line
- Short storytelling
- CTA (like, comment, share)
- Add 10 relevant hashtags

Format your response in sections with headings and bullet points.
Make everything optimized for clicks and engagement.`
  },
  {
    key: "hustle",
    title: "Side Hustle Finder",
    hint: "Find practical beginner-friendly side hustle plans.",
    prompt: `You are a business strategist.

Suggest 5 realistic side hustles.

User skills: {input}

For each idea include:
- Idea name
- Why it suits the user
- Step-by-step starting plan
- Tools needed
- Earning potential (monthly estimate)
- Time required per day

Conditions:
- Beginner-friendly
- Low or zero investment
- Online-focused if possible

Format output with clear headings and numbered bullets.
Make ideas practical and actionable, not generic.`
  },
  {
    key: "resume",
    title: "Resume Generator",
    hint: "Turn user details into summary, bio, and skills list.",
    prompt: `You are a professional resume writer.

Create a strong resume summary and bio.

User details:
{input}

Output:
1. Resume Summary (professional, ATS-friendly)
2. Short Bio (for social media or portfolio)
3. Key Skills (bullet points)
4. Optional: Suggested job roles

Style:
- Clear and confident
- Industry-relevant language
- No fluff or generic phrases

Format your response in readable sections with bullets.
Make it look like a high-quality professional profile.`
  },
  {
    key: "motivation",
    title: "Motivation Chatbot",
    hint: "Get practical mindset support and action steps.",
    prompt: `You are a motivational coach and mindset mentor.

User message: {input}

Your role:
- Provide practical, positive, and realistic advice
- Be supportive but not overly emotional
- Focus on action steps and mindset shifts

Rules:
- Do NOT give medical or mental health diagnosis
- Do NOT sound robotic or generic

Structure:
1. Acknowledge the situation
2. Give clear advice
3. Suggest 2–3 actionable steps
4. End with encouragement

Tone:
- Calm, confident, supportive
- Simple and easy to understand

Format with headings and bullet points for mobile readability.`
  }
];

const el = {
  toolNav: document.getElementById("toolNav"),
  toolTitle: document.getElementById("toolTitle"),
  toolHint: document.getElementById("toolHint"),
  promptInput: document.getElementById("promptInput"),
  generateBtn: document.getElementById("generateBtn"),
  regenerateBtn: document.getElementById("regenerateBtn"),
  copyBtn: document.getElementById("copyBtn"),
  outputBody: document.getElementById("outputBody"),
  status: document.getElementById("status"),
  apiKey: document.getElementById("apiKey"),
  emailInput: document.getElementById("emailInput"),
  loginBtn: document.getElementById("loginBtn"),
  loginState: document.getElementById("loginState"),
  usageState: document.getElementById("usageState"),
  upgradeBtn: document.getElementById("upgradeBtn"),
  amount: document.getElementById("amount"),
  fromCurrency: document.getElementById("fromCurrency"),
  toCurrency: document.getElementById("toCurrency"),
  convertBtn: document.getElementById("convertBtn"),
  convertResult: document.getElementById("convertResult")
};

let activeTool = tools[0];
let lastInput = "";
const USAGE_LIMIT = 5;
const PLAN_KEY = "creator_ai_hub_plan";
const USER_KEY = "creator_ai_hub_user";
const USAGE_KEY = "creator_ai_hub_usage";

function renderTools() {
  el.toolNav.innerHTML = "";
  tools.forEach((tool) => {
    const button = document.createElement("button");
    button.className = `tool-btn ${activeTool.key === tool.key ? "active" : ""}`;
    button.textContent = tool.title;
    button.onclick = () => {
      activeTool = tool;
      renderTools();
      el.toolTitle.textContent = tool.title;
      el.toolHint.textContent = tool.hint;
      el.outputBody.textContent = "Your generated content will appear here.";
    };
    el.toolNav.appendChild(button);
  });
}

function getPlan() {
  return localStorage.getItem(PLAN_KEY) || "free";
}

function setPlan(plan) {
  localStorage.setItem(PLAN_KEY, plan);
  document.querySelectorAll("[data-plan]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.plan === plan);
  });
  refreshUsageUI();
}

function getUsageData() {
  const today = new Date().toISOString().slice(0, 10);
  const cached = JSON.parse(localStorage.getItem(USAGE_KEY) || "{}");
  if (cached.date !== today) {
    return { date: today, count: 0 };
  }
  return cached;
}

function setUsageCount(count) {
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count }));
  refreshUsageUI();
}

function canUseGenerator() {
  if (getPlan() !== "free") return true;
  const usage = getUsageData();
  return usage.count < USAGE_LIMIT;
}

function refreshUsageUI() {
  const plan = getPlan();
  const usage = getUsageData();
  if (plan === "free") {
    el.usageState.textContent = `Free plan: ${usage.count}/${USAGE_LIMIT} requests used today.`;
  } else if (plan === "prime") {
    el.usageState.textContent = "Prime plan: Unlimited requests. Monthly $49.";
  } else {
    el.usageState.textContent = "Yearly plan: Unlimited requests. Yearly $499.";
  }
}

async function generate() {
  const input = el.promptInput.value.trim();
  const key = el.apiKey.value.trim();

  if (!input) {
    el.outputBody.textContent = "Please add your input first.";
    return;
  }
  if (!key) {
    el.outputBody.textContent = "Please enter your OpenAI API key.";
    return;
  }
  if (!canUseGenerator()) {
    el.outputBody.textContent = "Upgrade to Pro to continue. Free limit reached (5/day).";
    return;
  }

  lastInput = input;
  const fullPrompt = activeTool.prompt.replace("{input}", input);

  try {
    el.status.classList.remove("hidden");
    el.generateBtn.disabled = true;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are Creator AI Hub assistant. Always format responses using headings, spacing, and bullet points for easy mobile reading."
          },
          { role: "user", content: fullPrompt }
        ],
        temperature: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "No response received.";
    el.outputBody.textContent = text;

    if (getPlan() === "free") {
      const usage = getUsageData();
      setUsageCount(usage.count + 1);
    }
  } catch (error) {
    el.outputBody.textContent = `Error: ${error.message}. Please verify key, billing, and network.`;
  } finally {
    el.status.classList.add("hidden");
    el.generateBtn.disabled = false;
  }
}

async function convertCurrency() {
  const amount = Number(el.amount.value || 0);
  const from = el.fromCurrency.value;
  const to = el.toCurrency.value;
  if (!amount || amount <= 0) {
    el.convertResult.textContent = "Please enter a valid amount.";
    return;
  }

  try {
    el.convertResult.textContent = "Converting…";
    const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`);
    if (!res.ok) throw new Error("conversion unavailable");
    const data = await res.json();
    const value = data.rates?.[to];
    if (value == null) throw new Error("unsupported pair");
    el.convertResult.textContent = `${amount} ${from} = ${value.toFixed(2)} ${to}`;
  } catch {
    el.convertResult.textContent = "Could not convert right now. Please retry.";
  }
}

function initLoginPlan() {
  const user = localStorage.getItem(USER_KEY);
  if (user) el.loginState.textContent = `Logged in as ${user}`;

  el.loginBtn.onclick = () => {
    const email = el.emailInput.value.trim();
    if (!email) {
      el.loginState.textContent = "Enter email to login.";
      return;
    }
    localStorage.setItem(USER_KEY, email);
    el.loginState.textContent = `Logged in as ${email}`;
  };

  document.querySelectorAll("[data-plan]").forEach((btn) => {
    btn.addEventListener("click", () => setPlan(btn.dataset.plan));
  });

  el.upgradeBtn.onclick = () => {
    window.open("https://buy.stripe.com/test_00g4gB6J65lM4AE7ss", "_blank");
  };

  if (!localStorage.getItem(PLAN_KEY)) {
    localStorage.setItem(PLAN_KEY, "free");
  }
  setPlan(getPlan());
}

el.generateBtn.addEventListener("click", generate);
el.regenerateBtn.addEventListener("click", () => {
  if (lastInput) {
    el.promptInput.value = lastInput;
    generate();
  } else {
    el.outputBody.textContent = "No previous prompt found. Add input and generate first.";
  }
});
el.copyBtn.addEventListener("click", async () => {
  const content = el.outputBody.textContent;
  if (!content) return;
  await navigator.clipboard.writeText(content);
  el.copyBtn.textContent = "Copied ✅";
  setTimeout(() => (el.copyBtn.textContent = "Copy 📋"), 1200);
});
el.convertBtn.addEventListener("click", convertCurrency);

renderTools();
initLoginPlan();
refreshUsageUI();
