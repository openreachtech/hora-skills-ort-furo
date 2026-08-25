# Route gateway

The global middleware ensures a session on guarded navigation. The decision lives in `SessionGatekeeper` (a testable class); the middleware is a thin Nuxt-context bridge.

```js
async establishesSession () {
  if (this.sessionClerk.existsToken()) {
    return true // a token is already held
  }

  const renewedToken = await this.sessionRenewer.renewSession() // from the cookie ([renew](./renew.md))

  return Boolean(renewedToken)
}
```

The in-memory token is lost on reload, so renewing here re-establishes the session across reload and direct-URL open. Renew happens **only when no token is held** — mid-session expiry is covered by the request runner's retry ([request-healing](./request-healing.md)), not by renewing on every navigation.

## The middleware

```js
export default defineNuxtRouteMiddleware(async to => {
  if (isPublicRoute({ routeTo: to })) {
    return goNextAsIs()
  }

  const gatekeeper = createSessionGatekeeper() // builds store → clerk → renewer → gatekeeper

  const hasSession = await gatekeeper.establishesSession()

  if (hasSession) {
    return goNextAsIs()
  }

  return navigateTo(`${ROUTE_PATH.SIGN_IN}?redirect=${to.fullPath}`)
})
```

A public route is the sign-in path or one flagged `skipFilter` (furo `FuroMeta`). The sign-in path is a constant (`ROUTE_PATH.SIGN_IN`), not a literal, so it lives in one place ([[hf-nuxt]] for app constants and middleware).
