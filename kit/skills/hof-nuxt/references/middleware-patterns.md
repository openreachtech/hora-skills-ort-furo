# Middleware patterns

## Pattern 1 — Auth gateway (`001.gateway.global.js`)

Uses `AccessTokenClerk.create().existsToken()` and `customerStore` state to redirect. Maintains route lists (`PUBLIC_ROUTES`, `POST_LOGIN_PROHIBITED_ROUTES`) and constants (`SIGN_IN_PATH = '/login'`, `SETTINGS_PATH = '/settings'`) at module top. Normalizes paths with `withoutTrailingSlash` from `ufo`, and honors `FuroMeta.create({ routeTo: to }) .skipFilter` to bypass auth. The login redirect preserves the target.

```js
export default defineNuxtRouteMiddleware(async (to, from) => {
  const normalizedToPath = withoutTrailingSlash(to.path)
  const customerStore = useCustomerStore()
  const accessTokenClerk = AccessTokenClerk.create()

  if (
    customerStore.hasSignedIn()
    && accessTokenClerk.existsToken()
    && !customerStore.isActiveProfile()
    && !isSettingsPath({
      path: normalizedToPath,
    })
  ) {
    return navigateTo(SETTINGS_PATH)
  }

  // POST_LOGIN_PROHIBITED_ROUTES -> navigateTo('/')

  if (accessTokenClerk.existsToken()) {
    return goNextAsIs()
  }

  if (PUBLIC_ROUTES.includes(normalizedToPath)) {
    return goNextAsIs()
  }

  const furoMeta = FuroMeta.create({
    routeTo: to,
  })

  if (furoMeta.skipFilter) {
    return goNextAsIs()
  }

  return navigateTo(`${SIGN_IN_PATH}?redirect=${to.fullPath}`)
})
```

## Pattern 2 — Data bootstrap (`000.customer.global.js`)

Server-guards with `import.meta.server`, reads the token via `StorageClerk.createAsLocal().get(STORAGE_KEY.ACCESS_TOKEN)`, reconciles the store against the token (`clearCustomerStore()` if an id exists but no token), and calls `await customerStore.fetchCustomer()` when a token exists but no customer is loaded.

```js
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) {
    return goNextAsIs()
  }
  // reconcile StorageClerk token vs customerStore, then fetchCustomer()
  return goNextAsIs()
})
```

## Pattern 3 — SEO (`010.pageTitle.global.js`)

Reads `FuroMeta.create({ routeTo: to }).pageTitle` (falling back to `document?.title` / `DEFAULT_PAGE_TITLE`) and calls `useSeoMeta({ title })`.
