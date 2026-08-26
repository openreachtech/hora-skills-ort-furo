# The Nuxt error page — `error.vue`

`error.vue` (repo root) receives the `NuxtError` prop and delegates to `ErrorPageContext` (`app/vue/contexts/ErrorPageContext.js`):

```js
const context = ErrorPageContext.create({
  props,
  componentContext,
})
  .setupComponent()
```

It renders `context.errorStatusCode` + `context.errorMessage` with a "return home" link. The label is a locale path rendered with `t('actions.returnHome')` so the page follows the active language — matching the [dictionaries](dictionaries.md).
