---
name: hof-error-handling
description: Error handling in a Furo/Nuxt app — mapping backend dotted error codes to user-facing messages via app/constants-error.js using i18n locale paths (ERROR_CODE_HASH + ERROR_LOCALE_HASH), the capsule resolution point (extractResolvedErrorLocalePath), the errorMessageHashReactive pattern surfacing errors to templates, and the Nuxt error.vue page. Use when handling or displaying errors.
metadata:
  author: OpenReachTech
  version: "2026.07.24"
---

# Error Handling

Use this skill when translating backend errors to user-facing messages, surfacing operation errors in the UI, or working on the Nuxt error page.

The message dictionary maps each backend code to an i18n **locale path** (`ERROR_CODE_HASH` + `ERROR_LOCALE_HASH` in `app/constants-error.js`); the i18n layer renders the path into the active language.

> For the extended rationale (structure, resolution, and maintenance guidance), see [error-handling-structure](references/error-handling-structure.md).

## Core

| Topic | Description | Reference |
| --- | --- | --- |
| Dictionaries | The dictionaries in `app/constants-error.js`: `ERROR_CODE_HASH` (per-code identifiers) and `ERROR_LOCALE_HASH` (code → locale path), plus conventions for adding errors | [dictionaries](references/dictionaries.md) |
| Resolving & surfacing | The capsule resolution point (`extractResolvedErrorLocalePath`) and the `errorMessageHashReactive` pattern that binds errors into templates | [resolving-and-surfacing](references/resolving-and-surfacing.md) |
| Error page | The Nuxt `error.vue` page delegating to `ErrorPageContext` | [error-page](references/error-page.md) |
| Structure & rationale | The dictionary structure, resolution, and adding/maintaining entries | [error-handling-structure](references/error-handling-structure.md) |
