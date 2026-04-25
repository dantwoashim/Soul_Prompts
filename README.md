# SoulPrompts

SoulPrompts is a SvelteKit application for publishing a curated character archive with a public storefront and a private owner CMS.

The public site handles discovery, character pages, membership access, legal pages, and lightweight onboarding. The dashboard handles drafts, publishing, Patreon gating, site copy, featured collections, and release history. Private releases stay server-side until they are meant to be seen.

## Portfolio docs

- [Case study](docs/CASE_STUDY.md)
- [Security policy](SECURITY.md)
- [Contributing](CONTRIBUTING.md)

## What is in the repo

- A public catalog with character pages, archive browsing, membership pages, and support content
- An owner-only dashboard for editing prompts, site documents, navigation, footer content, and global settings
- Server-side access control for public versus private releases
- A Postgres-backed CMS layer with an in-memory fallback for local development
- Test coverage through Vitest and Playwright

## Stack

- SvelteKit 2 and Svelte 5
- `@sveltejs/adapter-vercel` for SSR deployments on Vercel
- Postgres and Supabase storage support for persisted CMS data
- Tailwind CSS 4 for styling
- Vitest and Playwright for verification

## Getting started

```bash
npm install
npm run dev
```

The app runs with an in-memory CMS fallback by default, so you can explore the site and dashboard locally without provisioning the database first.

## Environment

Copy `.env.example` to `.env` and fill in the values you plan to use.

Core public settings:

- `PUBLIC_SITE_URL`
- `PUBLIC_MEMBERSHIP_URL` or `PUBLIC_PATREON_URL`
- `PUBLIC_BUTTONDOWN_EMBED_ENDPOINT`
- `PUBLIC_PLAUSIBLE_DOMAIN`
- `PUBLIC_PLAUSIBLE_SRC`

Owner dashboard settings:

- `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET`
- `ADMIN_SESSION_TTL_HOURS`

Persistence settings:

- `CMS_DATABASE_URL`
- `CMS_DATABASE_SSL`
- `CMS_ENABLE_IN_MEMORY_FALLBACK`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`

## Useful scripts

```bash
npm run dev
npm run check
npm run test
npm run test:playwright
npm run build
npm run verify
npm run db:apply
npm run hash:admin
```

`npm run verify` runs the main quality gate: type checks, unit tests, build validation, and the build output check.

## Deployment

SoulPrompts is set up for deployment as its own Vercel project. The app uses server rendering, signed owner sessions, and CMS-backed content, so it should be deployed as an SSR app rather than a static export.

For a production setup:

1. Create the Vercel project from this repository.
2. Add the environment variables from `.env.example`.
3. Apply the CMS schema with `npm run db:apply`.
4. Generate an owner password hash with `npm run hash:admin`.
5. Deploy.

## Project layout

```text
src/
  lib/
    cms/            Shared CMS types and schemas
    server/         Auth, storage, and CMS repositories
    components/     Reusable UI
    content/        Seed content and legacy source material still used at runtime
  routes/
    dashboard/      Owner CMS
    catalog/        Public archive
    characters/     Public character detail pages
    vault/          Membership page
    learn/          Public guide content
tests/
database/
scripts/
```

## Notes for contributors

- Private prompt content is intentionally withheld from public page payloads.
- The dashboard is cookie-authenticated and meant for a single owner account.
- The in-memory CMS fallback is useful for local work, but production should use Postgres.
- Keep public copy polished. This repository is the product surface as much as it is the codebase.
