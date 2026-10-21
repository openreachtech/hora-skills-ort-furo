# Start

Starting a sign-in is two steps in a plain class: ask the backend for the URL, then leave the app. The page only wires a button to it.

## The client

`startOidcSignIn` takes no variables. The payload carries `credentials: 'include'`, so the browser stores the state cookie the backend sets.

```js
static get document () {
  return /* GraphQL */ `
    mutation StartOidcSignInMutation {
      startOidcSignIn {
        authorizationUrl
      }
    }
  `
}
```

The capsule exposes `authorizationUrl`.

## ReturnPathKeeper

One class owns the storage key and the same-origin check. The middleware, the sign-in page and the callback page all go through it.

```js
export default class ReturnPathKeeper {
  constructor ({
    storage,
  }) {
    this.storage = storage
  }

  static create ({
    storage = globalThis.sessionStorage,
  } = {}) {
    return new this({
      storage,
    })
  }

  static get STORAGE_KEY () {
    return 'oidc:returnPath'
  }

  static get HOME_PATH () {
    return '/'
  }

  keepReturnPath ({
    returnPath,
  }) {
    if (!this.isSameOriginPath({ path: returnPath })) {
      return
    }

    this.storage.setItem(this.Ctor.STORAGE_KEY, returnPath)
  }

  takeReturnPath () {
    const returnPath = this.storage.getItem(this.Ctor.STORAGE_KEY)

    this.storage.removeItem(this.Ctor.STORAGE_KEY)

    return this.isSameOriginPath({ path: returnPath })
      ? returnPath
      : this.Ctor.HOME_PATH
  }

  isSameOriginPath ({
    path,
  }) {
    return typeof path === 'string'
      && path.startsWith('/')
      && !path.startsWith('//')
      && !path.startsWith('/\\')
  }

  get Ctor () {
    return /** @type {typeof ReturnPathKeeper} */ (this.constructor)
  }
}
```

The check runs on both sides. A value written by an old build or by hand is checked again when it is taken.

## OidcSignInStarter

```js
async startSignIn ({
  returnPath,
}) {
  this.returnPathKeeper.keepReturnPath({ returnPath })

  const capsule = await this.launcher.launchRequest(this.buildPayload())

  if (capsule.hasError()) {
    return capsule
  }

  await this.navigator.navigateExternally({
    url: capsule.authorizationUrl,
  })

  return capsule
}
```

- **The return path is kept before the request**, so a slow answer cannot race the unload.
- **`navigator` is injected.** In the app it wraps `navigateTo(url, { external: true })`; in a test it records the URL. The class never calls a Nuxt composable itself.
- **A failed start returns its capsule** for the page to show, and the user stays on the sign-in page.

## The sign-in page

The gateway middleware still sends a guest to `ROUTE_PATH.SIGN_IN` with the target in `?redirect=` ([[hof-cookie-authentication]]). The page reads that query once and passes it to the starter.

```js
const route = useRoute()
const starter = createOidcSignInStarter()

async function signInWithProvider () {
  await starter.startSignIn({
    returnPath: route.query.redirect,
  })
}
```

The query key is a constant beside `ROUTE_PATH` (for example `ROUTE_QUERY.RETURN_PATH = 'redirect'`), so the middleware that writes it and the page that reads it cannot drift ([[hof-nuxt]] for app constants).

## An OIDC-only app

When the IdP is the only way in, the sign-in page has nothing to show but a button. Call `startSignIn` from `onMounted` instead and render a short "Redirecting to sign-in" line, keeping the button as the fallback when the start fails. The gateway middleware stays as it is: it still redirects to the sign-in page rather than calling the backend itself, so every start goes through one place.
