# Units on zero values

How to handle the unit when a property value is 0. The rule is "omit it", except for types where a unit is syntactically required.

## Write a `<length>` zero without a unit

When a `<length>` value is 0, write `0` with no unit. Do not add a unit like `0px` / `0rem` / `0em`.

```css
/* NG: a unit on zero */
.box {
  margin-block: 0rem;
  inset-block-start: 0px;
  border-width: 0px;
}
```

```css
/* OK: zero is unitless */
.box {
  margin-block: 0;
  inset-block-start: 0;
  border-width: 0;
}
```

- Reason: a length of zero does not depend on the unit. `0rem` and `0px` are equally "a length of zero", and the added
  unit contributes no information. A meaningless unit lowers readability, and it can even drag the "rem or px"
  base-unit debate (→ [rem-base.md](./rem-base.md)) into a place that is merely zero. Writing just `0` conveys at a
  glance that the value is "a unit-independent zero".

## Keep the unit on a `<time>` / `<angle>` zero

For types where a unit is **syntactically required**, such as `<time>` or `<angle>`, keep the unit even when the value is 0. Write `0s` / `0ms` / `0deg`.

```css
/* NG: a time zero with no unit (an invalid value) */
.panel {
  transition-delay: 0;
  animation-duration: 0;
}
```

```css
/* OK: a time keeps its unit even at zero */
.panel {
  transition-delay: 0s;
  animation-duration: 0s;
}
```

- Reason: this is not a matter of taste but a CSS syntax rule. A unitless zero `0` is treated as a valid value only for `<length>` (and the length side of length-percentage). A `<time>` `0` on its own is **invalid** and is not interpreted as a value unless written as `0s`; an `<angle>` likewise needs `0deg`. Extending "zero is unitless" mechanically to every type produces broken CSS such as `transition-delay: 0`.
- The delays and durations of transition / animation fall exactly here. When you want to set a value derived from `--motion-*` to 0, write `0s`.
