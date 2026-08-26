# Naming (mirrors the backend Renchan GraphQL SDL)

- Entities: name as-is (`Announcement`, `GenderCategory`).
- Inputs: `<Name>Input` (`SignInInput`, `PaginationInput`).
- Operation payloads: `<Name>Result` (`AuthResult`, `CustomerProfileResult`).
- Scalars: aliased to primitives (`BigNumber = string`, `DateTime = string`, `Upload = File`).
- Fields: copy the SDL name verbatim — never re-spell it on the frontend. Datetime fields end with
  `At`, date-only fields with `On`, and a range keeps the suffix and adds `From` / `To`
  (`modifiedAtFrom` / `modifiedAtTo`). A business time is its own field (`modifiedAt`,
  `registeredAt`); `updatedAt` / `createdAt` are the ORM's audit columns and are not exposed.
- Classification fields are `xxxCategory`, not `xxxType` (`granteeCategory` / `GenderCategory`) —
  `type` collides with the JSDoc type annotation. The exception is a word borrowed verbatim from an
  external standard (`mimeType`).
