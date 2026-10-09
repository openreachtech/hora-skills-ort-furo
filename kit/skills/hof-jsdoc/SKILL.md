---
name: hof-jsdoc
description: "JSDoc conventions that hold only in a Vue / Nuxt / Furo app: where type blocks sit in a file or `<script>` and the forms type-only imports take there, the types reactive declarations and Vue props carry, how a Furo class and its `create()` factory are typed, and the ambient globals used without an import. Use when writing or reviewing JSDoc in a Furo app. The rules every JavaScript file follows, backend included, belong to the shared JSDoc convention."
metadata:
  author: OpenReachTech
  version: "2026.10.10"
---

# JSDoc in a Furo App

The frontend half of the JSDoc conventions. Everything here applies only when writing Vue /
Nuxt / Furo code; the rules every JavaScript file follows — object types written as named
parameters, `@returns` on every function, `Array<T>`, `*` for any, the form of a `@typedef`
block, and the two type-only-import styles themselves — are in [[hoc-jsdoc]], and are not
restated here.

> Foundation: [[hoc-jsdoc]]. See also [[hof-nuxt]] for the app structure these annotations
> sit in, and [[hof-furo-context-patterns]] for the Context classes they type.

## Type-only imports in a Furo app

[[hoc-jsdoc]] defines two type-only-import styles, the `@import` block tag and the inline
`import('…')` expression, and says to follow the one a repository has established.

- **`@import` is the established style in Furo / Nuxt apps.** Write type imports as
  bottom-of-file blocks and reference each type by its bare name.
- **The inline `import('…')` expression is the alternative.** Some Furo apps use it
  everywhere; follow it where it is established, and never mix the two for the same type.

Their Furo forms — the `.vue`-only `default as` form, the Nuxt aliases, the modules each
type comes from — are in [type-imports.md](./references/type-imports.md).

Types declared under `declare global` are imported in neither style — see
[vue-props-and-globals.md](./references/vue-props-and-globals.md).

## References

| Reference | Topic |
| --- | --- |
| [type-imports.md](./references/type-imports.md) | The `@import` tag and the `import('…')` expression in Furo form, the `.vue`-only `default as` form, and the modules types are imported from |
| [placement.md](./references/placement.md) | Where `@typedef` / `@import` blocks go, inline `@type` on reactive declarations, Params / FactoryParams naming |
| [class-typing.md](./references/class-typing.md) | Params / FactoryParams typedef pair, `create()` factory template idiom, `@template` / `@extends` / `@override` / `@property` |
| [vue-props-and-globals.md](./references/vue-props-and-globals.md) | Vue `PropType` on prop definitions in either import style, ambient globals used unqualified |
