# Reactivity, Stores & Styling

## Reactivity, Stores, and Lifecycle

Create reactive state in `setup` and inject it (plus any stores) into the context via `create({...})`. Register lifecycle hooks inside `setupComponent()`.

```js
setup (props, componentContext) {
  const statusReactive = reactive({
    hasCopiedContent: false,
  })
  const toastStore = useToastStore()

  const args = {
    props,
    componentContext,
    statusReactive,
    toastStore,
  }

  const context = CopyButtonContext.create(args)
    .setupComponent() // registers onBeforeUnmount, etc.; returns `this`

  return {
    context,
  }
}
```

Never create refs/computed/reactive inside the context class, and never call a composable inside the context — do both in `setup`. See [[hf-furo-context-patterns]].

## Styling

- Always `<style scoped>` at the bottom of the `.vue`.
- Root element class is `unit-<name>` (`.unit-button`, `.unit-dialog`, `.unit-wallet-history`); children are short descendant chains.
- Use design tokens (`var(--color-surface-primary)`, `var(--font-size-medium)`).
- Cross-component overrides use `:deep(...)` (e.g. `:deep(.unit-table ...)`).
- Range media queries: `@media (48rem <= width) { ... }`.

Full rules in [[hf-css]].
