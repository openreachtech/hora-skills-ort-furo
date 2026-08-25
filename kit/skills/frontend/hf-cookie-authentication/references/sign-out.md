# Sign-out

Sign-out revokes the server session **before** dropping the in-memory token, so a failed revoke never orphans a live server session behind a cleared client. `SessionRevoker` (a plain class) owns the mechanism; a UI control calls it.

```js
async revokeSession () {
  await this.sendSignOut()       // signOut mutation — server revokes the series and clears the cookie
  this.sessionClerk.clearToken() // then drop the in-memory access token
}

buildSignOutPayload () {
  return this.launcherFactory.createPayload({
    variables: {},
    options: {
      credentials: 'include', // send the refresh cookie so the server can revoke it
    },
  })
}
```

The signOut launcher is injected (defaults to the signOut client — [auth-clients](./auth-clients.md)).

## UI trigger

A sign-out control (for example in `layouts/default`) calls `revokeSession()` then redirects — the redirect is the caller's, not the revoker's:

```js
await sessionRevoker.revokeSession()

await navigateTo(ROUTE_PATH.SIGN_IN)
```

Build the control and its context with [[hf-furo-context-patterns]]; keep the logic off the template ([[hf-prohibits]]).
