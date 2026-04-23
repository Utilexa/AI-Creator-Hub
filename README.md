# Creator AI Hub

A modern dark-themed web app for creators with six AI tools powered by `gpt-4o-mini`.

## Features

- YouTube Script Generator
- Story Generator
- Thumbnail + Caption Generator
- Side Hustle Finder
- Resume Generator
- Motivation Chatbot
- Login (local demo)
- Usage limits (Free: 5/day, Paid: unlimited)
- Plan options: Free ($0), Prime ($49/mo), Yearly ($499/yr)
- Stripe payment button (demo link)
- Currency converter (USD, INR, PKR, EUR, GBP)
- Mobile responsive UI
- Loading feedback + copy + regenerate

## Run locally

Open `index.html` directly in your browser, or serve with a local server:

```bash
python -m http.server 8000
```

Then browse to `http://localhost:8000`.

## API key handling

- Paste your OpenAI API key into the app UI at runtime.
- The key is **not** hardcoded in source files.
- For production use, route requests through your own backend proxy.
