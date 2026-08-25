# Generating the trio (`generate-graphql-clients.js`)

Prefer generating the Launcher/Payload/Capsule trio from the backend GraphQL schema rather than hand-writing it. The generator ships next to this skill as `generate-graphql-clients.js` and reads the backend `.graphql` schema files, so the developer must clone the backend repo locally first. The schema lives under `server/graphql/schemas/` in the backend repo.

Run it from the Frontend project root with Node (the project is ESM and has `graphql` installed):

```bash
node lib/skills/frontend/hf-graphql/references/generate-graphql-clients.js \
  <backend-repo>/server/graphql/schemas \
  --out app/graphql/client
```

Notes:

- **`--out app/graphql/client`** is the standard Frontend output path. The generator writes `queries/<field>/` and `mutations/<field>/` trios under it.
- **Do not pass `--force`.** By default the generator **skips** any operation whose files already exist, so previously
  written (possibly hand-tuned) clients are preserved. Only add `-f`/`--force` when you deliberately want to
  regenerate and overwrite existing files.
- Narrow the output with `--target <name ...>` (e.g. `--target signIn signUp`) to generate only specific operations, or point the schema path at a single `.graphql` file / subfolder.
- `--depth <n>` controls how deep nested selection sets are expanded (default 10).

After generating, the emitted Payload/Capsule reference `schema.graphql.*` types — regenerate those via [the schema file](types-schema-file.md) if the backend schema changed.
