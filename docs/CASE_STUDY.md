# Case Study: SoulPrompts

## Summary

SoulPrompts is a SvelteKit content-commerce/CMS project with a public storefront, private owner dashboard, publishing workflows, and membership/onboarding pages.

## Problem

Content products often need both a polished public catalog and a private workflow for drafts, publishing, gated content, site copy, and release history. Building both surfaces in one app requires careful access boundaries.

## Why this project matters

It shows full-stack frontend/product engineering with SvelteKit, server-side rendering, CMS workflows, and deployment-aware configuration.

## My role

I built the SvelteKit app, public/private content flows, owner CMS dashboard, local fallback mode, and verification scripts.

## Tech stack

- Frontend/full-stack: SvelteKit 2, Svelte 5
- Styling: Tailwind CSS 4
- Data/storage: Postgres, Supabase storage support, in-memory local fallback
- Deployment: Vercel SSR adapter
- Testing: Vitest, Playwright, Svelte check

## Architecture

```text
Public storefront -> SvelteKit routes -> CMS data layer -> Postgres/Supabase or local fallback
Owner dashboard   -> server-side auth/session checks -> draft/publish workflows
```

## Key features

- Public catalog and character pages
- Owner-only dashboard
- Draft and publishing workflow
- Membership/onboarding pages
- Server-side gating for private releases
- Local in-memory CMS fallback for development

## Hard technical problems

- Keeping private releases server-side until published
- Supporting local demos without forcing database setup
- Balancing public storefront UX with private CMS workflows

## Important decisions and tradeoffs

- Use SSR deployment rather than static export because dashboard/session behavior matters.
- Provide an in-memory fallback for easier local development.
- Keep production secrets in environment variables, not committed files.

## Testing and validation

The project uses Svelte checks, Vitest, Playwright, build validation, and a `verify` script.

## Security and limitations

The owner dashboard requires strong secret configuration in production. Demo/local fallback modes should not be treated as production storage.

## What I learned

- SvelteKit SSR patterns
- CMS workflow modeling
- Access control for public/private content
- Test and deployment setup for a full-stack frontend app

## What I would improve with more time

- Add richer screenshots and demo content
- Expand Playwright coverage for dashboard flows
- Add role-based auth if multiple editors are needed
- Add import/export workflows for content

## What this project proves to employers

SoulPrompts proves I can build a polished SvelteKit product with CMS-style workflows, deployment configuration, and test automation.

## Resume bullets

- Built a SvelteKit content-commerce CMS with public storefront, owner dashboard, publishing workflows, membership pages, and server-side release gating.
- Implemented a Postgres/Supabase-ready CMS layer with in-memory local fallback for easier development and demos.
- Added verification scripts using Svelte checks, Vitest, Playwright, build validation, and deployment notes for Vercel SSR.

