# Resolving and surfacing errors

## The single resolution point — `BaseAppGraphqlCapsule`

Resolution happens in one place on the capsule. `isUnauthenticated()` compares the code directly against the `Unauthenticated` entry. Always resolve via the capsule method — never hand-map codes in a context. See [[hf-graphql]].

The resolver's shape depends on how the app stores messages (see [[dictionaries]]): a **static-string** app resolves the code straight to final text; a **locale-path** app resolves it to an i18n key that the surfacing layer renders. An app uses one or the other.

### Static messages — `extractResolvedErrorMessage()`

When messages are hardcoded strings (`ERROR_MESSAGE_HASH`, single language), the code is resolved to **final text** in two hops: `code → semantic name` (`ERROR_CODE_MAP`) → `message` (`ERROR_MESSAGE_HASH`). A null code falls back to the `Unknown` message; a code with no mapped name, or a name with no message, falls back to the raw code. No i18n involved — the returned string is ready to display as-is.

```js
extractResolvedErrorMessage () {
  const errorCode = this.getErrorMessage() // furo base returns the error *code*

  if (errorCode === null) {
    return ERROR_MESSAGE_HASH.Unknown
  }

  const messageKey = ERROR_CODE_MAP.get(errorCode)
    ?? null
  if (messageKey === null) {
    return errorCode // unmapped code → surface it as-is
  }

  return ERROR_MESSAGE_HASH[messageKey]
    ?? errorCode
}

isUnauthenticated () {
  return this.getErrorMessage() === ERROR_CODE_HASH.Unauthenticated
}
```

### Locale-aware messages — `extractResolvedErrorLocalePath()`

When messages are i18n keys (`ERROR_LOCALE_HASH`), the code is turned into a **locale path** with a single, direct lookup: `code → locale path`, falling back to the raw code. It does **not** render text — the i18n layer does that at the surfacing point, so the language follows the active locale.

```js
extractResolvedErrorLocalePath () {
  const errorCode = this.getErrorMessage() // furo base returns the error *code*

  return ERROR_LOCALE_HASH[/** @type {keyof typeof ERROR_LOCALE_HASH} */ (errorCode)]
    ?? errorCode // unmapped → raw code; t() renders an unknown key as the key itself
}

isUnauthenticated () {
  return this.getErrorMessage() === ERROR_CODE_HASH.Unauthenticated102X000001
}
```

## Surfacing errors to templates — `errorMessageHashReactive`

The `.vue` `setup` creates a `reactive()` hash keyed by operation name, typed via a local typedef, and passes it into the relevant context(s). It holds the **rendered** message (final text), not a path:

```js
/** @type {Reactive<ErrorMessageHash>} */
const errorMessageHashReactive = reactive({
  updateEmail: null,
  verifyEmail: null,
})

// typedef at end of <script>:
/**
 * @typedef {{
 *   updateEmail: string | null
 *   verifyEmail: string | null
 * }} ErrorMessageHash
 */
```

This one reactive object is shared across the contexts that need it (submitters + section context). In a submitter's launcher `afterRequest` hook, resolve the error and set it on error; clear it before submitting. The only difference between versions is whether the resolved value is passed through i18n `t()`:

```js
// submitForm(): clear first
this.errorMessageHashReactive.updateEmail = null

// afterRequest hook — static messages: the resolved value is already final text:
afterRequest: async capsule => {
  if (capsule.hasError()) {
    this.errorMessageHashReactive.updateEmail = capsule.extractResolvedErrorMessage()

    return
  }

  this.successMessageHashReactive.updateEmail = 'メールアドレスを更新しました'
}

// afterRequest hook — locale paths: render the resolved path with t():
afterRequest: async capsule => {
  if (capsule.hasError()) {
    this.errorMessageHashReactive.updateEmail = this.t(capsule.extractResolvedErrorLocalePath())

    return
  }

  this.successMessageHashReactive.updateEmail = this.t('messages.emailUpdated')
}
```

The locale variant needs `const { t } = useI18n()` in `setup` (and `this.t` wired into the context); the static variant needs neither.

The template binds the hash the same way in both versions (`:error-message-hash="context.errorMessageHashReactive"`). Parallel `successMessageHashReactive` (success text) and `statusReactive` (loading flags like `isInvokingUpdateEmail`) follow the same shape — see [[mutation-operation]] and [[fetcher-operation]].
