# Error Handling Structure

This document describes the standard error-handling structure for Furo (Nuxt 3 + `@openreachtech/furo`) frontend apps. It explains the model, the message dictionary, how to resolve messages, and how to add and maintain error entries.

Typical file locations:

- `app/constants-error.js` (or `app/constants/errors.js`) — the constants
- `app/graphql/client/BaseAppGraphqlCapsule.js` — the resolver
- `i18n/locales/<lang>.json` — the per-language text the locale paths point at

---

## 1. The model: code → locale path → message

The backend returns a dotted **error code** (e.g. `203.M006.005`). The frontend turns that code into a user-facing message at a single resolution point.

The map yields an i18n **locale path** (a key such as `errors.invalidPhoneNumber`), and the i18n layer renders it into
the active language. Every code is its own entry; no arrays, no reverse map. The full dictionary shapes are in
[[dictionaries]].

---

## 2. The structure

```js
// app/constants-error.js
export const ERROR_CODE_HASH = /** @type {const} */ ({
  // <SemanticName><CodeSuffix>: '<code>'
  Unauthenticated102X000001: '102.X000.001',
  InvalidEmail203M001001: '203.M001.001',
  InvalidEmail203M013003: '203.M013.003',
  InvalidPhoneNumber203M006005: '203.M006.005',
  InvalidPhoneNumber203M007005: '203.M007.005',
  // ...
})

export const ERROR_LOCALE_HASH = /** @type {const} */ ({
  // keyed by the CODE value → a locale PATH (i18n key), never a message string
  [ERROR_CODE_HASH.Unauthenticated102X000001]: 'errors.unauthenticated',
  [ERROR_CODE_HASH.InvalidEmail203M001001]: 'errors.invalidEmail',
  [ERROR_CODE_HASH.InvalidEmail203M013003]: 'errors.invalidReferralEmail',
  [ERROR_CODE_HASH.InvalidPhoneNumber203M006005]: 'errors.invalidPhoneNumber',
  [ERROR_CODE_HASH.InvalidPhoneNumber203M007005]: 'errors.invalidRecipientPhoneNumber',
  // ...
})
```

The per-language text lives in the locale files, keyed by the same path:

```jsonc
// i18n/locales/ja.json
{ "errors": { "invalidEmail": "メールアドレスが無効です" } }

// i18n/locales/en.json
{ "errors": { "invalidEmail": "The email address is invalid." } }
```

Two codes that share a semantic name can still carry *different* text — point them at different paths. If several codes should read identically, point them at the same path (do not collapse them into one `ERROR_CODE_HASH` entry).

The main hazard: a duplicate code value silently overwrites a path, because `ERROR_LOCALE_HASH` is keyed by the code value. Guard it with the maintenance tests in §4.

---

## 3. Resolving and adding entries

Resolution is covered in [[resolving-and-surfacing]] — `extractResolvedErrorLocalePath()`, plus `isUnauthenticated()` and the `errorMessageHashReactive` surfacing pattern.

**Adding a new error:**

1. Add the code to `ERROR_CODE_HASH` with a `<SemanticName><CodeSuffix>` identifier (suffix = code with dots removed, `203.M041.001` → `203M041001`).
2. Add its locale path to `ERROR_LOCALE_HASH`, keyed by the code via `ERROR_CODE_HASH`.
3. Add the text for that path to **every** locale file. If several codes should read identically, point them at the same path — do not collapse them into one `ERROR_CODE_HASH` entry.

Conventions:

- Identifier = PascalCase semantic name + code with dots removed; locale paths are camelCase, dot-namespaced under `errors.`.
- Keep entries grouped by code range with consistent section comments (Standard Client, Standard Server, Invalid Input, Not Found, Business Logic, Server Errors).

---

## 4. Maintenance tests

The hazard is that two identifiers map to the same code value; because `ERROR_LOCALE_HASH` is keyed by the code value, only the last path survives silently. Guard duplicate codes, path coverage, and translation coverage:

```js
test('ERROR_CODE_HASH has no duplicate code values', () => {
  const codes = Object.values(ERROR_CODE_HASH)
  const duplicates = codes.filter((code, index) => codes.indexOf(code) !== index)

  expect(duplicates).toEqual([])
})

test('every code has a registered locale path', () => {
  const missing = Object.values(ERROR_CODE_HASH)
    .filter(code => !(code in ERROR_LOCALE_HASH))

  expect(missing).toEqual([])
})

test('every locale path is translated in every locale file', () => {
  const paths = Object.values(ERROR_LOCALE_HASH)

  for (const [lang, messages] of Object.entries(LOCALES)) {
    const missing = paths.filter(path => !hasPath(messages, path))

    expect(missing, `missing in ${lang}`).toEqual([])
  }
})
```
