# Placement & Naming

How a `@typedef` block itself is written (multi-line, one per block) is in [[hoc-jsdoc]], and
the blank line between blocks in the comment convention; this file covers where the blocks go.

## Placement rules

- **`@typedef` blocks go at the END of the file** (after the class/exports), each in its own `/** ... */` comment. In `.vue`, at the end of `<script>`.
- **`@import { ... } from '...'` type-only imports go at the bottom** of the file / end of `<script>`, one block per source module, multi-line with trailing commas. Never use inline `import type`.

```js
/**
 * @import {
 *   Reactive,
 *   ShallowRef,
 * } from 'vue'
 */

/**
 * @import UpdateEmailMutationGraphqlCapsule from '~/app/graphql/client/mutations/updateEmail/UpdateEmailMutationGraphqlCapsule.js'
 */
```

Which module each type comes from is in the source table of [type-imports](type-imports.md).

## Inline `@type` on reactive declarations

Put `@type {Ref<...>}` / `@type {Reactive<...>}` / `@type {ShallowRef<...>}` directly above the `ref()`/`reactive()`/`shallowRef()` call:

```js
/** @type {Reactive<ErrorMessageHash>} */
const errorMessageHashReactive = reactive({
  updateEmail: null,
  verifyEmail: null,
})

/** @type {Ref<ReturnType<typeof setTimeout> | null>} */
const timeoutIdRef = ref(null)
```

Here `Reactive`/`Ref` are pulled in once via a bottom-of-file `@import { Reactive, Ref } from 'vue'` block (the preferred style). In a repo that uses the inline style instead, write the module into the same place:

```js
/** @type {import('vue').Ref<HTMLFormElement | null>} */
const formRef = ref(null)

/** @type {import('vue').ShallowRef<HTMLInputElement | null>} */
const inputShallowRef = shallowRef(null)
```

Both styles are defined in [[hoc-jsdoc]]; their Furo forms are in [type-imports](type-imports.md).

## Naming

- Params typedef: `<ClassName>Params`; factory params: `<ClassName>FactoryParams`.
- Local component typedefs (`ErrorMessageHash`, `SuccessMessageHash`, `UserInterfaceState`, `FormField`, `ComponentProps`) defined at the end of the `<script>`/file and re-imported across sibling files via `@import ... from './Component.vue'`.
