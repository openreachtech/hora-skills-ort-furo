# Conventions & placement

## Example composables (repo-root `composables/`)

```
composables/useAppFormClerk.js     # wraps furo useFormClerk
composables/useAppGraphqlClient.js # wraps furo useGraphqlClient
composables/useRedirect.js
composables/useDebounce.js
composables/useKeyedDebounce.js
```

Note: composables live in the repo-root `composables/` (a Nuxt auto-import dir), not `app/composables/`.

## Conventions

- All named `use*`. Two export styles coexist: `export default function useX ()` (`useAppFormClerk`, `useAppGraphqlClient`, `useRedirect`) and `export const useX = ({ ... }) => ...` (`useDebounce`, `useKeyedDebounce`).
- **`useApp*` = thin app-specific wrappers over `@openreachtech/furo-nuxt` base composables.** Spread the base result and add/override behavior.
- Take a **single destructured params object** (or a launcher object).
- Return an **object of functions/refs** (clients, form-clerk helpers), except debounce composables which return a single debounced function.

## Naming & placement

- Located in repo-root `composables/`. `use` prefix mandatory.
- `useApp*` reserved for wrappers around furo-nuxt base composables.
