# App share (`AppShare`)

App-wide shared services and state that live on `nuxtApp` — the `AppShare` instance provided as `$furo`.

## What `AppShare` is

`app/shares/AppShare.js` is a **class extending `FuroShare`** from `@openreachtech/furo-nuxt`. It can hold anything app-wide — services, clients, config, or shared state — and expose getters/mutators over it. A Vue `reactive()` UI-state object is one common example: the class below carries `sharedInterfaceStateReactive` and exposes sidebar getters/mutators over it.

```js
import {
  FuroShare,
} from '@openreachtech/furo-nuxt'

export default class AppShare extends FuroShare {
  constructor ({
    graphqlShare,
    sharedInterfaceStateReactive,
  }) {
    super({
      graphqlShare,
    })

    this.sharedInterfaceStateReactive = sharedInterfaceStateReactive
  }

  static create ({
    graphqlShare,
    sharedInterfaceStateReactive,
  }) {
    return new this({
      graphqlShare,
      sharedInterfaceStateReactive,
    })
  }

  get showsSidebar () {
    return this.sharedInterfaceStateReactive.showsSidebar
  }

  toggleSidebarVisibility () {
    this.sharedInterfaceStateReactive.showsSidebar = !this.sharedInterfaceStateReactive.showsSidebar
  }

  openSidebar () {
    this.sharedInterfaceStateReactive.showsSidebar = true
  }

  closeSidebar () {
    this.sharedInterfaceStateReactive.showsSidebar = false
  }
}

/**
 * @typedef {FuroShareParams & {
 *   sharedInterfaceStateReactive: Reactive<SharedInterfaceState>
 * }} AppShareParams
 */

/**
 * @typedef {{
 *   showsSidebar: boolean
 * }} SharedInterfaceState
 */
```

When `AppShare` holds reactive UI state like this, that state is created **in the plugin** and injected into the constructor — not created inside the class.

## Registration (in `plugins/000.furo.js`)

The plugin builds the GraphQL share, creates the reactive UI state, constructs `AppShare`, and provides it under the `furo` key (→ `nuxtApp.$furo`):

```js
export default defineNuxtPlugin(async () => {
  setupGraphqlConfig()
  setupRestfulApiConfig()

  const $furo = await createShare({
    config: graphqlConfig,
  })

  return {
    provide: {
      furo: $furo,
    },
  }
})

// createShare(...) builds a FuroGraphqlShare, then:
// AppShare.create({ graphqlShare, sharedInterfaceStateReactive })
// createSharedInterfaceStateReactive() => reactive({ showsSidebar: false })
```

## Access and delegation

Access `$furo` where `useNuxtApp()` is valid (component/page/layout `setup`), then pass it into a Context — the Context delegates, templates never call `$furo` directly:

```js
// components/layouts/AppHeader.vue (setup)
const {
  $furo,
} = useNuxtApp()

const context = AppHeaderContext.create({
  props,
  componentContext,
  furo: $furo,
  route,
  customerStore,
})
  .setupComponent()
```

```js
// AppHeaderContext.js
constructor ({
  props,
  componentContext,
  furo,
  /* ... */
}) {
  super({
    props,
    componentContext,
  })
  this.furo = furo
}

toggleSidebarVisibility () {
  this.furo.toggleSidebarVisibility()
}

/**
 * @typedef {BaseFuroContextParams & {
 *   furo: import('~/app/shares/AppShare.js').default
 * }} AppHeaderContextParams
 */
```

## Conventions

- Lives in `app/shares/`, PascalCase class filename (`AppShare.js`), extends a Furo `*Share` base, has a static `create()` factory.
- Provided under the `furo` key → `$furo` on `nuxtApp`.
- Any reactive UI state it holds (e.g. `SharedInterfaceState`) is created in the plugin and injected, never created inside the class.
- `AppShare` = app-wide services/UI state accessed via `nuxtApp`; use a `useState` store instead when the state is a domain data model (`customer`, `toast`).
