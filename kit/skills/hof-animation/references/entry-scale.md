# Never Animate From `scale(0)`

Nothing in the real world shrinks to nothing and pops back into existence. An element animating from `scale(0)` looks like it comes from nowhere. Start from `scale(0.95)` (or higher) combined with `opacity` so the entrance has a visible shape the whole time — like a balloon that still holds its form even when deflated.

### Bad

```css
.unit-card > .badge {
  transform: scale(0);
}
```

### Good

```css
.unit-card > .badge {
  transform: scale(0.95);
  opacity: 0;
  transition:
    transform 0.18s var(--transition-timing-ease-out),
    opacity 0.18s var(--transition-timing-ease-out);
}

.unit-card > .badge.is-shown {
  transform: scale(1);
  opacity: 1;
}
```

Animate only `transform` and `opacity` here — both run on the compositor and skip layout/paint. If the `transform` scale causes a 1px sub-pixel jump, promote the element with `will-change: transform` (see [[hof-css]] transitions).
