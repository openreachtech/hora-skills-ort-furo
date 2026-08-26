# Auth GraphQL clients

Three operations, each a Launcher / Payload / Capsule trio on the app base classes — the same pattern as any GraphQL client ([[hof-graphql]]). Only the auth-specific bits are here.

- **`signIn`** — credentials in, access token out; the server sets the refresh cookie. The capsule exposes `accessToken`.
- **`renewAccessToken`** — no variables, sent with `credentials: 'include'` so the refresh cookie reaches the server. The capsule exposes the fresh `accessToken`. Consumed by `SessionRenewer` ([renew](./renew.md)).
- **`signOut`** — no variables, sent with `credentials: 'include'`. The capsule exposes `isSignedOut`. Consumed by `SessionRevoker` ([sign-out](./sign-out.md)).

The refresh cookie rides `options: { credentials: 'include' }` on the payload — the two cookie operations set it. Everything else attaches the **access-token header** at the request site, not on the payload ([request-healing](./request-healing.md)), so the payload stays token-free.

```js
// signOut payload — token-free document, credentials included by the caller
static get document () {
  return /* GraphQL */ `
    mutation SignOutMutation {
      signOut {
        isSignedOut
      }
    }
  `
}
```

The endpoint is the app's audience endpoint (for example `/graphql-customer`); the backend side of these three operations is [[hor-cookie-authentication]].
