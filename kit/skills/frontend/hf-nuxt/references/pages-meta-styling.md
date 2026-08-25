# `definePageMeta` & Styling

## `definePageMeta`

Imported from `#imports`. Used for:

- `layout: 'gateway' | 'settings'` — non-default layout (default is implicit).
- `alias: '/'` — dashboard aliases the root.
- `$furo: { pageTitle }` and a custom `headerTitle`.

**Middleware is not defined per page** in a Furo app — no `pages/**` sets `middleware:` (see [middleware](./middleware-structure.md) for the global approach).

## Styling

The page root is always `<div class="unit-page">`. Reusable sub-blocks get their own `unit-` name. Selectors use child combinators and design tokens (`.unit-page > .membership .heading`, `var(--color-...)`). Full rules: [[hf-css]].
