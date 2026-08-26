# Component Specs — concrete defaults

Concrete numeric/state specs for the most common components, so generation doesn't guess.
These are **defaults**: the project's own tokens, component library, context file, or Figma
spec always override them. Read this when building any of the components below; keep the
values token-backed (the numbers here map onto the standard 4px scale).

## State model (applies to every interactive component)

Priority when multiple states apply (highest wins):

```
disabled > loading > active > focus-visible > hover > default
```

Derive states from the base token — hover ≈ a small darken/lighten or /90 opacity step,
active one step further — rather than introducing new arbitrary colors (§12.3 of the
guidelines).

Standard transitions (all honoring `prefers-reduced-motion`):

| Property change     | Duration | Easing      |
|---------------------|----------|-------------|
| color / background  | 150ms    | ease-in-out |
| opacity             | 150ms    | ease        |
| transform           | 200ms    | ease-out    |
| shadow              | 200ms    | ease-out    |

## Button

Variants: `primary` (solid accent — exactly one per view), `secondary` (tonal/outline),
`ghost` (text-only), `destructive` (danger token), `link`.

| Size    | Height | Padding X | Font   | Icon |
|---------|--------|-----------|--------|------|
| sm      | 32px   | 12px      | 14px   | 16px |
| default | 40px   | 16px      | 14px   | 18px |
| lg      | 48px   | 24px      | 16px   | 20px |
| icon    | 40x40  | 0         | —      | 18px + accessible name |

States: hover (one shade step), active (two steps), focus-visible (ring, never bare
`outline: none`), disabled (muted bg + `not-allowed`, non-interactive), loading (spinner
replaces label **within the same dimensions** — no size change, submit locked).

## Input / Textarea / Select trigger

- Same height as the default button (40px) so rows align; same radius scale step.
- Border is a quiet hairline by default; the control stays identifiable through its fill
  difference, visible label, and focus ring — never through a loud border (§12.5).
- Visible `<label>` above (or start-aligned), consistent label→control gap everywhere.
- States: focus-visible ring using the accent/ring token; error state = danger border +
  message via `aria-describedby` + `role="alert"` (never color-only); disabled muted.
- Padding X ≈ 12px; placeholder is `text-muted`, never the label.
- Custom selects/comboboxes follow the ARIA pattern or use a vetted headless lib
  (Radix / Headless UI / React Aria) — see guidelines §8 and §12.12.

## Card

- Padding: generous — 16–24px (sm) / 24–32px (default); cramped cards read as amateur.
- One separation method: border **or** shadow **or** surface shift (guidelines §12.5).
- Radius one step larger than the controls inside it (concentric nesting, §12.6).
- If clickable: whole card is the interactive element with hover + focus-visible states,
  one accessible name, and no nested interactive conflicts.

## Modal / Dialog

- Overlay uses the overlay elevation step; content constrained (`max-w-md/lg`) and
  vertically centered; body scroll locked while open.
- Focus trapped inside; initial focus on the first sensible control (not the destructive
  one); `Esc` closes; focus returns to the trigger on close.
- Title is the dialog's accessible name (`aria-labelledby`); destructive confirms name the
  action specifically ("Delete 3 invoices?") with the safe action as the default.
- Prefer a vetted primitive (Radix Dialog / Headless UI) over hand-rolled traps.

## Table / Data list

- Right-align + `tabular-nums` for numeric columns; left-align text; header row visually
  distinct and semantically `<th scope="col">`.
- Borders: light horizontal row dividers only (quiet-border token, §12.5) — no full dark
  gridlines, no vertical rules; header set apart by weight/case or a soft surface tint.
  (Exception: a requested bold-border style like Neobrutalism keeps its heavy grid.)
- Row height comfortable for the audience (denser for power users per the context file).
- Empty, loading (skeleton rows sized like real rows — no layout shift), and error states
  are all designed. Bulk/row actions keyboard-reachable.

## Toast / Alert / Inline feedback

- Semantic token per intent (success/warning/danger/info) + icon + text — never color
  alone. `role="alert"` for errors, `aria-live="polite"` for passive status.
- Toasts don't shift layout (overlay position, reserved region) and are dismissible.

## When the project has its own library

If the codebase uses shadcn/ui, MUI, or an in-house system, its components override these
specs — reuse them, pass variants through their API, and don't re-implement lookalikes
(see `existing-project.md` §2). These specs are for when you must build from scratch.
