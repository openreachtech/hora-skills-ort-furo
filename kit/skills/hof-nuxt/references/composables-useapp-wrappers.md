# `useApp*` wrapper pattern

```js
import {
  useFormClerk,
} from '@openreachtech/furo-nuxt'

export default function useAppFormClerk ({
  FormElementClerk,
  invokeRequestWithFormValueHash,
}) {
  const formClerk = useFormClerk({
    FormElementClerk,
    invokeRequestWithFormValueHash,
  })

  return {
    ...formClerk,
    resetFieldValidation,
    validateField,
    validateForm,
  }

  // inner named functions mutate formClerk.validationRef.value
}
```

`useAppGraphqlClient` wraps `useGraphqlClient(Launcher)`, spreads it, and adds `invokeRequestOnEvent`, `invokeRequestOnMounted` (wraps `onMounted`), and `invokeRequestWithFormValueHash`. It also injects a cross-cutting `afterRequest` hook that detects `capsule.isUnauthenticated()`, clears the access token via `StorageClerk.createAsLocal()`, and redirects to `/login?redirect=...`. See [[hof-graphql]]. The storage clear and the `/login` path are the boilerplate's defaults. Under cookie authentication, [[hof-cookie-authentication]] builds `useAppGraphqlClient` around its own session runner instead.
