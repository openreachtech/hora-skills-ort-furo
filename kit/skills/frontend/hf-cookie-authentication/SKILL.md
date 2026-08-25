---
name: hf-cookie-authentication
description: "Cookie-based authentication for a Furo/Nuxt app: the in-memory session layer (token store, renew, 401/205 self-heal, route gateway, sign-out), the auth GraphQL clients (signIn / renewAccessToken / signOut), and serving same-origin (vite proxy + nginx) so the refresh cookie is first-party. Use when adding cookie auth to a Furo app. Boundary: the base GraphQL client classes stay in the boilerplate; the backend token schema and resolvers are the backend cookie-authentication convention."
metadata:
  author: OpenReachTech
  version: "2026.08.18"
---

# Cookie Authentication (Frontend)

Use this skill when adding cookie-based authentication to a Furo/Nuxt app — holding the session, renewing the access token on a 401, guarding routes, signing out, or serving same-origin.

The app keeps a short-lived **access token in a Nuxt `useState` store** (never `localStorage`) and sends it as a header on every request; the **refresh token is an HttpOnly cookie** the browser sends on its own. When the access token expires the app renews it from the cookie and retries the request once; sign-out revokes the cookie server-side. Every decision lives in a plain, injectable class ([[hc-jest]]-tested); the composable and middleware are thin Nuxt-context bridges. The refresh cookie is first-party only when the app is served **same-origin** with the API.

This is application code built on top of the boilerplate's generic `BaseAppGraphql*` classes ([[hf-graphql]]) — it is not in the boilerplate itself. The base payload is token-free; this skill attaches the token per request.

> Depends on the backend cookie-authentication skill for the token schema, cookie context, and the `signIn` / `renewAccessToken` / `signOut` resolvers. Binding the server to loopback is a separate server-hardening concern, not part of this skill.

## Core

| Topic | Description | Reference |
| --- | --- | --- |
| Session state | The `useSessionStore` Nuxt store and the `SessionStoreClerk` gate — the in-memory access token, with the store injected into plain classes | [session-state](references/session-state.md) |
| Renew | `SessionRenewer` — renew the access token from the cookie, deduplicating concurrent refreshes | [renew](references/renew.md) |
| Request healing | `SessionRequestRunner` + `SessionRequestAuthorizer` + `useAppGraphqlClient` — attach the token, renew and retry on `Unauthenticated`, revoke on `RefreshTokenReused` | [request-healing](references/request-healing.md) |
| Route gateway | `SessionGatekeeper` + the global gateway middleware — ensure a session on guarded navigation | [gateway](references/gateway.md) |
| Sign-out | `SessionRevoker` + the `signOut` client + the sign-out UI trigger — revoke server-side, then drop the token | [sign-out](references/sign-out.md) |
| Auth GraphQL clients | The `signIn` / `renewAccessToken` / `signOut` Launcher/Payload/Capsule trios on the base classes | [auth-clients](references/auth-clients.md) |
| Error codes | `app/constants-error.js` plus the capsule `isUnauthenticated()` / `isRefreshTokenReused()` checks | [error-codes](references/error-codes.md) |
| Same-origin | Relative `.furo-env` endpoints, the vite dev proxy, and the nginx production reverse-proxy sample | [same-origin](references/same-origin.md) |
