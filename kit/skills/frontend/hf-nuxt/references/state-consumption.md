# Consumption

Call the composable anywhere a composable is valid — component/page `setup`, middleware, plugins — then pass the store into a context:

```js
// in setup
const customerStore = useCustomerStore()

const context = AppHeaderContext.create({
  props,
  componentContext,
  customerStore,
})
  .setupComponent()
```

Contexts read the store via `this.customerStore.customerStateRef.value.*` and call its actions. Never call `useCustomerStore()` inside a context class — call it in `setup` and inject. See [[hf-furo-context-patterns]] for injection and [composables](./composables-conventions.md) for the setup-only rule.
