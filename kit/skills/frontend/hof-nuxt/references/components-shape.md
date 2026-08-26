# Component Shape & Imports

## Component Shape

```vue
<script>
import {
  defineComponent,
} from 'vue'

import AppButtonContext from './AppButtonContext.js'

export default defineComponent({
  components: {
    // every referenced component registered explicitly (no auto-import)
  },

  props: {
    color: {
      /** @type {import('vue').PropType<ButtonColor>} */
      type: String,
      required: false,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'neutral'].includes(value),
    },
  },

  emits: [
    // reference the context's static event-name map, not raw strings
  ],

  setup (
    props,
    componentContext
  ) {
    const args = {
      props,
      componentContext,
    }

    const context = AppButtonContext.create(args)
      .setupComponent()

    return {
      context,
    }
  },
})
</script>
```

The template accesses **everything** through `context.*`:

```vue
<template>
  <button
    class="unit-button"
    :class="{
      primary: context.isPrimaryColorButton(),
      filled: context.isFilledButton(),
    }"
    :disabled="context.shouldDisableButton()"
    @click="context.onClick($event)"
  >
    <slot />
  </button>
</template>
```

## Imports (auto-import is OFF)

`nuxt.config.js` sets `components: { dirs: [] }` and `imports: { autoImport: false }`. Import everything explicitly:

- **Vue APIs** — from `'vue'`: `defineComponent`, `ref`, `reactive`, `computed`.
- **Nuxt built-in components** — from `'#components'`: `import { Icon, NuxtLink } from '#components'`.
- **Other components** — absolute alias with extension: `import AppDialog from '~/components/units/AppDialog.vue'`.
- **Sibling context** — relative: `import XxxContext from './XxxContext.js'`.
- **Composables/stores** — explicit import, then called in `setup` and passed into the context (see [composables](./composables-conventions.md), [stores](./state-store-pattern.md)).

Every referenced component must appear in the `components: {}` block of `defineComponent`.
