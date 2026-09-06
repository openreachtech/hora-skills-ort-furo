# Router meta & third-party ambient consts

## Router meta augmentation (`router.d.ts`)

```ts
export {}

declare module 'vue-router' {
  interface RouteMeta {
    headerTitle?: string
  }
}
```

This types the custom `headerTitle` set via `definePageMeta` ([pages](./pages-route-structure.md)).

## Third-party ambient consts (`robot-payment.d.ts`)

Plain ambient declarations for injected external scripts:

```ts
declare const CPToken: any
declare const ThreeDSAdapter: any
```
