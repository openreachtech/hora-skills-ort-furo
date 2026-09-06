# Context only when there's behavior

A layout gets a `*LayoutContext` when it has logic; otherwise it stays a plain presentational component.

## With context (`default.vue`)

```vue
<script>
import {
  defineComponent,
} from 'vue'

import DefaultLayoutContext from './DefaultLayoutContext.js'

export default defineComponent({
  setup (
    props,
    componentContext
  ) {
    const customerStore = useCustomerStore()

    const args = {
      props,
      componentContext,
      customerStore,
    }

    const context = DefaultLayoutContext.create(args)
      .setupComponent()

    return {
      context,
    }
  },
})
</script>

<template>
  <div
    class="unit-layout"
    :class="{ 'with-inactive-profile': !context.isActiveProfile() }"
  >
    <AppSidebar class="sidebar" />
    <AppSidebarOverlay class="sidebar-overlay" />

    <div class="content">
      <AppHeader />
      <main class="main">
        <slot />
      </main>
    </div>

    <AppToastContainer />
  </div>
</template>
```

The context extends `BaseAppContext`, takes `{ props, componentContext, customerStore }`, and exposes getters/methods the template consumes:

```js
export default class DefaultLayoutContext extends BaseAppContext {
  constructor ({
    props,
    componentContext,
    customerStore,
  }) {
    super({
      props,
      componentContext,
    })
    this.customerStore = customerStore
  }

  static create ({
    props,
    componentContext,
    customerStore,
  }) {
    return new this({
      props,
      componentContext,
      customerStore,
    })
  }

  isActiveProfile () {
    return this.customerStore.isActiveProfile()
  }
}

/**
 * @typedef {BaseFuroContextParams & {
 *   customerStore: CustomerStore
 * }} DefaultLayoutContextParams
 */
```

## Without context (`gateway.vue`)

A behavior-free layout is a plain object (not even `defineComponent`):

```vue
<script>
import AppToastContainer from '~/components/toast/AppToastContainer.vue'

export default {
  name: 'GatewayLayout',

  components: {
    AppToastContainer,
  },
}
</script>

<template>
  <div class="unit-layout">
    <main class="main">
      <slot />
    </main>

    <AppToastContainer />
  </div>
</template>
```
