# Same-origin

The refresh cookie is first-party only when the app is served **same-origin** with the API. This is configuration only — no change to the session layer.

Cross-origin (app on `:3000`, API on `:3900`) makes the refresh cookie third-party: it needs `SameSite=None; Secure`, drags in CORS-with-credentials, and modern browsers block it. Same-origin removes all of that — `SameSite=Lax` suffices and no CORS is needed.

## Relative endpoints

Point the API at relative paths in `.furo-env.*`, so `fetch` resolves them against `window.location`:

```
ENDPOINT_URL = /graphql-customer
WEBSOCKET_URL = /graphql-customer
RENCHAN_RESTFUL_API_BASE_URL =            # empty → REST calls are same-origin
```

furo's `BaseGraphqlLauncher.endpointUrl` returns `config.ENDPOINT_URL` verbatim and hands it to `fetch`, so a relative value just works — only the config value changes ([[hf-furo-env]]).

## Dev: vite proxy

Add `vite.server.proxy` in `nuxt.config.js`, forwarding the relative paths to the real backends:

```js
vite: {
  server: {
    proxy: {
      '/graphql-customer': {
        target: 'http://localhost:3900',
        changeOrigin: true,
        ws: true, // subscription upgrade rides the same path
      },
      // the REST path prefix → the REST backend on its own port
    },
  },
}
```

`changeOrigin: true` rewrites the Host header, so the upstream `Set-Cookie` attaches to the app's origin — first-party. If the backend sets an explicit cookie `Domain`, add `cookieDomainRewrite`.

## Prod: nginx reverse-proxy

The vite proxy is dev-only. In production a reverse proxy keeps the app same-origin — serve the static SPA at `/` and forward the API paths to the backend on loopback:

```nginx
location /graphql-customer {
  proxy_pass http://127.0.0.1:3900;
}
location /v1 {
  proxy_pass http://127.0.0.1:8001;
}
# static SPA served at /
```

TLS is required whenever the cookie is `Secure` — over plain HTTP the browser drops it. The backend's cookie flags (`SameSite=Lax`, `Secure`) are set in [[hb-cookie-authentication]].
