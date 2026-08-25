---
name: hf-restful
description: "RESTful API clients in app/restfulapi/renchan/ — the Launcher/Payload/Capsule trio mirroring the GraphQL pattern, BaseAppRenchanRestfulApi* base classes, BASE_URL config, /v1 prefixPathname, access-token headers, and how a concrete REST client would be added. Use when adding or editing a REST client. Note: often scaffolded and may be unused in a given app."
metadata:
  author: OpenReachTech
  version: "2026.07.24"
---

# RESTful API Clients (`app/restfulapi/`)

Use this skill when adding a RESTful API client. The REST layer mirrors the GraphQL Launcher/Payload/Capsule pattern ([[hf-graphql]]), adapted for REST via `@openreachtech/furo`. **It is often scaffolded but may be unused** — in a given app only the base classes may exist, with no concrete REST operations or consumers yet.

> Prefer GraphQL for new work unless a REST endpoint is required.

## Core

| Topic | Description | Reference |
| --- | --- | --- |
| Scaffold & base classes | `app/restfulapi/renchan/` layout and the `BaseAppRenchanRestfulApi*` Launcher/Payload/Capsule/config, with `/v1` prefix, access-token headers, and runtime `BASE_URL` | [base-classes](references/base-classes.md) |
| Adding a client | Creating a concrete `<Feature>RestfulApi{Launcher,Payload,Capsule}` under `renchan/<name>/`, the request flow, and consuming it from a Fetcher/SubmitterContext | [adding-a-client](references/adding-a-client.md) |
