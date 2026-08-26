# Renew

`SessionRenewer` renews the access token from the refresh cookie, **deduplicating** concurrent renewals: when several requests find the token expired at once, only the first hits the network; the rest await the same in-flight promise, held in `sessionStore.renewingPromise`.

```js
const sessionRenewer = SessionRenewer.create({ sessionStore, sessionClerk })

const accessToken = await sessionRenewer.renewSession() // string | null
```

```js
async renewSession () {
  const runningPromise = this.sessionStore.renewingPromise.value

  if (runningPromise) {
    return runningPromise // join the in-flight renew, no second round-trip
  }

  const renewingPromise = this.renewToken()

  this.sessionStore.renewingPromise.value = renewingPromise

  const accessToken = await renewingPromise

  this.sessionStore.renewingPromise.value = null

  return accessToken
}
```

The network call sends the refresh cookie with `credentials: 'include'`, then stores the new token through the clerk ([session-state](./session-state.md)). The renew launcher is **injected** (defaults to the renewAccessToken client — [auth-clients](./auth-clients.md)), never a hard import — a session class importing a launcher that extends the app base launcher would form an ES-module cycle.

```js
buildRenewPayload () {
  return this.renewLauncherFactory.createPayload({
    variables: {},
    options: {
      credentials: 'include', // send the refresh cookie
    },
  })
}
```

`renewSession()` returns `null` on failure; the caller — the gateway ([gateway](./gateway.md)) or the request runner ([request-healing](./request-healing.md)) — treats `null` as "could not renew".
