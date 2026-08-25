# Route File Structure

- **Every routable leaf is `index.vue`** inside a feature-named directory — `pages/documents/index.vue`, `pages/wallet/index.vue`. There is no bare `pages/foo.vue` for leaf routes.
- **Dynamic segments** use bracketed folders whose name matches the route param: `pages/products/[id]/`, `pages/subscriptions/[id]/`, `pages/settings/address/[addressId]/`, `pages/order-history/[idHash]/` (`[id]` = numeric, `[idHash]` = hashed). Read the param with `useRoute()`.
- **`(parents)` group** — `pages/(parents)/*.vue` are parenthesized wrappers (ignored in the URL) that act as the parent route for a same-named child folder. `pages/(parents)/settings.vue` parents `pages/settings/*`. Each is a minimal `<NuxtPage />` shell, optionally setting shared `definePageMeta`.

## Sibling `.js` files (stripped from the route table)

Alongside `index.vue`, place these siblings **in the same folder**:

| File | Role |
| --- | --- |
| `<Feature>PageContext.js` | Page orchestration — lifecycle, watchers, template getters |
| `<Feature>Fetcher.js` | Data loading (see [[fetcher-operation]]) |
| `<Feature>SubmitterContext.js` | Mutation submission (see [[mutation-operation]]) |
| `<Feature>FormElementClerk.js` | Form validation rules |
| `<Feature>ItemContext.js` | Per-row/item sub-context |

These `.js` files live inside `pages/` but `nuxt.config.js` removes them from the route table via the `pages:extend` hook, so they never become routes:

```js
// nuxt.config.js
hooks: {
  'pages:extend' (pages) {
    kickOutJsFilesFromPages({
      pages,
    }) // filters out page.file endsWith('.js')
  },
},
```
