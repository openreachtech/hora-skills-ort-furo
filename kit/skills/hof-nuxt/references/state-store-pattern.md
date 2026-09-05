# Store pattern

## Example stores

```
stores/customer.js   → useCustomerStore
stores/toast.js      → useToastStore
```

## The shape

A store is a default-exported function named `use<Domain>Store` that wraps `useState('<key>', () => defaultState)` and returns a plain object exposing a single `<domain>StateRef` plus getter/action closures. Actions are **inner named `function` declarations** (hoisted) placed below the `return`.

```js
import {
  useState,
} from '#imports'

/**
 * Use `toast` store.
 *
 * @returns {ToastStore}
 */
export default function useToastStore () {
  /** @type {ToastState} */
  const defaultToastState = {
    toasts: [],
  }

  const toastStateRef = useState('toast', () => defaultToastState)

  return {
    toastStateRef,
    add,
    dismiss,
  }

  function add (toast) {
    toastStateRef.value.toasts.push(/* ... */)
  }

  function dismiss ({
    id,
  }) {
    // splice from toastStateRef.value.toasts
  }
}

/**
 * @typedef {{
 *   toastStateRef: import('vue').Ref<ToastState>
 *   add: (toast: Toast) => void
 *   dismiss: (params: { id: string }) => void
 * }} ToastStore
 */

/**
 * @typedef {{
 *   toasts: Array<Toast>
 * }} ToastState
 */
```

`customer.js` groups its members with comment sections (`// State`, `// Getters`, `// Actions`) and includes getters (`hasSignedIn`, `isActiveProfile`), setters, updaters, clearers.
