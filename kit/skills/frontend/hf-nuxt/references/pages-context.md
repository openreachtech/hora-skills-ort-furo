# PageContext class

Lives as a sibling `<Feature>PageContext.js`, extends `BaseAppContext`, defines `constructor` + static `create()` + `setupComponent()` (which kicks off mounted fetches and returns `this`). Expose computed values as getters, logic as methods.

```js
export default class DashboardPageContext extends BaseAppContext {
  constructor ({
    props,
    componentContext,
    customerStore,
    fetcher,
    errorMessageHashReactive,
    statusReactive,
  }) {
    super({
      props,
      componentContext,
    })

    this.customerStore = customerStore
    this.fetcher = fetcher
    this.errorMessageHashReactive = errorMessageHashReactive
    this.statusReactive = statusReactive
  }

  static create (args) {
    return new this(args)
  }

  setupComponent () {
    this.fetcher.fetchAnnouncementsOnMounted()
    this.fetcher.fetchWalletBalancesOnMounted()

    return this
  }

  get isFetchingWalletBalances () {
    return this.statusReactive.isFetchingWalletBalances
  }

  get announcements () {
    return this.fetcher.announcementsCapsule
      ?.announcements
      ?? []
  }
}

/**
 * @import { ErrorMessageHash, UserInterfaceState } from './index.vue'
 * @import DashboardFetcher from './DashboardFetcher.js'
 */
```

Templates read only through `context.*` — getters (`context.announcements`), predicate methods (`context.hasMembership()`), formatters (`context.formatBalance()`), and the exposed reactive hashes (`context.statusReactive`, `context.errorMessageHashReactive`).
