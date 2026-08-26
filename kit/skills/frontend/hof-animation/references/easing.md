# Choosing an Easing

Always transition through an easing token from `assets/css/variables.css` — never the bare CSS keywords (`ease`, `linear`, …) and never a hard-coded curve. The tokens are:

```css
--transition-timing-ease-in: cubic-bezier(0.4, 0, 1, 1);
--transition-timing-ease-out: cubic-bezier(0, 0, 0.2, 1);
--transition-timing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

## Pick by what the element is doing

| The element is… | Use |
| --- | --- |
| Entering or exiting (appearing/disappearing) | `--transition-timing-ease-out` |
| Moving or morphing on screen (already visible) | `--transition-timing-ease-in-out` |
| Changing color on hover/focus | `--transition-timing-ease-out` (short) |
| In constant motion (progress bar, marquee) | `linear` |

## Never use ease-in for entrances or exits

`ease-in` starts slow, which makes the interface feel sluggish at the exact moment the user is watching most closely. A dropdown eased with `ease-in` *feels* slower than the same duration eased with `ease-out`, because the initial movement is delayed. Reserve `--transition-timing-ease-in` for elements leaving toward an off-screen destination, if at all.

### Good

```css
.unit-dropdown > .panel {
  transition:
    transform 0.18s var(--transition-timing-ease-out),
    opacity 0.18s var(--transition-timing-ease-out);
}
```

### Bad

```css
.unit-dropdown > .panel {
  transition: all 0.3s ease-in; /* `all` + ease-in + bare keyword */
}
```

If the standard curves ever feel too weak for a specific interaction, add a stronger named token to `variables.css` rather than inlining a `cubic-bezier` in the component — see [[hof-css]] design tokens.
