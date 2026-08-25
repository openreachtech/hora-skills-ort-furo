---
name: hf-furo-context-patterns
description: How to use Furo Context classes in a Furo app — BaseAppContext generics, the create()/setupComponent() lifecycle, single-object constructor + factory params, dependency injection from setup, watchers, template getters/methods, and the *PageContext/*SubmitterContext/*LayoutContext/*Context taxonomy. Use when writing or reviewing any Context class.
metadata:
  author: OpenReachTech
  version: "2026.07.24"
---

# Furo Context Patterns

Furo apps keep Vue components thin and move all logic into **Context classes**. Use this skill when writing or reviewing any `*Context.js`.

> It is the architectural foundation shared by [[hf-nuxt]], [[hf-nuxt]], [[hf-nuxt]], [[fetcher-operation]], and [[mutation-operation]].

## Core

| Topic | Description | Reference |
| --- | --- | --- |
| Base class | `BaseAppContext` extends `BaseFuroContext`, `<A, P, EE>` generics, inherited helpers | [base-class](references/base-class.md) |
| Lifecycle contract | Identical single-object constructor + `create()` + `setupComponent()`, watchers, chaining | [lifecycle](references/lifecycle.md) |
| Dependency injection | Deps created in `setup` and injected into `create()`, optional defaults, template access through the context | [dependency-injection](references/dependency-injection.md) |

## Conventions

| Topic | Description | Reference |
| --- | --- | --- |
| Taxonomy, naming & typedefs | `*PageContext`/`*SubmitterContext`/`*LayoutContext`/`*Context` placement, method naming, JSDoc typedefs | [conventions](references/conventions.md) |
