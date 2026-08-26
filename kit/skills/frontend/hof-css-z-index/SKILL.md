---
name: hof-css-z-index
description: "Convention for the company's CSS z-index: the three layer base values and the calc() notation."
---

# Frontend: CSS z-index

z-index is managed in three layers. The base values are defined as variables in `:root`.

```css
:root {
  /*
   * z-index layers
   * (max-value: 2147483647)
   */
  --value-z-index-layer-content: 0000000;
  --value-z-index-layer-staying:  1000000;
  --value-z-index-layer-overlay:  2000000;
}
```

| Layer | Variable | Base value | For |
| --- | --- | --- | --- |
| ground | `--value-z-index-layer-content` | `0000000` | Ordinary content |
| cloud | `--value-z-index-layer-staying` | `1000000` | Elements that stay, e.g. Header / Footer / Nav / Sidebar |
| space | `--value-z-index-layer-overlay` | `2000000` | Overlays such as Modals |

## Always use `calc()` (even when the right operand is 0)

Always write z-index in the form `calc(layer-variable + number)`. Do not omit the right operand even when it is 0.

```css
.modal {
  z-index: calc(var(--value-z-index-layer-overlay) + 0); /* ✅ */
}
```

```css
z-index: calc(var(--value-z-index-layer-staying) + 0); /* ✅ */
z-index: var(--value-z-index-layer-staying);           /* ❌ */
```

Here we liken this notation to "chapter and verse". The **chapter** is which layer an element belongs to (the layer variable), and the **verse** is its ordering within that chapter (the right operand).

- Chapter:
  ```
  var(--value-z-index-layer-content)
  var(--value-z-index-layer-staying)
  var(--value-z-index-layer-overlay)
  ```
- Verse:
  ```
  + 0
  + 1
  + 2
  ```

Always keeping the same notation shows later workers how to use `--value-z-index-layer-*` — that is, the convention
itself. The existing styles become the example, so whoever writes z-index next can follow the same shape without
hesitation. As a secondary benefit, it also keeps diffs small when making changes.

## Within the same layer, stack in steps of 1000

When you want elements within the same layer to stack over one another, increase the right operand (the verse) of `calc()` in steps of thousands. When writing the verse, always keep the thousands place in mind: leave room by writing `+ 0`, `+ 1000`, `+ 2000`. Even when you write `+ 0`, read that 0 not as the ones place but as "a thousands place still left open".

```css
.header {
  z-index: calc(var(--value-z-index-layer-staying) + 0);
}

.sidebar {
  z-index: calc(var(--value-z-index-layer-staying) + 1000);
}

.more-bar {
  z-index: calc(var(--value-z-index-layer-staying) + 2000);
}
```

Reason: when you later need to insert an element between two levels, it is easier to insert between `1000` and `2000` than between `1` and `2`.
