# Generation (`generate-graphql-types.js`)

Prefer regenerating `types/graphql-schema.d.ts` from the backend GraphQL schema rather than editing it by hand. The generator ships next to this skill as `generate-graphql-types.js` and reads the backend `.graphql` schema files, so the developer must clone the backend repo locally first. The schema lives under `server/graphql/schemas/` in the backend repo.

Run it from the Frontend project root with Node (the project is ESM and has `graphql` installed):

```bash
node lib/skills/frontend/hof-graphql/references/generate-graphql-types.js \
  <backend-repo>/server/graphql/schemas \
  --out types/graphql-schema.d.ts
```

Notes:

- **`--out types/graphql-schema.d.ts`** is the standard Frontend output path.
- It emits the whole `declare global { namespace schema.graphql { … } }` file — scalars/enums first, then interfaces — dropping the root `Query`/`Mutation`/ `Subscription` types (those are expressed as operation clients, see [operation anatomy](operations-anatomy.md)).
- Scalars map through a built-in table (`BigNumber`/`DateTime` → `string`, `Upload` → `File`, `DateOnly` → `string // YYYY-MM-DD`); unknown custom scalars fall back to `unknown` and should be reviewed.
- Unlike the clients generator, this script has **no `--force` flag** — it always rewrites the single output file
  entirely. Because the file is fully generated, keep the per-operation `RequestVariables`/`ResponseContent` typedefs
  in their Payload/Capsule files (never in this `.d.ts`) so they survive regeneration.

When the backend schema changes, regenerate this file, then reference the new types from the operation's Payload/Capsule.
