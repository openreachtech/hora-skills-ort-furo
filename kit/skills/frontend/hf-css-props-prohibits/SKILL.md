---
name: hf-css-props-prohibits
description: "Conventions for what is prohibited when defining custom properties. Limits relative sizes to the five steps huge / large / medium / small / tiny, and prohibits excessively granular relative sizes and x- style labels."
---

# Frontend: Custom Properties Prohibits

What is prohibited when defining custom properties.

## Prohibit excessively granular relative sizes

- A relative-size custom property is limited to the **five steps `huge` / `large` / `medium` / `small` / `tiny`**. Do not create steps finer than these.
- Do **not use `x-` style labels** such as `x-large` / `xx-large` / `xs` / `xl`. They are a means of adding steps beyond the five.
- Reason: a difference in relative size finer than the five steps (huge / large / medium / small / tiny) cannot be told apart by the human eye. Tokenizing a difference that cannot be distinguished only introduces meaningless granularity — the same reasoning as the rem-based unit convention, which limits value granularity to "what humans can grasp".
- When a dimension the five steps cannot cover is needed, do not add more relative sizes — **name it for the element's role** (→ the custom property naming rule, "Put the more distinctive word last"). Instead of adding a sixth step, switch to a role name such as `--size-header-height`. At that point it is no longer a perceptual size scale but a dimension specific to the element.

```css
/* NG: finer than the five steps / x- style labels */
:root {
  --size-space-xs: 0.25rem;
  --size-space-x-large: 3rem;
  --size-space-xx-large: 4rem;
}
```

```css
/* OK: relative sizes go up to five steps */
:root {
  --size-space-tiny: 0.25rem;
  --size-space-small: 0.5rem;
  --size-space-medium: 1rem;
  --size-space-large: 2rem;
  --size-space-huge: 4rem;
}
```

```css
/* OK: a dimension the five steps cannot cover is named for its role, not as a relative size */
:root {
  --size-header-height: 4.5rem;
  --size-nav-width: 15rem;
}
```

## Prohibit abbreviations in property names

- Abbreviations in the custom property names **we define** follow the **whitelist** of the JavaScript naming rule ("criteria for using abbreviations"). Only abbreviations on that whitelist (`id` / `min` / `max` / `config` / `env`, and so on) are allowed; every other abbreviation is prohibited. The whitelist is shared between JS and CSS and not maintained twice.
- Accordingly, whitelist-external abbreviations such as `bg` (→ `background`), `hdr` (→ `header`), `btn` (→ `button`), `img` (→ `image`), or the relative-size `xs` / `xl` (→ `tiny` / `huge`) are **never used in our own definitions**. Spell every word out in full.
- The one exception is when Vue or a third-party module uses an ugly abbreviation **in its interface**. Since we cannot connect without matching it, we reluctantly follow their abbreviation at the boundary where we touch their interface (e.g. a `--reka-*` custom property we consume). The exception is limited to that boundary; the fact that they use it is not a reason to use abbreviations in our own definitions (→ the JavaScript naming rule, "do not imitate external modules' abbreviations").
- Reason: a whitelist-external abbreviation is completed differently by each reader, so its meaning does not carry. `xs` / `xl` may be meant as "extra small / large", but the letters convey nothing — they are meaningless. A custom property's **name is its only index** (→ the custom property naming rule); a name that carries no meaning cannot serve as an index.

```css
/* NG: abbreviations */
:root {
  --color-bg: #fff;
  --size-hdr-height: 4.5rem;
}
```

```css
/* OK: spell every word out in full */
:root {
  --color-background: #fff;
  --size-header-height: 4.5rem;
}
```
