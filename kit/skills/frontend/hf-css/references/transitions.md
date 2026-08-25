# Transitions and `will-change`

When a `transform` transition causes a visible 1px sub-pixel jump, add `will-change` for the transformed property to promote the element to its own compositor layer.

### Good

```css
.unit-card > .image {
  transition: transform 0.2s var(--transition-timing-ease-out);
  will-change: transform;
}

.unit-card > .image:hover {
  transform: scale(1.05);
}
```

Only add `will-change` when there is an actual 1px shift — overusing it wastes memory by promoting unnecessary layers.
