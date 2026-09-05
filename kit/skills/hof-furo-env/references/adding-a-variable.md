# Adding a new variable

1. Add it (SCREAMING_SNAKE_CASE) to `.furo-env.example` — the tracked source of truth for the key list — with an empty or safe default. Then propagate it to the local copies that need it (`.furo-env.development`, production `.furo-env`, and `.furo-env.test`) with real values. Fresh checkouts get the key automatically since those files are initialized by copying `.furo-env.example` (`cp .furo-env.example .furo-env.development`). See [[files]].
2. **No `runtimeConfig` edit needed for public values** — the `...furoEnv` spread picks it up automatically.
   - **Exception — private/secret values:** a variable that must stay server-side (not shipped to the client bundle) must be **excluded from the `public` spread** in `nuxt.config.js`. See [[wiring]].
3. Add the field to the `RuntimeConfig`/`PublicRuntimeConfig` augmentation in `types/furo-nuxt.d.ts` so `useRuntimeConfig().public.<NAME>` is typed (see [[hof-nuxt]]).
4. Read it via `useRuntimeConfig().public.<NAME>` in a plugin or component `setup` — never hard-code the value.
