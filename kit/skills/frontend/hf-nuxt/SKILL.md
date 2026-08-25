---
name: hf-nuxt
description: "Build a Nuxt/Furo frontend the OpenReach way — route-level page components, reusable Vue components, composables, global state via Nuxt useState stores, the AppShare service on nuxtApp ($furo), route middleware, plugins, ambient runtime/GraphQL type declarations, and layouts, all resting on the Furo Context-class architecture. Use when adding or editing anything under pages/, components/, composables/, stores/, middleware/, plugins/, layouts/, types/, or app/shares/."
metadata:
  author: OpenReachTech
  version: "2026.07.24"
---

# Nuxt

Use this skill when working anywhere in a Nuxt/Furo app. Every UI unit — page, component, layout — is a thin `defineComponent` that wires reactive state and clients in `setup`, delegates all logic to a paired **Context class**, and reads only through `context.*` in the template. Furo apps have **auto-import disabled** (everything is imported by hand) and never use `<script setup>` or the Options API; app code is JavaScript + JSDoc.

> Foundation: [[hf-furo-context-patterns]] (the Context contract that pages, components, layouts, stores, and app-share all build on). See also [[hf-css]] for the `.unit-` styling rules and [[hc-jsdoc]] / [[types]] for typing.

## Pages

Route-level page components under `pages/`. A page is a thin `defineComponent` that delegates to a `PageContext`.

| Topic | Description | Reference |
| --- | --- | --- |
| Route file structure | `index.vue`-per-route, `[id]`/`[idHash]` dynamic segments, the `(parents)` group, and the sibling `.js` files stripped from the route table | [pages-route-structure](references/pages-route-structure.md) |
| Page component shape | `setup` building `args` and creating contexts — simple, data-fetching, and mutation pages, plus the shared `statusReactive`/`errorMessageHashReactive` vocabulary | [pages-component](references/pages-component.md) |
| PageContext class | `<Feature>PageContext.js` extending `BaseAppContext` — `create()`/`setupComponent()` and template getters/methods | [pages-context](references/pages-context.md) |
| definePageMeta & styling | `definePageMeta` (layout/alias/title, no per-page middleware) and `.unit-page` scoped styling | [pages-meta-styling](references/pages-meta-styling.md) |

## Components

Reusable Vue components under `components/`. Every component is an `Xxx.vue` + `XxxContext.js` pair.

| Topic | Description | Reference |
| --- | --- | --- |
| Tiers & file layout | The `components/` tier taxonomy (units, atoms, molecules, organisms, composites, pages, layouts, toast) and the `Xxx.vue` + `XxxContext.js` file layout | [components-tier-taxonomy](references/components-tier-taxonomy.md) |
| Component shape & imports | The `defineComponent` + `setup` skeleton, `context.*` template access, and explicit imports (auto-import is off) | [components-shape](references/components-shape.md) |
| Props & emits | Object-form props with JSDoc `PropType` casts, and `emits` referencing the context's `EMIT_EVENT_NAME` map | [components-props-emits](references/components-props-emits.md) |
| Reactivity, stores & styling | Creating reactive state/stores in `setup` and injecting into the context, lifecycle hooks, and `<style scoped>` `.unit-` rules | [components-reactivity-styling](references/components-reactivity-styling.md) |

## Composables

Reusable stateful logic in `composables/` — called in `setup` and injected into Context classes, never called inside a context.

| Topic | Description | Reference |
| --- | --- | --- |
| Conventions & placement | `use*` naming, two export styles, single params object, object-of-functions returns, repo-root `composables/` location | [composables-conventions](references/composables-conventions.md) |
| `useApp*` wrappers | Thin wrappers over `@openreachtech/furo-nuxt` base composables — spread + override, `afterRequest` auth hook | [composables-useapp-wrappers](references/composables-useapp-wrappers.md) |
| Setup-only rule | Why composables must be called in `setup` and injected into contexts, never inside a context | [composables-setup-only-rule](references/composables-setup-only-rule.md) |
| Debounce composables | `useDebounce`/`useKeyedDebounce` arrow-const style, single debounced function, timer cleanup on unmount | [composables-debounce](references/composables-debounce.md) |

## State

Global reactive state via Nuxt `useState` (no Pinia). Each store is a `use*Store` composable injected into contexts from `setup`.

| Topic | Description | Reference |
| --- | --- | --- |
| Store pattern | `use*Store` wrapping `useState`, `<domain>StateRef` + getters/actions as inner named functions, typedefs | [state-store-pattern](references/state-store-pattern.md) |
| Rules | `useState` keys, direct mutation, single-params-object actions, async actions, typedef placement | [state-rules](references/state-rules.md) |
| Consumption | Calling in `setup`/middleware/plugins and injecting into contexts | [state-consumption](references/state-consumption.md) |

## App share

App-wide shared services and reactive UI state that live on `nuxtApp` — the `AppShare` instance provided as `$furo`.

| Topic | Description | Reference |
| --- | --- | --- |
| AppShare | What `AppShare` is (a `FuroShare` subclass holding app-wide services/state, commonly reactive UI state), how the plugin builds and provides it as `$furo`, reading it via `useNuxtApp()` and delegating through a Context, and the conventions | [app-share](references/app-share.md) |

## Middleware

Route middleware under `middleware/` — all global, ordered by numeric prefix.

| Topic | Description | Reference |
| --- | --- | --- |
| Structure | File naming/ordering (`NNN.<name>.global.js`) and the `goNextAsIs()` return convention | [middleware-structure](references/middleware-structure.md) |
| Patterns | Auth gateway, customer data bootstrap, and page-title SEO middleware | [middleware-patterns](references/middleware-patterns.md) |
| Conventions | Module-top constants, return rules, and shared auth/state helpers | [middleware-conventions](references/middleware-conventions.md) |

## Plugins

Nuxt plugins under `plugins/` — register shared services, bootstrap config, hook into app lifecycle.

| Topic | Description | Reference |
| --- | --- | --- |
| Naming & forms | `plugins/NNN.<name>[.client\|.server].js` ordering, `defineNuxtPlugin` bare vs object form, conventions | [plugins-naming-and-forms](references/plugins-naming-and-forms.md) |
| Providing & consuming services | `return { provide }` → `$furo`/`$md`, the `000.furo.js` wiring hub, using stores/reactivity inside a plugin | [plugins-providing-services](references/plugins-providing-services.md) |

## Runtime types

Ambient/shared type declarations in `types/*.d.ts`, referenced globally rather than imported.

| Topic | Description | Reference |
| --- | --- | --- |
| File map & conventions | What lives in each `types/*.d.ts` file; naming, `declare global`/`declare module`, `export {}`, local-vs-ambient rules | [types-file-map](references/types-file-map.md) |
| Runtime config augmentation | Typing `useRuntimeConfig().public.<VAR>` via `nuxt/schema` `RuntimeConfig`/`PublicRuntimeConfig` in `furo-nuxt.d.ts` | [types-runtime-config](references/types-runtime-config.md) |
| Global utility & GraphQL types | `RequiredExcept`/`OptionalExcept`/`NullableExcept` in `global.d.ts`; the generated `schema.graphql` namespace | [types-global-utility-types](references/types-global-utility-types.md) |
| Router meta & third-party ambient | `vue-router` `RouteMeta` augmentation (`headerTitle`); ambient consts for injected external scripts | [types-router-and-ambient](references/types-router-and-ambient.md) |

## Layouts

Nuxt layouts under `layouts/` — same Context Class architecture as pages, but only when they have behavior.

| Topic | Description | Reference |
| --- | --- | --- |
| Layouts & selection | Typical layout files (`default`/`settings`/`gateway`) and how pages select them via `layout:` | [layouts-and-selection](references/layouts-and-selection.md) |
| Layout context | Context only when there's behavior — `*LayoutContext` with `default.vue` vs. plain component `gateway.vue` | [layouts-context](references/layouts-context.md) |
| Nesting & slots | Nesting via `<NuxtLayout name>` for `settings.vue`, and preferring `<slot/>` over `<NuxtPage/>` | [layouts-nesting-and-slots](references/layouts-nesting-and-slots.md) |
| Conventions | Filenames, context placement/naming, `.unit-layout` root, param typedefs | [layouts-conventions](references/layouts-conventions.md) |
