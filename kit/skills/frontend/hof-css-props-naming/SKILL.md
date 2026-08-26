---
name: hof-css-props-naming
description: "The company's CSS custom property naming convention. Defines the top-prefix rule for denoting a value's kind, and the two-layer palette / color rule. Refer to it when defining or referencing custom properties."
---

# Frontend: CSS Custom Properties Naming

A custom property denotes what kind of value it holds through its **top prefix**.

## The top prefix denotes the kind

The first word right after `--` is the **top prefix**. From the prefix you can tell which kind of value the variable holds.

| Top prefix | Kind | Example |
| --- | --- | --- |
| `--palette-*` | Raw color values. Colors with no meaning | `--palette-sky-500` |
| `--color-*` | Semantic colors. Named by their use | `--color-primary`, `--color-text` |
| `--size-*` | Dimensions. Length / width / height | `--size-header-height` |
| `--value-*` | Unitless scalars. Ratios and base values | `--value-golden-ratio` |
| `--motion-*` | The time axis of transition / animation. duration, easing, delay | `--motion-duration-base`, `--motion-easing-standard` |

Top prefixes are **added as needed**. The four above are not a fixed set. When a new kind is needed, do not force it
into an existing prefix — stand up a new prefix. The set of prefixes stays open; the convention itself is the
framework of "stand up a prefix per kind".

## Put the more distinctive word last

In custom property naming, the top prefix (the broadest kind) comes first, and the more distinctive — the more specific, more qualifying — a word is, the later it comes. You read left to right, from "broad kind → individual qualifier".

```
--color-background-header
   └kind  └role       └which (distinctive)
```

This is the reverse of JavaScript class naming. A class puts its distinctive word in the **prefix (front)** and keeps the shared, categorical suffix at the back (`AlphaSample` / `BetaSample` — the distinctive `Alpha` / `Beta` in front, the kind `Sample` behind). A custom property is the opposite: the fixed kind comes first (the top prefix), and the distinctive word comes last.

This reversal is not a matter of taste; it is forced by **what groups the name**. The prefix always goes to whatever does the grouping.

- **JavaScript classes** are grouped by modules, imports, and the type system. Because the grouping mechanism lives outside the name, the name itself need not carry the taxonomy and is free to follow English noun-phrase grammar (head-final: the head word comes last). `AlphaSample` reads as "an Alpha Sample" — the kind `Sample` stands last as the head, the distinctive `Alpha` in front as the modifier.
- **Custom properties** have no namespace, no module, no scope; they are all laid flat in the single global dictionary of `:root`. With no mechanism outside the name to give structure, the name itself must carry the index (the same idea as reverse-DNS `com.company.app`, file paths, or BEM). Putting the broadest kind first lets lexical sorting and prefix autocomplete (typing `--color-`) cluster siblings in one place.

So putting the distinctive word first (`--header-background-color`) scatters siblings across both sorting and autocomplete, and in CSS — flat and module-less — the namespace stops working as an index. Fixing the kind at the front is what keeps that index intact.

## palette and color — colors flow one way through two layers

Colors alone are handled in two layers, `--palette-*` and `--color-*`. No other kind has this two-layer structure.

- **palette layer** (`--palette-*`): raw color values. No meaning. The **internal** layer.
- **color layer** (`--color-*`): colors given meaning by use. The **only public interface** the application touches.

Colors always flow one way: palette → color → application.

```
--palette-*  →  --color-*  →  application CSS
(raw, internal)  (meaning, public)  (references color only)
```

To keep this one-way flow, two rules are imposed.

### (1) The application may call only `--color-*`

The only color variables the application CSS may call are `--color-*`. It must not call `--palette-*` directly.

```css
.button {
  background: var(--color-primary);      /* ✅ call the color layer */
}
```

```css
.button {
  background: var(--palette-blue-500);   /* ❌ do not call palette directly */
}
```

Calling palette directly scatters raw color values through the application and skips the layer of meaning. palette is referenced only by the color layer.

### (2) A `--color-*` value is either `var(--palette-*)` or a literal

When defining a `--color-*`, only two kinds of value may be passed.

```css
:root {
  --color-primary: var(--palette-sky-500);   /* ✅ reference a palette */
  --color-border:  #ccc;                      /* ✅ a directly defined color */
}
```

A literal color (`#ccc` and the like) may be written only here, at the color definition. Because the application can call only `--color-*`, raw color values are sealed in here and never leak into the application CSS.

## Refer to the template for palette definitions

For the concrete definition of `--palette-*`, use [./templates/property-palette.css](./templates/property-palette.css) as the example. Each hue is aligned in 11 steps from 050 to 950.

## Related topics

- the z-index convention: one example of `--value-*`. The layer base values for z-index and the `calc()` notation.
