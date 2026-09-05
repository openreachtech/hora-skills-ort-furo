---
name: hof-animation
description: UI animation conventions for a Furo/Nuxt app — deciding whether and why an element animates, picking easing from the --transition-timing-* tokens, and the entry/popover/tooltip/blur techniques that keep motion feeling responsive. Use when adding transitions, animating component entry/exit, or polishing popovers, tooltips, and state changes.
metadata:
  author: OpenReachTech
  version: "2026.07.24"
---

# UI Animation

Motion in this app exists to serve the interface, never to decorate it. Before adding a transition, decide whether the
element should animate at all and why; then pick the technique that fits. Every animation is built from design tokens
and `.unit-*` scoped styles — the same rules as [[hof-css]] apply, and animate only `transform`/`opacity` so the
compositor does the work.

> Priorities: responsiveness, clear purpose, GPU-friendly properties, motion that goes unnoticed because it feels right.

## Deciding

| Topic | Description | Reference |
| --- | --- | --- |
| Purpose | Every animation must answer "why does this animate?" — the valid purposes, and when to skip motion entirely | [purpose](references/purpose.md) |
| Easing | Choosing between the `--transition-timing-ease-in|out|in-out` tokens by whether the element enters, exits, moves, or changes color | [easing](references/easing.md) |

## Techniques

| Topic | Description | Reference |
| --- | --- | --- |
| Entry scale | Never animate from `scale(0)` — start from `scale(0.95)` with `opacity` so entrances don't appear from nothing | [entry-scale](references/entry-scale.md) |
| Popover origin | Make popovers scale from their trigger with `transform-origin`, not from center (modals stay centered) | [popover-origin](references/popover-origin.md) |
| Tooltip instancing | Delay the first tooltip, then open adjacent tooltips instantly with no animation | [tooltip-instancing](references/tooltip-instancing.md) |
| Blur masking | Add a subtle `filter: blur()` to mask an imperfect crossfade between two states | [blur-masking](references/blur-masking.md) |
