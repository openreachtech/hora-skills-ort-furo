---
name: hof-css
description: CSS architecture and styling conventions for a Furo/Nuxt app — unit-selector naming, design tokens, and global stylesheet layering. Use when writing scoped component styles or touching assets/css.
metadata:
  author: OpenReachTech
  version: "2026.07.24"
---

# CSS Conventions

Furo apps style UI with a **unit-selector** strategy that keeps specificity low, DOM structure predictable, and refactoring cheap. Every component owns a `<style scoped>` block whose selectors descend from a single `.unit-*` root. Colors, sizes, and typography come from CSS custom properties (design tokens), never hard-coded values.

> Priorities: readability, predictability, low specificity, easy refactoring, consistent DOM structure.

## Core

| Topic | Description | Reference |
| --- | --- | --- |
| Unit selectors | Dividing UI into `.unit-*` roots, short descendant names, child combinator, chain depth, worked example | [unit-selectors](references/unit-selectors.md) |
| Design tokens | CSS custom properties for color/size/type/gradient/transition, the token families, no hard-coded values | [design-tokens](references/design-tokens.md) |

## Layering & Effects

| Topic | Description | Reference |
| --- | --- | --- |
| Global stylesheets | Fixed `nuxt.config.js` load order, numeric prefixes, where global vs scoped styles live | [global-stylesheets](references/global-stylesheets.md) |
| Transitions | When to add `will-change` for `transform` sub-pixel jitter | [transitions](references/transitions.md) |
