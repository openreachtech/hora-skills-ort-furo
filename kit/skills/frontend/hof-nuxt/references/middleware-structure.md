# Middleware structure

## Typical middleware (runs in prefix order)

```
middleware/000.customer.global.js    # bootstrap customer store from token
middleware/001.gateway.global.js     # auth gateway / redirects
middleware/010.pageTitle.global.js   # SEO page title
```

Naming: `NNN.<name>.global.js` — 3-digit ordering prefix, camelCase name, `.global` for app-wide. Named (per-page) middleware is not used.

## The `goNextAsIs()` convention

Each file defines a bottom helper `goNextAsIs()` returning `Promise.resolve()`, returned when navigation should proceed — instead of returning bare `undefined`. A middleware always returns either `navigateTo(...)` or `goNextAsIs()`.

```js
export default defineNuxtRouteMiddleware(async (to, from) => {
  // ...guards...
  return goNextAsIs()
})

/**
 * Go to the next as is.
 *
 * @returns {Promise<void>}
 */
function goNextAsIs () {
  return Promise.resolve()
}
```

`defineNuxtRouteMiddleware` is imported from `#imports` / `#app` / `nuxt/app` (mixed across files); `navigateTo` from `nuxt/app`.
