# Security Policy

Do not report sensitive issues in public issues if they involve authentication, sessions, dashboard access, storage, or private content exposure.

## Sensitive areas

- owner dashboard authentication
- admin session cookies/secrets
- private release gating
- Supabase service role key handling
- content upload/storage paths

## Production note

Use strong environment secrets in production. The in-memory fallback is for local development and demos, not durable production storage.

