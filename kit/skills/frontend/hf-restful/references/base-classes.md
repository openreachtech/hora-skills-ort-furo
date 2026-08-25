# Scaffold & base classes

## Directory

```
app/restfulapi/renchan/
├── BaseAppRenchanRestfulApiLauncher.js
├── BaseAppRenchanRestfulApiPayload.js
├── BaseAppRenchanRestfulApiCapsule.js
└── restfulapi.config.js            # { BASE_URL: null } (populated at runtime)
```

The `renchan` segment denotes the backend, distinguishing these from the plain `BaseAppGraphql*` classes.

## Base classes (extend furo's `BaseRenchanRestfulApi*`)

**Launcher** — wires the config:

```js
export default class BaseAppRenchanRestfulApiLauncher extends BaseRenchanRestfulApiLauncher {
  static get restfulApiConfig () {
    return /** @type {*} */ (renchanRestfulApiConfig)
  }
}
```

**Payload** — auth + routing conventions, generic over query/body/path params:

```js
/**
 * @template {Record<string, *>} [QP = {}] - Query parameters.
 * @template {Record<string, *>} [BP = {}] - Body parameters.
 * @template {Record<string, *>} [PP = {}] - Path parameters.
 * @abstract
 * @extends {BaseRenchanRestfulApiPayload<QP, BP, PP>}
 */
export default class BaseAppRenchanRestfulApiPayload extends BaseRenchanRestfulApiPayload {
  static get ACCESS_TOKEN_HEADER_KEY () {
    return HEADER_KEY.ACCESS_TOKEN
  }

  static get ACCESS_TOKEN_STORAGE_KEY () {
    return STORAGE_KEY.ACCESS_TOKEN
  }

  static get prefixPathname () {
    return '/v1'
  }
}
```

**Capsule** — currently a no-op passthrough; concrete capsules add getters like the GraphQL ones:

```js
/**
 * @abstract
 * @extends {BaseRenchanRestfulApiCapsule}
 */
export default class BaseAppRenchanRestfulApiCapsule extends BaseRenchanRestfulApiCapsule {
  // noop
}
```

**Config** — `BASE_URL` populated at runtime by `plugins/000.furo.js` from `RENCHAN_RESTFUL_API_BASE_URL` ([[hf-furo-env]], [[hf-nuxt]]):

```js
/** @type {{ BASE_URL: string | null }} */
export default {
  BASE_URL: null,
}
```
