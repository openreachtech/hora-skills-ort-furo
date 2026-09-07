# Global utility & GraphQL types

## Global utility types (`global.d.ts`)

`export {}` makes the file a module, then `declare global` exposes helpers used **unqualified** in JSDoc across a Furo app (no `@import` needed):

```ts
export {}

declare global {
  type RequiredExcept<T, K extends keyof T = never> = Omit<T, K> & Partial<Pick<T, K>>
  type OptionalExcept<T, K extends keyof T = never> = Pick<T, K> & Partial<Omit<T, K>>
  type NullableExcept<T, K extends keyof T = never> = {
    [P in keyof T]: P extends K ? T[P] : T[P] | null
  }
}
```

`RequiredExcept` is the standard way to type a context/module `FactoryParams` that has DI-defaulted keys (see [[hof-furo-context-patterns]], [[hoc-jsdoc]]).

## GraphQL schema namespace (`graphql-schema.d.ts`)

Generated entity/input/result types under `declare global { namespace schema.graphql { ... } }`, referenced everywhere as `schema.graphql.<Type>` without import. Full details in [[hof-graphql]].
