# Web (`@breeze/web`)

Next.js app for the dashboard UI and non-streaming APIs (sessions, repos, auth). Real-time streaming is handled via the Gateway and `@breeze/gateway-clients`.

## Docs

- https://docs.breeze.engineer/anywhere/web
- Self-hosting: https://docs.breeze.engineer/self-hosting/overview

## Development

- From repo root: `pnpm dev:web`
- Unit tests: `pnpm --filter @breeze/web test`
- E2E: `pnpm --filter @breeze/web e2e`
