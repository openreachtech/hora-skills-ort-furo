# The dictionaries — `app/constants-error.js`

Backend error codes are dotted strings like `'203.M003.001'`. The frontend maps each code to an i18n **locale path** (a key), and the i18n layer renders it into the active language.

A code is looked up and resolved to a locale path at a single point in `BaseAppGraphqlCapsule` (see [resolving-and-surfacing](resolving-and-surfacing.md)). The dictionaries live in `app/constants-error.js` — look for `ERROR_CODE_HASH` and `ERROR_LOCALE_HASH`.

---

## Locale paths (i18n)

Every code is its own entry — **no array grouping** and **no reverse map**. The map value is a locale **path**, never
a message string.

**`ERROR_CODE_HASH`** — unique identifier (`<SemanticName><CodeSuffix>`) → a single code. The suffix is the code with dots removed, so a code seen in logs maps to exactly one entry:

```js
export const ERROR_CODE_HASH = /** @type {const} */ ({
  Unauthenticated102X000001: '102.X000.001',
  InvalidEmail203M001001: '203.M001.001',
  InvalidEmail203M013003: '203.M013.003',
  InvalidNewPassword203M003002: '203.M003.002',
  // ...
})
```

**`ERROR_LOCALE_HASH`** — the **code value** → a **locale path** (an i18n key), never a hardcoded message string. Keying by the code lets each code carry its own path:

```js
export const ERROR_LOCALE_HASH = /** @type {const} */ ({
  [ERROR_CODE_HASH.Unauthenticated102X000001]: 'errors.unauthenticated',
  [ERROR_CODE_HASH.InvalidEmail203M001001]: 'errors.invalidEmail',
  [ERROR_CODE_HASH.InvalidEmail203M013003]: 'errors.invalidReferralEmail',
  [ERROR_CODE_HASH.InvalidNewPassword203M003002]: 'errors.invalidNewPassword',
  // ...
})
```

The i18n layer resolves the path to text, so the message follows the active language. The text lives in the locale
files, keyed by the same path:

```jsonc
// i18n/locales/ja.json
{ "errors": { "invalidEmail": "メールアドレスが無効です" } }

// i18n/locales/en.json
{ "errors": { "invalidEmail": "The email address is invalid." } }
```

---

## Conventions

- Error dictionaries live in `app/constants-error.js` (separate from `app/constants.js`).
- Identifiers are PascalCase `<SemanticName><CodeSuffix>`; locale paths are camelCase, dot-namespaced under `errors.`. No arrays, no reverse map.
- Per-operation reactive error state is named `errorMessageHashReactive`, keyed by camelCase operation names that match the mutation names. It holds the **rendered** message — the locale path passed through `t()`, not the path itself.
- Adding a new error: see [error-handling-structure](error-handling-structure.md) §3 for the steps.
