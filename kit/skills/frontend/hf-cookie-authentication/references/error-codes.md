# Error codes

Backend error codes are matched by **name**, not by hardcoded strings scattered through the code. `app/constants-error.js` is the dictionary; the capsule owns the checks.

```js
// app/constants-error.js — keyed by semantic name
export const ERROR_CODE_HASH = {
  Unauthenticated: '102.X000.001',
  RefreshTokenReused: '205.M003.001',
}
```

`BaseAppGraphqlCapsule` reads furo's `getErrorMessage()` (which returns the backend error code) and compares it against the hash — so the request runner never compares raw code strings:

```js
isUnauthenticated () {
  const errorCode = this.getErrorMessage()

  if (errorCode === null) {
    return false
  }

  return errorCode === ERROR_CODE_HASH.Unauthenticated
}
// isRefreshTokenReused() mirrors this against ERROR_CODE_HASH.RefreshTokenReused
```

These two checks drive the request runner ([request-healing](./request-healing.md)): `isUnauthenticated()` → renew and retry, `isRefreshTokenReused()` → revoke. The codes must match the backend's ([[hb-cookie-authentication]]). For general error-to-message mapping in the UI, see [[hf-error-handling]].
