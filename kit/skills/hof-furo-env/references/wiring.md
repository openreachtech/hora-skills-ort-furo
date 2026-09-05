# Loader and runtimeConfig wiring

`app/globals/furo-env.js` loads the parsed hash once:

```js
import {
  NuxtFuroEnvLoader,
} from '@openreachtech/furo-nuxt'

const furoEnv = NuxtFuroEnvLoader.create()
  .loadEnv()

export default furoEnv
```

`nuxt.config.js` spreads it into **both** server and client config:

```js
import furoEnv from './app/globals/furo-env'

// ...
runtimeConfig: {
  // on server
  ...furoEnv,

  // on client
  public: {
    ...furoEnv,
  },
},
```

## Keeping a variable private (server-only)

The `...furoEnv` spread copies **every** key into `public`, which ships it to the client bundle. When a variable must stay secret (server-side only), exclude it from the `public` spread — destructure it out and spread the rest:

```js
import furoEnv from './app/globals/furo-env'

const {
  MY_SECRET, // kept out of `public`
  ...publicFuroEnv
} = furoEnv

// ...
runtimeConfig: {
  // on server — still has MY_SECRET
  ...furoEnv,

  // on client — MY_SECRET excluded
  public: {
    ...publicFuroEnv,
  },
},
```

Read the secret via `useRuntimeConfig().MY_SECRET` (not `.public`) from server-side code only.

## Reading values at runtime

Always read from `.public` (a Furo SPA — `ssr: false` — reads everything off `public`):

```js
const runtimeConfig = useRuntimeConfig()

const pluginKey = runtimeConfig.public.CHANNEL_TALK_PLUGIN_KEY
```

Example consumers: `plugins/000.furo.js` (`ENDPOINT_URL`, `WEBSOCKET_URL`, `RENCHAN_RESTFUL_API_BASE_URL`), `plugins/002.channelTalk.client.js` (`CHANNEL_TALK_PLUGIN_KEY`).
