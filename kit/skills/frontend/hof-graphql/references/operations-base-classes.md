# What the base classes give you (don't re-implement)

- **`BaseAppGraphqlCapsule`** — `extractResolvedErrorMessage()` and `isUnauthenticated()`, built on furo's `getErrorMessage()`/`hasError()`, mapping codes through `app/constants-error.js`. See [[hof-error-handling]].
- **`BaseAppGraphqlPayload.collectBasedHeadersOptions()`** — injects the access-token header (`HEADER_KEY.ACCESS_TOKEN`) read from local storage via `StorageClerk.createAsLocal()` + `STORAGE_KEY.ACCESS_TOKEN`.
- **`BaseAppGraphqlLauncher.graphqlConfig`** — returns the singleton `graphqlConfig` (`ENDPOINT_URL`/`WEBSOCKET_URL`) populated at runtime by `plugins/000.furo.js` from env ([[hof-furo-env]], [[hof-nuxt]]).
