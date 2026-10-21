---
name: hof-cookie-authentication
description: "Password sign-in with an in-memory access token and an HttpOnly refresh cookie in a Furo/Nuxt app: the session layer, the auth GraphQL clients, and same-origin serving. Use when adding cookie auth to a Furo app. Boundary: an OIDC or SSO sign-in ends in this session through the frontend OIDC sign-in convention; the base GraphQL client classes stay in the boilerplate; the backend token schema and resolvers are the backend cookie-authentication convention."
metadata:
  author: OpenReachTech
  version: "2026.10.21"
---

# Cookie Authentication (Frontend)

Use this skill when adding cookie-based authentication to a Furo/Nuxt app — holding the session, renewing the access token on a 401, guarding routes, signing out, or serving same-origin.

The app keeps a short-lived **access token in a Nuxt `useState` store** (never `localStorage`) and sends it as a header on every request; the **refresh token is an HttpOnly cookie** the browser sends on its own. When the access token expires the app renews it from the cookie and retries the request once; sign-out revokes the cookie server-side. Every decision lives in a plain, injectable class ([[hoc-jest]]-tested); the composable and middleware are thin Nuxt-context bridges. The refresh cookie is first-party only when the app is served **same-origin** with the API.

The pattern starts at password sign-in, where the app holds an access token. An OIDC or SSO sign-in reaches the same session: its callback returns the same access token and sets the same refresh cookie, and [[hof-oidc-sign-in]] covers the trip to the provider. A backend that keeps a session cookie and returns no token at all leaves the app nothing to hold, so this skill does not apply to it.

This is application code built on top of the boilerplate's generic `BaseAppGraphql*` classes ([[hof-graphql]]) — it is not in the boilerplate itself. The boilerplate's base payload also looks for a token in `localStorage`; this skill writes nothing there, so the token reaches each request only through the session store.

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
| Same-origin | Relative `.furo-env` endpoints, the vite dev proxy, and the production reverse proxy (nginx sample) | [same-origin](references/same-origin.md) |
