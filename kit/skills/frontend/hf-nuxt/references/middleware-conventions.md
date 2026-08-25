# Conventions

- File: `middleware/NNN.<name>.global.js`; prefix encodes order.
- Constants (paths, route lists) at module top.
- Always return `navigateTo(...)` or `goNextAsIs()`.
- Auth via `AccessTokenClerk` / `StorageClerk` ([[hf-modules]]) + `useCustomerStore()` ([stores](./state-store-pattern.md)); never read tokens ad hoc.
