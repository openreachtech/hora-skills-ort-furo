# Dependency injection and template access

## Created in `setup`, injected into factory method `create`

All reactive state, composables, clients, stores, routers, fetchers, and form clerks are created in the component/page `setup` and passed into `create({...})`. **Never create refs/computed/reactive inside a context, and never call a composable inside a context.**

```js
// pages/announcements/index.vue
setup (props, componentContext) {
  const route = useRoute()
  const router = useRouter()
  const statusReactive = reactive({
    isFetchingAnnouncements: true,
  })
  const errorMessageHashReactive = reactive({
    announcements: null,
  })

  const announcementsGraphqlClient = useAppGraphqlClient(AnnouncementsQueryGraphqlLauncher)
  const fetcher = AnnouncementsFetcher.create({
    statusReactive,
    errorMessageHashReactive,
    graphqlClientHash: {
      announcements: announcementsGraphqlClient,
    },
  })

  const args = {
    props,
    componentContext,
    route,
    router,
    statusReactive,
    errorMessageHashReactive,
    fetcher,
  }
  const context = AnnouncementsPageContext.create(args)
    .setupComponent()

  return {
    context,
  }
}
```

Optional dependencies get a default in `create()`, typed via `RequiredExcept`:

```js
static create ({
  props,
  componentContext,
  // ...
  localStorageClerk = this.createLocalStorageClerk(),
}) {
  return new this({
    props,
    componentContext,
    /* ... */
    localStorageClerk,
  })
}

static createLocalStorageClerk () {
  return StorageClerk.createAsLocal()
}
```

## Templates access everything through the context

Getters for computed values (`context.announcements`), methods for logic (`context.shouldHideAnnouncementsPagination()`), reactive hashes exposed as fields (`context.statusReactive.isFetchingAnnouncements`). A page may return several contexts (`return { context, signInSubmitterContext }`) and the template routes events to the right one:

```vue
@submit.prevent="signInSubmitterContext.submitForm({
  formElement: /** @type {HTMLFormElement} */ ($event.target),
})"
```
