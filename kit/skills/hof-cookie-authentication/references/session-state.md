# Session state

The access token lives **in memory**, in a Nuxt `useState` store — never `localStorage` or `sessionStorage`. `useSessionStore` holds it (plus the in-flight renew promise used to deduplicate refreshes); `SessionStoreClerk` is the single gate that reads / writes / clears it.

```js
// app/session/useSessionStore.js — a composable, so Nuxt-context only
export function useSessionStore () {
  return {
    accessToken: useState('session:accessToken', () => null),
    renewingPromise: useState('session:renewingPromise', () => null), // transient, for dedupe
  }
}
```

`SessionStoreClerk` is a plain class, so it never calls the composable itself — the store is injected:

```js
const sessionClerk = SessionStoreClerk.create({ sessionStore })

sessionClerk.saveToken({ token }) // an empty token clears instead of storing
sessionClerk.retrieveToken()      // string | null
sessionClerk.clearToken()
sessionClerk.existsToken()        // boolean
```

Why in-memory: the durable credential is the `HttpOnly` refresh cookie, not the access token. Losing the access token on reload is fine — the gateway renews it from the cookie ([gateway](./gateway.md)). Nothing a page script can read holds a long-lived credential.

The store's initial value is `null` (never `''`), so "unset" and "empty string" stay distinct.
