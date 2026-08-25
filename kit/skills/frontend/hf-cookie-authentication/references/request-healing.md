# Request healing

Every request carries the access token and self-heals on an auth failure. Three pieces:

- `SessionRequestAuthorizer` — attaches the in-memory token to the request as a header.
- `SessionRequestRunner` — the decision: renew + retry on `Unauthenticated`, revoke on `RefreshTokenReused`.
- `useAppGraphqlClient` — the thin Nuxt-context bridge wrapping furo's `useGraphqlClient` ([[hf-graphql]]).

## Attach the token per request

The payload is token-free, so the token is added per request as a header — read at call time, so the retry after a renew carries the fresh one.

```js
buildAuthenticatedRequestArguments ({ requestArguments }) {
  const token = this.sessionClerk.retrieveToken()

  if (!token) {
    return requestArguments
  }

  return {
    ...requestArguments,
    options: this.buildOptionsWithToken({
      options: requestArguments.options,
      token,
    }),
  }
}
// buildOptionsWithToken merges { headers: { [HEADER_KEY.ACCESS_TOKEN]: token } }
```

## The heal decision

`runRequest({ launchRequest })` runs the request thunk, then inspects the capsule (the checks are [error-codes](./error-codes.md)):

```js
async runRequest ({ launchRequest }) {
  const capsule = await launchRequest()

  if (capsule.isRefreshTokenReused()) {
    await this.sessionRevoker.revokeSession() // reuse ⇒ sign out, no retry
    return capsule
  }

  if (!capsule.isUnauthenticated()) {
    return capsule // success, or an unrelated error
  }

  return this.recoverUnauthenticatedRequest({ launchRequest, capsule })
}

async recoverUnauthenticatedRequest ({ launchRequest, capsule }) {
  const renewedToken = await this.sessionRenewer.renewSession() // deduped ([renew](./renew.md))

  if (!renewedToken) {
    await this.sessionRevoker.revokeSession()
    return capsule
  }

  return launchRequest() // retry exactly once
}
```

The retry is a second call of the same thunk, so it is bounded to one — the runner never loops. It takes a thunk, not a launcher, so it is launcher-agnostic and unit-testable with a fake.

## The composable

`useAppGraphqlClient(Launcher)` (in `composables/`) builds the chain from the store, wraps `useGraphqlClient(Launcher)`, and routes each `invokeRequest*` through the runner, attaching the token inside the thunk:

```js
const launchRequest = async () => {
  const authenticatedRequestArguments = sessionAuthorizer.buildAuthenticatedRequestArguments({ requestArguments })

  await invokeRequest(authenticatedRequestArguments) // furo's sender

  return client.capsuleRef.value
}

return runner.runRequest({ launchRequest })
```

Why an outer wrapper and not the base launcher: overriding `BaseAppGraphqlLauncher` — which every launcher, including the renew one, extends — would form an ES-module cycle. Nothing extends the runner, so it imports the session classes freely.
