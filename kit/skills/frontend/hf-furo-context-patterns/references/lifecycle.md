# Lifecycle contract: constructor + `create()` + `setupComponent()`

Every context defines all three with **identical single-object destructured params**:

```js
export default class AnnouncementsPageContext extends BaseAppContext {
  constructor ({
    props,
    componentContext,
    route,
    router,
    statusReactive,
    errorMessageHashReactive,
    fetcher,
  }) {
    super({
      props,
      componentContext,
    })

    this.route = route
    this.router = router
    this.statusReactive = statusReactive
    this.errorMessageHashReactive = errorMessageHashReactive
    this.fetcher = fetcher
  }

  static create (args) {
    return new this(args)
  }

  setupComponent () {
    this.watch(
      [
        () => this.route.query.page,
        () => this.route.query.priority,
      ],
      async () => {
        await this.fetcher.fetchAnnouncementsOnEvent({
          input: this.buildAnnouncementsInput(),
        })
      },
      {
        immediate: true,
      }
    )

    return this
  }

  get announcements () {
    return this.fetcher.announcementsCapsule
      .announcements
  }
}
```

Rules:

- **`super({ props, componentContext })` is always called.** Base params are always `{ props, componentContext }`; everything else is an injected dependency assigned to `this.*`.
- **Instantiate only via `create()`** — pages call `SomeContext.create(args).setupComponent()` and return the instance. Never `new SomeContext(...)` from a page.
- **`setupComponent()` is the lifecycle hook** (overrides the base no-op). It registers `this.watch(...)` (often route-query driven with `{ immediate: true }` to fetch on mount) and `onBeforeUnmount(...)`, then returns `this` for chaining.
