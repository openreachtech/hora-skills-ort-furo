---
name: hof-oidc-sign-in
description: "Sign in through an external OpenID Connect identity provider in a Furo/Nuxt app: the full-page redirect to the provider, the callback page, and the return path kept across the trip. Use when adding a 'sign in with' button or an OIDC-only sign-in. Boundary: the session after sign-in follows the frontend cookie authentication convention; state, nonce, PKCE and the code exchange are the backend OIDC sign-in convention's."
metadata:
  author: OpenReachTech
  version: "2026.10.21"
---

# OIDC Sign-in (Frontend)

Use this skill when the user signs in at an external OpenID Connect identity provider (IdP) instead of typing a password into the app. The backend is a confidential client and runs the whole protocol ([[hor-oidc-sign-in]]): it creates `state`, `nonce` and the PKCE verifier, exchanges the code, and verifies the ID token. The frontend does three things only.

1. Ask the backend where to go, then leave the app for the IdP with a **full-page** navigation.
2. Remember where the user was heading, so the trip through the IdP does not lose it.
3. On the callback page, hand `code` and `state` back to the backend and keep the access token it returns.

The skill ends where [[hof-cookie-authentication]] begins. `signInWithOidc` answers with the same `accessToken` that `signIn` does and sets the same HttpOnly refresh cookie, so the token goes into `SessionStoreClerk`, and renewing, request healing, the route gateway and sign-out run unchanged.

## The flow

```
sign-in page                     backend                   identity provider
  | startOidcSignIn ------------->| state cookie, authorizationUrl
  |<------------------------------|
  | keep the return path
  | full-page navigate ------------------------------------>| user signs in
callback page <----------------------------- redirect_uri?code&state
  | signInWithOidc { code, state } ->| checks, exchange, session
  |<---------------------------------| accessToken + refresh cookie
  | saveToken, take the return path, navigate (replace)
```

## Rules

- **Leave the app with a full-page navigation**, `navigateTo(authorizationUrl, { external: true })`. The IdP is another origin, so a router push cannot reach it, and a popup or iframe breaks under third-party cookie blocking.
- **Both mutations send `credentials: 'include'`.** `startOidcSignIn` receives the state cookie and `signInWithOidc` sends it back, the way the refresh cookie rides the cookie-authentication payloads.
- **The return path lives in one keeper class and one storage key**, never as literals spread over the middleware, the sign-in page and the callback page ([start](./references/start.md)).
- **Only a same-origin relative path is ever kept or followed.** It starts with `/` and not with `//` or `/\`. Anything else falls back to the home path, so a crafted `?redirect=` cannot turn the callback into an open redirect.
- **The return path goes to `sessionStorage`, and nothing else does.** It is not a credential and it has to survive the page unload. The access token stays in memory, as [[hof-cookie-authentication]] requires.
- **The callback page is public** (`skipFilter`), sends `signInWithOidc` once, and replaces the history entry it lands on, so Back never replays a spent `code`.
- **An IdP `error` or a failed callback offers a fresh start**, never a retry of the same `code` and `state`. The backend spends the authorization row before the exchange, so the same pair cannot work twice.

## Core

| Topic | Description | Reference |
| --- | --- | --- |
| Start | The `startOidcSignIn` client, `OidcSignInStarter`, the `ReturnPathKeeper` and the sign-in page button, including an OIDC-only app | [start](./references/start.md) |
| Callback | The `signInWithOidc` client, `OidcCallbackReceiver` and the callback page | [callback](./references/callback.md) |

The Launcher, Payload and Capsule of both mutations follow [[hof-graphql]]. Error codes extend `app/constants-error.js` as [[hof-cookie-authentication]] lays it out.
