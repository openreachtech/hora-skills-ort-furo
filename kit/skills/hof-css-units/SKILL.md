---
name: hof-css-units
description: "Entry point for CSS unit conventions. Collects rules such as the base unit and value granularity, organized by topic. Consult when writing CSS or converting existing styles."
---

# Frontend: CSS Units

Conventions for units in CSS, organized by topic.

## Topics

- [rem-base.md](./rem-base.md): Make rem the base unit and limit values to a set of steps humans can grasp intuitively. Includes how to handle `1px` and how to convert existing styles.
- [zero.md](./zero.md): How to handle the unit on a value of 0. `<length>` is unitless; types that require a unit, such as `<time>` / `<angle>`, keep the unit even at zero.
