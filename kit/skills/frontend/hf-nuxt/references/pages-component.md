# Page Component Shape

`setup(props, componentContext)` is the **only** place that touches Vue primitives, composables, and client creation. Build an `args` object, create the context(s), and return them.

## Simple page

```vue
<script>
import {
  defineComponent,
} from 'vue'

import DocumentsPageContext from './DocumentsPageContext'

export default defineComponent({
  setup (
    props,
    componentContext
  ) {
    const args = {
      props,
      componentContext,
    }

    const context = DocumentsPageContext.create(args)
      .setupComponent()

    return {
      context,
    }
  },
})
</script>

<template>
  <div class="unit-page">
    Documents
  </div>
</template>
```

## Data-fetching page

```js
setup (props, componentContext) {
  definePageMeta({
    alias: '/',
    $furo: {
      pageTitle: `ダッシュボード ⋅ ${DEFAULT_PAGE_TITLE}`,
    },
    headerTitle: 'ダッシュボード',
  })

  const customerStore = useCustomerStore()

  /** @type {Reactive<ErrorMessageHash>} */
  const errorMessageHashReactive = reactive({
    announcements: null,
  })

  /** @type {Reactive<UserInterfaceState>} */
  const statusReactive = reactive({
    isFetchingAnnouncements: false,
    isFetchingWalletBalances: false,
  })

  const announcementsGraphqlClient = useAppGraphqlClient(AnnouncementsQueryGraphqlLauncher)
  const walletBalancesGraphqlClient = useAppGraphqlClient(WalletBalancesQueryGraphqlLauncher)

  const fetcher = DashboardFetcher.create({
    graphqlClientHash: {
      announcements: announcementsGraphqlClient,
      walletBalances: walletBalancesGraphqlClient,
    },
    errorMessageHashReactive,
    statusReactive,
  })

  const args = {
    props,
    componentContext,
    customerStore,
    fetcher,
    errorMessageHashReactive,
    statusReactive,
  }

  const context = DashboardPageContext.create(args)
    .setupComponent()

  return {
    context,
  }
}
```

## Page with a mutation

Return both contexts; the template submits through the submitter:

```js
return {
  context,
  submitterContext,
}
```

```vue
@add-to-cart="submitterContext.addToCart({
  productId: $event.productId,
  quantity: $event.quantity,
})"
```

## Shared reactive vocabulary

Pages create two reactive hashes in `setup` and pass them into the PageContext/Fetcher/SubmitterContext:

- `statusReactive` — typed `Reactive<UserInterfaceState>`; loading flags like `isFetching<Entity>` / `isInvoking<Operation>`.
- `errorMessageHashReactive` — typed `Reactive<ErrorMessageHash>`; per-operation error strings.

`UserInterfaceState` and `ErrorMessageHash` typedefs are **exported from `index.vue`** and imported by the sibling `.js` files via JSDoc `@import` — see [[hf-error-handling]] and [[hc-jsdoc]].
