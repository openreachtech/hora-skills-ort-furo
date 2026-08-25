# Runtime config augmentation (`furo-nuxt.d.ts`)

This is how `useRuntimeConfig().public.<VAR>` is typed. Re-import the furo-nuxt types (which also brings the `furo.*` namespace), then augment `nuxt/schema`:

```ts
import '@openreachtech/furo-nuxt/types/furo-nuxt'

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    ENDPOINT_URL: string
  }

  interface PublicRuntimeConfig {
    ENDPOINT_URL: string
  }
}
```

**When you add a `.furo-env` variable ([[hf-furo-env]]), add its field to both `RuntimeConfig` and `PublicRuntimeConfig` here** so consumers are typed.
