# Conventions

- Layout `.vue` uses the lowercase Nuxt filename (`default.vue`); the `layout:` string is the filename stem.
- Layout context files live **directly in `layouts/`**, named `<PascalLayoutName>LayoutContext.js`.
- Layout root element is `<div class="unit-layout">` (modifiers as extra classes, e.g. `class="unit-layout settings"`).
- Layout context params extend `BaseFuroContextParams` with injected deps (e.g. `customerStore: CustomerStore`).
- The `statusReactive: Reactive<UserInterfaceState>` pattern is a **page-level** convention; layouts don't need it.
