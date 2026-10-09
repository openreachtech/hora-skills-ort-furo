# Vue Props & Ambient Globals

The function and method annotation rules these examples follow (single-object `@param`,
always-present `@returns` with a description) are in [[hoc-jsdoc]].

## Vue prop types

Inline `@type {PropType<...>}` on the prop's `type` field:

```js
props: {
  error: {
    /** @type {PropType<NuxtError>} */
    type: Object,
    required: true,
  },
}
```

`String` is a special case, we must use type cast on the String object:

```js
props: {
  type: {
    type: /** @type {PropType<MessageType>} */ (String),
    required: true,
  },
}
```

In a repo that uses the inline `import('…')` style, write `import('vue').PropType<...>` in the same place:

```js
props: {
  data: {
    /** @type {import('vue').PropType<NuxtError>} */
    type: Object,
    required: true,
  },

  items: {
    /** @type {import('vue').PropType<Array<string>>} */
    type: Array,
    default: () => [],
  },

  onUpdate: {
    /** @type {import('vue').PropType<(value: string) => void>} */
    type: Function,
    required: true,
  },
}
```

See [[hof-nuxt]].

## Ambient global helpers (no import needed)

`RequiredExcept`, `OptionalExcept`, `NullableExcept` are declared in `types/global.d.ts` under `declare global`, so they're used **unqualified** in JSDoc. Same for `schema.graphql.*` ([[hof-graphql]]), `furo.*`, and `GraphqlType.*` ([[hof-nuxt]]).

This holds in both type-only-import styles: never `@import` them, and never wrap them in `import('…')`. Importing them is redundant.
