---
name: hf-furo-env
description: Configure Furo environment variables (.furo-env files). Use when adding/changing an environment variable or wiring an endpoint/key.
metadata:
  author: OpenReachTech
  version: "2026.07.24"
---

# Furo Environment Configuration (`.furo-env`)

Use this skill when adding or changing an environment variable, wiring an endpoint/API key, or debugging why a runtime value is missing.

> Env values flow: `.furo-env.<env>` file → `NuxtFuroEnvLoader` → `app/globals/furo-env.js` → `nuxt.config.js` `runtimeConfig` → `useRuntimeConfig().public.<VAR>`.

## Core

| Topic | Description | Reference |
| --- | --- | --- |
| Env files & selection | The `.furo-env` files, repo-root location, `.furo-env.example` as source of truth, initializing `.furo-env.development`/`.furo-env` by copying it, `NODE_ENV`-driven selection, dotenv parsing, git tracking rules | [files](references/files.md) |
| Known variables | Documented keys in `.furo-env.example` (endpoints, REST base, plugin keys) plus the test-only `TEST_MESSAGE` | [variables](references/variables.md) |
| Loader & runtime wiring | `NuxtFuroEnvLoader` in `app/globals/furo-env.js`, the `...furoEnv` spread into `runtimeConfig`, keeping a secret out of `public`, and reading via `.public` | [wiring](references/wiring.md) |
| Adding a variable | Step-by-step: add to env files, no `runtimeConfig` edit for public values (private/secret must be excluded from `public`), type it, read via `useRuntimeConfig().public` | [adding-a-variable](references/adding-a-variable.md) |
