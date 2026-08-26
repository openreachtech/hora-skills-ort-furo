# Schema file & referencing

## Where they live

Generated GraphQL entity/input/result types are **not** JSDoc typedefs — they are real TypeScript declarations in one ambient file, `types/graphql-schema.d.ts`, under a global namespace:

```ts
export {}

declare global {
  namespace schema.graphql {
    // scalars
    type BigNumber = string
    type DateTime = string
    type DateOnly = string // YYYY-MM-DD
    type Upload = File
    type SortDirection = 'ASC' | 'DESC'

    // shared shapes
    interface PaginationInput { limit: number; offset: number; sort?: SortInput }

    // inputs
    interface SignInInput { email: string; password: string }

    // results / entities
    interface AuthResult { accessToken: string; expiredAt: DateTime }
    interface GenderCategory { id: number; name: string; displayName: string }
    interface CustomerReceiptsInput {
      receiptSourceCategoryIds?: Array<number>
      receiptStatusIds?: Array<number>
      pagination: PaginationInput
    }
  }
}
```

The leading `export {}` makes the file a module so `declare global` applies. This is why every `.js` file can reference these as `schema.graphql.<TypeName>` **without any import** — they're global. See [[hof-nuxt]] for the other ambient `.d.ts` files.

## How app code references them

The generated schema types are referenced from the thin app-side JSDoc typedefs that glue operations together — those `*RequestVariables` / `*ResponseContent` typedefs stay **inline in their Payload/Capsule files**, never in the `.d.ts`:

```js
// Payload
/**
 * @typedef {{
 *   input: schema.graphql.SignInInput
 * }} SignInMutationRequestVariables
 */

// Capsule getter
/** @returns {schema.graphql.CustomerProfileResult | null} */
get customerProfileValueHash () { /* ... */ }

// Capsule content typedef
/**
 * @typedef {{
 *   customerProfile: schema.graphql.CustomerProfileResult
 * }} CustomerProfileQueryResponseContent
 */
```

Stores and props reference them the same way (`schema.graphql.CustomerProfileResult`, `PropType<schema.graphql.OrderSummary>`).
