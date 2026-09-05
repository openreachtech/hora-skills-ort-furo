# Env files and selection

| Filename | Purpose |
| --- | --- |
| `.furo-env.example` | Tracked reference file. Holds every env key with placeholder/safe defaults. **Source of truth for the key list** — new variables are added here first. `.furo-env.development` and `.furo-env` are initialized by copying this file. |
| `.furo-env.development` | Env variables for development. A developer-local copy of `.furo-env.example` with real values. |
| `.furo-env` | Env variables for production. A local copy of `.furo-env.example` with real values. |

- Env files live at the **repo root**: `.furo-env` (production, no suffix), `.furo-env.development`, `.furo-env.test`, plus `.furo-env.example`.
- **Initialize the local files by copying the example** — never author them from scratch:
  ```
  cp .furo-env.example .furo-env.development
  cp .furo-env.example .furo-env
  ```
  Then fill in real values in the copies.
- File selection is driven by `process.env.NODE_ENV` via `NuxtFuroEnvLoader` (from `@openreachtech/furo-nuxt`): `production` → `.furo-env`; otherwise → `.furo-env.<nodeEnv>`; missing `NODE_ENV` defaults to `development`.
- Parsed with `dotenv` — `KEY = value` syntax, `#` comments allowed. Variable names are **SCREAMING_SNAKE_CASE**.
- Git: `.furo-env.example` and `.furo-env.test` are **tracked**; `.furo-env.development` and `.furo-env` are **gitignored** (developer-local copies of `.example` with real values). `nuxt.config.js` watches `.furo-env.development` and restarts dev on change. **Never commit real secrets.**
