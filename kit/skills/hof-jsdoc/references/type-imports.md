# Type-only Imports in a Furo App

The two type-only-import styles, the `@import` block tag and the inline `import('…')`
expression, are defined in [[hoc-jsdoc]] — one source module per block, one symbol per line
with a trailing comma, the extension always written, never `import type`, never both styles for
one type. This file gives their Furo forms, and the rules that exist only because of `.vue` and
Nuxt. Where each block sits in a file is in [placement.md](placement.md).

## The `@import` tag

### Placement

`@import` blocks live at the end of the file, or at the **end of the `<script>` block** in a
`.vue` file, as [placement.md](placement.md) settles. A run of blocks there reads:

```js
/**
 * @import {
 *   Reactive,
 * } from 'vue'
 */

/**
 * @import {
 *   useRouter,
 * } from 'vue-router'
 */

/**
 * @import {
 *   BaseFuroContextParams,
 * } from '@openreachtech/furo-nuxt/lib/contexts/BaseFuroContext.js'
 */
```

### Named import

```js
/**
 * @import {
 *   Reactive,
 *   ShallowRef,
 * } from 'vue'
 */
```

### Default import (one-line shorthand)

For a module whose default export is the type you need — composables, GraphQL `*Payload` /
`*Capsule` classes, module classes — the single-line form is idiomatic:

```js
/**
 * @import useAppGraphqlClient from '~/composables/useAppGraphqlClient.js'
 */

/**
 * @import SignOutMutationGraphqlCapsule from '~/app/graphql/client/mutations/signOut/SignOutMutationGraphqlCapsule.js'
 */
```

### Default import via `default as` (braced)

The braced equivalent of the shorthand, aliasing a module's default export to a local name.
**Reserve this form for single-file components** (`.vue`, whose only export is the default):

```js
/**
 * @import {
 *   default as AppDialog,
 * } from '~/components/units/AppDialog.vue'
 */
```

Do **not** use the braced `default as` form for a class default export (`.js` composables,
GraphQL `*Payload` / `*Capsule` classes, module classes) — use the one-line shorthand above
instead:

```js
// Do not
/**
 * @import {
 *   default as UpdateEmailMutationGraphqlCapsule,
 * } from '~/app/graphql/client/mutations/updateEmail/UpdateEmailMutationGraphqlCapsule.js'
 */

// Do
/**
 * @import UpdateEmailMutationGraphqlCapsule from '~/app/graphql/client/mutations/updateEmail/UpdateEmailMutationGraphqlCapsule.js'
 */
```

### Consuming imported types

Once imported, a type is referenced by its bare name:

```js
/** @type {Reactive<ErrorMessageHash>} */

/**
 * @typedef {BaseFuroContextParams & {
 *   router: ReturnType<typeof useRouter>
 *   customerStore: CustomerStore
 *   dialogComponentShallowRef: ShallowRef<AppDialog | null>
 * }} SignOutSubmitterContextParams
 */
```

Sibling local typedefs (`ErrorMessageHash`, `ComponentProps`, `FormField`, …) are declared at
the bottom of one `<script>`/file and re-imported across sibling files via
`@import { ErrorMessageHash } from './Component.vue'`.

### An inline `import('…')` in an `@import`-style file

If an inline `import('…')` creeps in for a one-off — typically a single Vue ref — promote it to
a named `@import` block so the file stays in one style:

```js
// prefer this, with `Ref` from an `@import { Ref } from 'vue'` block…
/** @type {Ref<ReturnType<typeof setTimeout> | null>} */
const timeoutIdRef = ref(null)

// …over the inline form in an `@import`-style file
/** @type {import('vue').Ref<ReturnType<typeof setTimeout> | null>} */
const timeoutIdRef = ref(null)
```

## The `import('…')` expression

Some Furo apps use `import('…')` inline everywhere; others use `@import` blocks. Follow the one
the repository has established.

### Form

```js
import('vue').Ref<HTMLFormElement | null>
import('#app').NuxtError
import('~/stores/customer.js').CustomerStore
import('~/components/units/AppDialog.vue').default
```

The extension stays on a package path too:
`import('@openreachtech/furo-nuxt/lib/contexts/BaseFuroContext.js')`, never
`import('@openreachtech/furo-nuxt/lib/contexts/BaseFuroContext')`.

### Where it appears

- **Vue prop types** — see [vue-props-and-globals.md](vue-props-and-globals.md).
- **Reactive declarations** — see [placement.md](placement.md).
- **`@typedef` aliases** — an imported type aliased to a local name in one line, then used bare:

```js
/**
 * @typedef {import('@openreachtech/furo-nuxt/lib/contexts/BaseFuroContext.js').BaseFuroContextParams} ComponentContextParams
 */

/**
 * @typedef {ComponentContextParams} ComponentContextFactoryParams
 */
```

Where the trade-off against `@import` sends a recurring type to a block, that block sits at the
end of the `<script>` in a `.vue` file.

## Source modules

| Source | For |
| --- | --- |
| `'vue'` | `Reactive`, `Ref`, `ShallowRef`, `PropType`, `ComponentCustomProps`, … |
| `'vue-router'` | `useRoute`, `useRouter` (consumed via `ReturnType<typeof …>`) |
| `'#app'` | Nuxt types such as `NuxtError` |
| `'@openreachtech/furo-nuxt'` / `'@openreachtech/furo-nuxt/lib/contexts/BaseFuroContext.js'` | `BaseFuroContextParams`, furo base types |
| `'~/composables/*.js'` | `use*` / `useApp*` composable defaults |
| `'~/stores/*.js'` | `use*Store` return types (e.g. `CustomerStore`) |
| `'~/app/graphql/client/**/*.js'` | GraphQL `*Payload` / `*Capsule` classes |
| `'~/components/**/*.vue'` | component classes and their local typedefs |
| `'./Component.vue'` / `'./index.vue'` | sibling local typedefs |

Use the `~/` alias for repo-root paths and `./` for siblings — the same aliases Nuxt resolves
at runtime.

Types declared under `declare global` are imported in neither style — see
[vue-props-and-globals.md](vue-props-and-globals.md).
