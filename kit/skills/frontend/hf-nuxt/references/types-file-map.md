# File map & conventions

## Files

```
types/furo-nuxt.d.ts       # RuntimeConfig / PublicRuntimeConfig augmentation + furo.* namespace
types/global.d.ts          # global utility types: RequiredExcept, OptionalExcept, NullableExcept
types/graphql-schema.d.ts  # namespace schema.graphql (generated; see graphql-types skill)
types/router.d.ts          # vue-router RouteMeta augmentation
types/robot-payment.d.ts   # third-party ambient consts
```

## Conventions

- Shared/ambient types → `types/`, kebab-case `.d.ts` named by domain.
- Global helpers via `declare global`; framework config via `declare module 'nuxt/schema'`; router meta via `declare module 'vue-router'`; generated GraphQL under `namespace schema.graphql`.
- Add `export {}` at the top so `declare global`/`declare module` augmentations apply as a module (unless the file leads with an `import`, as `furo-nuxt.d.ts` does).
- **Per-file / local types stay as inline JSDoc `@typedef`** in the `.js`/`.vue` file — only cross-cutting/ambient types belong in `types/*.d.ts`.
