# Use Blur to Mask Imperfect Transitions

When a crossfade between two states looks off no matter which easing or duration you try, add a subtle `filter: blur()` during the transition.

**Why it works:** without blur, a crossfade shows two distinct objects at once — the old state and the new state overlapping — which reads as unnatural. A brief blur blends them so the eye perceives one smooth transformation instead of two things swapping.

### Example — blurring content while a button swaps its label/state

```css
.unit-button > .content {
  transition:
    filter 0.2s var(--transition-timing-ease-out),
    opacity 0.2s var(--transition-timing-ease-out);
}

.unit-button > .content.is-transitioning {
  filter: blur(2px);
  opacity: 0.7;
}
```

Pair it with press feedback so the whole interaction feels cohesive:

```css
.unit-button {
  transition: transform 0.16s var(--transition-timing-ease-out);
}

.unit-button:active {
  transform: scale(0.97);
}
```

Keep the blur small — under `20px`, and typically just `1–2px`. Heavy blur is expensive to paint, especially in Safari.
