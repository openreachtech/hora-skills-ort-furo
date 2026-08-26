---
name: hof-modules
description: Utility modules written as classes. Furo follows an OOP structure, so utility classes are preferred over utility functions/composables. Use when reusing general logic across multiple files.
metadata:
  author: OpenReachTech
  version: "2026.07.24"
---

# Utility Modules (`app/modules/`)

Reusable general logic lives flat in `app/modules/` as ES6 classes — Furo follows an OOP structure, so utility classes are preferred over utility functions or composables. Rules: modules are always classes, one class per file, and each class must have at least one property.

## Core

| Topic | Description | Reference |
| --- | --- | --- |
| Class factory pattern | `export default class`, `constructor({ ... })` single-object param, static `create()` factory idiom, DI with factory defaults, `Params`/`FactoryParams` typedefs | [class-factory](references/class-factory.md) |
| Naming & consumption | Role suffixes (`*Clerk`, `*Detector`), flat `app/modules/` layout, instantiating via `X.create(...)` | [naming-and-consumption](references/naming-and-consumption.md) |
