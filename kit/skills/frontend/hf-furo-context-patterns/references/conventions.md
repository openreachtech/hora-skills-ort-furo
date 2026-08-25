# Taxonomy, naming, and typedefs

## Taxonomy and placement

| Suffix | Role | Placement |
| --- | --- | --- |
| `*PageContext` | Page orchestration, getters, watchers | Next to `index.vue` in the page folder |
| `*SubmitterContext` | Form/mutation submission | Page folder; shared ones in `app/vue/contexts/submitters/` |
| `*LayoutContext` | Layout logic | `layouts/` |
| `*Context` | Component logic | Next to the component under `components/` |

Page-specific fetchers/submitters/form-clerks are **colocated** with the page. Cross-page/shared contexts go under `app/vue/contexts/` (e.g. `ErrorPageContext`, `submitters/SignOutSubmitterContext`).

## Method naming conventions

- Event handlers bound in templates: **`...OnEvent`** (`signOutOnEvent`, `fetchAnnouncementsOnEvent`); mounted fetches: `...OnMounted`.
- Predicates: `should...` / `has...` / `is...`.
- Builders: `generate...` / `compose...` / `build...`.
- Extractors: `extract...`.
- Launcher hooks getter: `get <operation>LauncherHooks()`.

## JSDoc typedefs

At the bottom of the file, define `<Name>ContextParams` (extends `BaseFuroContextParams`) and `<Name>ContextFactoryParams` (alias of Params, or `RequiredExcept<Params, 'optionalField'>`). `@import` blocks pull types from `#app`, `vue`, `vue-router`, sibling `./index.vue`, fetchers, and GraphQL payload/capsule modules. See [[hc-jsdoc]].
