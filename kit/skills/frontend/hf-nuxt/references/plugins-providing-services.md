# Providing and consuming services

## Providing services

Return `{ provide: { <key>: value } }`. The key becomes `$<key>` on `nuxtApp`:

- `000.furo` provides `furo` → `$furo` (an `AppShare` instance, [app share](app-share.md)).
- `005.markdownit` provides `md` → `$md`.

Consume via `const { $furo } = useNuxtApp()` in `setup`, then inject into a Context — never call `$furo`/`$md` from templates directly.

## `000.furo.js` — the wiring hub

- Mutates singleton config objects (`graphqlConfig`, `renchanRestfulApiConfig`) from `useRuntimeConfig().public.*` — see [[hf-graphql]] and [[restful-api]].
- Builds a `FuroGraphqlShare` (via `useSubscriptionConnector`).
- Creates `reactive({ showsSidebar: false })` as `sharedInterfaceStateReactive` and calls `AppShare.create({ graphqlShare, sharedInterfaceStateReactive })`.

## Consuming stores/reactivity in a plugin

Plugins may use stores and watchers. `002.channelTalk.client.js` is gated on `runtimeConfig.public.CHANNEL_TALK_PLUGIN_KEY`, calls `useCustomerStore()`, and `watch(() => customerStore.customerStateRef.value.customer, ...)` to boot/shutdown/update the Channel.io SDK.
