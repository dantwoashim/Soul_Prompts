# SoulPrompts Site

SoulPrompts is a standalone static SvelteKit site that showcases engineered roleplay character prompts, drives waitlist signups, and stays fully isolated from the main `Wrong Number` app.

## Commands

```bash
npm install
npm run dev
npm run verify
```

## Environment

Copy `.env.example` to `.env` and set the public values you plan to use for deployment.

- `PUBLIC_SITE_URL`
- `PUBLIC_BUTTONDOWN_EMBED_ENDPOINT`
- `PUBLIC_PLAUSIBLE_DOMAIN`
- `PUBLIC_PLAUSIBLE_SRC`

## Deployment

This app is intended to be deployed as its own Vercel project from the `soulprompts-site/` directory.

## Isolation

This folder must not import code from `../src`, `../web`, `../supabase`, or any `Wrong Number` runtime files.
