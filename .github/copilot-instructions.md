# Copilot / Agent Instructions for sayantan-wishlist ✅

Purpose: Provide short, actionable guidance so AI coding agents (Copilot, Claude Code, Cursor, etc.) can be immediately productive in this repository.

## Model / Runtime preferences 🎯
- **Preferred Claude model:** `claude-haiku-4.5` — **Enable Claude Haiku 4.5 for all Claude clients** when available. (Do not assume availability; fall back to the client's default Claude model.)
- **GitHub Copilot / other agents:** follow their default model unless asked to match the Claude preference above.

## Big-picture architecture 🔧
- React Router-based Shopify app (server + SSR). Key files:
  - `app/shopify.server.js` — Shopify app configuration and exported helpers (`authenticate`, `registerWebhooks`, `sessionStorage`).
  - `app/entry.server.jsx` — SSR streaming entry, uses `renderToPipeableStream` and a `streamTimeout` (5s). Be careful modifying streaming behavior (Cloudflare tunnel caveats).
  - `app/routes.js` — route generation with `@react-router/fs-routes` (flatRoutes).
  - `prisma/schema.prisma` + `db.server.js` — Prisma-based session storage (SQLite by default).
  - `shopify.app.toml` / `shopify.web.toml` — app-specific webhooks and configuration.

## Project-specific conventions & patterns 📐
- Sessions are stored via Prisma session storage (`@shopify/shopify-app-session-storage-prisma`). Modify `prisma/schema.prisma` then run the `setup` script.
- Webhooks: prefer app-specific webhooks in `shopify.app.toml` instead of registering in `afterAuth` (see README notes).
- Embedded app navigation rules:
  - Use `Link` from `react-router` or Polaris — avoid `<a>` to keep session in iFrame.
  - For redirecting after auth, use `redirect` returned by `authenticate.admin` (not react-router's redirect).
  - Use `useSubmit` from `react-router` for form submits in embedded contexts.

## Key developer workflows & commands ⚙️
- Local dev: `npm run dev` → runs `shopify app dev`. Press `P` to open the app URL from the CLI.
- Setup DB / migrations: `npm run setup` → runs `prisma generate && prisma migrate deploy`.
- Build: `npm run build` (or `yarn build`, `pnpm run build`).
- Deploy (syncs app-specific webhooks & config): `npm run deploy` (Shopify CLI handles syncing `shopify.app.toml`).
- Start server: `npm run start` (or `npm run docker-start` for Docker flow).
- Type check: `npm run typecheck` (runs `react-router typegen` + `tsc --noEmit`).

## Debugging & gotchas 🐞
- CLI-triggered webhooks use a valid-but-nonexistent shop; `admin` will be `undefined` for those webhook events—use CLI-triggered webhooks only for initial experimentation.
- Cloudflare tunnels buffer streaming responses; to test streaming `await`/defer use localhost-based dev.
- Windows + Prisma: If you see `query_engine-windows.dll.node` errors, set `PRISMA_CLIENT_ENGINE_TYPE=binary` in the environment.

## Where to look for common changes 🔎
- Auth and session code: `app/shopify.server.js`, `db.server.js`, `prisma/schema.prisma`
- Webhooks and routes: `app/routes/` (e.g., `webhooks.app.uninstalled.jsx`, `webhooks.app.scopes_update.jsx`)
- SSR behavior and stream timeout: `app/entry.server.jsx`
- Developer scripts: `package.json` (scripts: `dev`, `setup`, `build`, `deploy`, `start`, `typecheck`)

## Examples (copy/paste useful snippets) 📋
- Authenticate admin and run a GraphQL query (README example):

```js
const { admin } = await shopify.authenticate.admin(request);
const response = await admin.graphql(`{ products(first:25){nodes{title description}} }`);
```

## Editing rules for agents ✍️
- Prefer small, well-scoped PRs. When adding env vars or secrets, add them to docs and instruct maintainers to add to the CI/hosting provider; do not commit plaintext secrets.
- When modifying Prisma schema, include a migration / run `prisma migrate` and update `npm run setup` documentation if needed.
- When modifying webhooks, note whether they are app-specific (`shopify.app.toml`) or shop-specific (registered at runtime).

---
If any section is unclear or you want a short checklist added (e.g., PR checklist, local debugging steps), tell me which part to expand and I'll iterate. 🚀