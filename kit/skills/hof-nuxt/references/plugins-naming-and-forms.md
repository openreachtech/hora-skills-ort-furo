# Naming and plugin forms

## Typical plugins (load in prefix order)

```
plugins/000.furo.js                  # AppShare + GraphQL/REST config bootstrap (universal)
plugins/002.channelTalk.client.js    # Channel.io SDK (client only)
plugins/005.markdownit.client.js     # markdown-it, provides $md (client only)
```

Naming: `plugins/NNN.<name>[.client|.server].js` — 3-digit ordering prefix, camelCase name, `.client` for browser-only. `000.furo` runs first.

## Two plugin forms

**Bare form** (`000.furo.js`):

```js
export default defineNuxtPlugin(async () => {
  setupGraphqlConfig()
  setupRestfulApiConfig()

  const $furo = await createShare({
    config: graphqlConfig,
  })

  return {
    provide: {
      furo: $furo,
    },
  }
})
```

**Object form** with a `name` (`005.markdownit.client.js`):

```js
export default defineNuxtPlugin({
  name: 'markdown-it',

  async setup (nuxtApp) {
    const md = markdownit({
      html: false,
      linkify: true,
      typographer: false,
    })

    return {
      provide: {
        md,
      },
    }
  },
})
```

`defineNuxtPlugin` is imported from `nuxt/app` or `#imports` (both appear).

## Conventions

- Numeric ordering prefix; `.client`/`.server` when platform-specific.
- Provide keys are camelCase → `$<key>` on `nuxtApp`.
- Runtime values always from `useRuntimeConfig().public.*`, never hard-coded.
- Auto-registered from the top level of `plugins/` (nested files would need explicit registration in `nuxt.config.js`).
