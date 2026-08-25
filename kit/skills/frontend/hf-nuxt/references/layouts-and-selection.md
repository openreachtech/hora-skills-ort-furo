# Layouts & selection

## Typical layouts

```
layouts/default.vue      + layouts/DefaultLayoutContext.js
layouts/settings.vue     + layouts/SettingsLayoutContext.js
layouts/gateway.vue      (no context — purely presentational)
```

- `default.vue` is the implicit layout for every page that does not set `definePageMeta({ layout })`. It renders app chrome (`AppSidebar`, `AppSidebarOverlay`, `AppHeader`, `AppToastContainer`) and page content in `<main class="main"><slot /></main>`.
- Named layouts are selected by filename stem: `layout: 'gateway'`, `layout: 'settings'`.

## Layout selection (from pages)

- `layout: 'gateway'` → auth pages: `login`, `sign-up`, `create-account`, `forgot-password`, `reset-password`.
- `layout: 'settings'` → all `pages/settings/**` leaves.
- No `layout:` set → `default`.
