# Demo Script: SoulPrompts

## 30-second explanation

SoulPrompts is a SvelteKit content-commerce/CMS project with a public storefront, private owner dashboard, publishing workflows, and membership pages.

## 2-minute walkthrough

1. Show the public storefront and catalog pages.
2. Explain the owner dashboard.
3. Show draft versus published content behavior.
4. Show `.env.example` and local fallback mode.
5. Show `npm run verify`.

## 5-minute technical walkthrough

Walk through SvelteKit SSR routes, CMS data access, server-side access control, publishing flow, Supabase/Postgres configuration, and why local fallback exists for development demos.

## What to show in an interview

- Public storefront
- Owner dashboard
- CMS workflow
- Environment setup
- Verification scripts

## What not to overclaim

- Do not imply it is a large live commerce business.
- Do not expose private dashboard credentials.
- Do not treat in-memory fallback as production storage.

## Likely interviewer questions

### Why SvelteKit?

It supports SSR, server routes, strong component ergonomics, and a clean path for full-stack content workflows.

### How do private releases stay private?

Private release access is checked server-side before content is rendered or sent to clients.

### What would you improve next?

More dashboard Playwright tests, richer screenshots, import/export tooling, and better editor roles.

