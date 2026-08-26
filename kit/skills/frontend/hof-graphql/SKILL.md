---
name: hof-graphql
description: GraphQL in a Furo app — schema types (types/graphql-schema.d.ts) and operation clients (app/graphql/client). Use when adding/updating/referencing generated GraphQL types, or adding/editing a query or mutation under app/graphql/client.
metadata:
  author: OpenReachTech
  version: "2026.07.24"
---

# GraphQL

Everything GraphQL in this Furo app splits into two halves: the **schema types** (`types/graphql-schema.d.ts`) that
describe entity/input/result shapes, and the **operations** (`app/graphql/client/`) that run queries and mutations.
Use this skill when adding/updating generated GraphQL types, referencing an entity/input/result type in a
Payload/Capsule, store ([[hof-nuxt]]), or component prop ([[hof-nuxt]]), or when adding or editing a GraphQL query or
mutation. Each operation is a **Launcher / Payload / Capsule trio** built on Furo base classes, consumed via
`useAppGraphqlClient` ([[hof-nuxt]]) and driven from a Fetcher ([[fetcher-operation]]) or SubmitterContext
([[mutation-operation]]).

> Schema types are real TypeScript declarations under `namespace schema.graphql`, not JSDoc typedefs — see [[hof-nuxt]] for the other ambient `.d.ts` files.

## Schema types

| Topic | Description | Reference |
| --- | --- | --- |
| Schema file & referencing | The ambient `types/graphql-schema.d.ts` (`export {}` + `declare global namespace schema.graphql`) and how app code references types via `schema.graphql.*` without imports | [types-schema-file](references/types-schema-file.md) |
| Naming | Entity/`*Input`/`*Result` naming and scalar aliases mirroring the backend Renchan SDL | [types-naming](references/types-naming.md) |
| Generating types | Regenerating the `.d.ts` from the backend schema, output path, scalar mapping, and no-`--force` behavior | [types-generation](references/types-generation.md) |
| Types generator script | The Node script that reads backend `.graphql` files and emits the ambient `.d.ts` | [generate-graphql-types.js](references/generate-graphql-types.js) |

## Operations

| Topic | Description | Reference |
| --- | --- | --- |
| Trio anatomy | Folder & file layout, Payload (`document` + `RequestVariables`), Capsule (value-hash getters + `ResponseContent`), Launcher, naming & placement | [operations-anatomy](references/operations-anatomy.md) |
| Base classes | What `BaseAppGraphql*` give you for free — error/auth helpers, access-token header injection, runtime `graphqlConfig` | [operations-base-classes](references/operations-base-classes.md) |
| Consuming | Creating the client in `setup`, `graphqlClientHash`, `invokeRequest*` variants, `capsuleRef`, launcher hooks | [operations-consuming](references/operations-consuming.md) |
| Generating the trio | Running the generator against the backend schema, `--out`/`--target`/`--depth` flags, the no-`--force` rule | [operations-generation](references/operations-generation.md) |
| Trio generator script | The generator itself — reads backend `.graphql` schemas and emits query/mutation trios | [generate-graphql-clients.js](references/generate-graphql-clients.js) |
