# Stash — Multicurrency Wallet

A production-feel multicurrency mobile wallet UI built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Lucide React**. All data is mocked — no backend.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000  → redirects to /login
```

## Production build

```bash
npm run build
npm run start    # serves the compiled app, binds to $PORT (default 3000)
```

## Deploy to Railway

The app is Railway-ready. Railway's Nixpacks builder auto-detects Next.js and runs
`npm ci` → `npm run build` → `npm run start`.

Key bits already configured:

- **`railway.json`** — pins the Nixpacks builder, build command, start command, and restart policy.
- **`engines.node` / `.nvmrc`** — pins Node 20.
- **`start` script** — `next start -H 0.0.0.0 -p ${PORT:-3000}`, so the server binds to the
  `PORT` Railway injects, on all interfaces.

### Option A — Railway CLI (no GitHub repo required)

```bash
npm i -g @railway/cli
railway login
railway init          # create a new project
railway up            # upload + build + deploy this directory
railway domain        # generate a public URL
```

### Option B — Deploy from GitHub

1. Push this project to a GitHub repository.
2. In the Railway dashboard: **New Project → Deploy from GitHub repo** and pick it.
3. Railway builds and deploys automatically on every push to the default branch.
4. Under the service's **Settings → Networking**, click **Generate Domain** for a public URL.

No environment variables are required — the app is fully self-contained with mock data.

## Routes

| Route        | Screen                                            |
| ------------ | ------------------------------------------------- |
| `/login`     | Email + password sign-in                          |
| `/otp`       | Email 2FA code (mirrors the email entered)        |
| `/dashboard` | Total balance, wallet cards, quick actions, recent|
| `/send`      | Send-money flow (bottom sheet)                    |
| `/exchange`  | Currency exchange at the mid-market rate          |
| `/receive`   | Account details per currency                      |
| `/history`   | Full transaction history with filters             |
| `/profile`   | Profile & settings (functional sub-pages)         |
