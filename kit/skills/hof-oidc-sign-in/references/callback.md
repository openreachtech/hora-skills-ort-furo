# Callback

The callback page is the path registered at the IdP as `OIDC_REDIRECT_URI`. It reads what the IdP put in the query, sends it to the backend once, and leaves.

## The client

```js
static get document () {
  return /* GraphQL */ `
    mutation SignInWithOidcMutation ($input: SignInWithOidcInput!) {
      signInWithOidc (input: $input) {
        accessToken
      }
    }
  `
}
```

The payload carries `credentials: 'include'`: the backend compares `state` with its state cookie, then sets the refresh cookie. The capsule exposes `accessToken`, plus `isOidcAuthorizationUnusable()` and `isOidcIdTokenInvalid()` for the two backend error codes.

## OidcCallbackReceiver

```js
async receiveCallback ({
  query,
}) {
  if (query.error || !query.code || !query.state) {
    return this.Ctor.createFailure({ reason: query.error ?? 'missing_code' })
  }

  const capsule = await this.launcher.launchRequest(
    this.buildPayload({
      code: query.code,
      state: query.state,
    })
  )

  if (capsule.hasError()) {
    return this.Ctor.createFailure({ reason: 'rejected' })
  }

  this.sessionClerk.saveToken({
    token: capsule.accessToken,
  })

  return this.Ctor.createSuccess({
    returnPath: this.returnPathKeeper.takeReturnPath(),
  })
}
```

- **An IdP `error` never reaches the backend.** The user cancelled or the IdP refused, and there is no code to spend.
- **`sessionClerk` is the `SessionStoreClerk` of [[hof-cookie-authentication]]**, so the token lands in the in-memory store and nowhere else.
- **The return path is taken only on success.** A failed callback leaves it in storage, so a fresh start from the error view still goes back to where the user was heading.

## The callback page

```js
definePageMeta({
  skipFilter: true,
})

const route = useRoute()
const receiver = createOidcCallbackReceiver()
const failure = ref(null)

onMounted(async () => {
  const outcome = await receiver.receiveCallback({
    query: route.query,
  })

  if (outcome.isFailure()) {
    failure.value = outcome
    return
  }

  await navigateTo(outcome.returnPath, {
    replace: true,
  })
})
```

- **`onMounted`, not `setup` and not a server render.** The refresh cookie and the state cookie are the browser's, and the call has to happen once, in the browser.
- **`replace: true`** drops the callback URL, `code` included, from history.
- **The error view links to the sign-in page**, which starts a new authorization. It never resends the old `code`.

Keep the outcome handling in the receiver and off the template ([[hof-prohibits]]).
