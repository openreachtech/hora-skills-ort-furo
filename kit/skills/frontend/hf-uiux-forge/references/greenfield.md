# Source of Truth — Greenfield (from scratch)

Use this module when there is **no existing token source, no components, and no design
file** — a new project. Here the skill does NOT stall for a missing token source; instead
it establishes a small, intentional design system, records it in a real token file, and
then builds on it. The system you define becomes the project's source of truth for every
later session.

The controlling principle: **define the system first, then build only from it.** Never
scatter one-off colors, sizes, or spacing through components and call it a design later.

## 1. Infer the design direction

From the request and any context file, infer the product's character before choosing any
value. Ask (of yourself, not the user, unless truly blocked): what kind of product is this
(dense internal tool, consumer app, marketing/editorial, dashboard)? Who uses it and in
what setting? What tone fits — utilitarian and quiet, warm and approachable, bold and
expressive? A finance dashboard and a kids' learning app should not come out looking the
same. Pick a direction deliberately; avoid the templated, default-Tailwind look. Lean on
Part B §12 (Visual Craft) of `ux-guidelines.md` for what "considered" means.

If the developer gave a brand, a reference product, a mood, or existing assets (logo,
colors), honor those as the seed. If they gave nothing, choose a restrained, professional
direction and state it in one line so they can redirect.

## 2. Define the token system (minimal but complete)

Establish the smallest set of tokens that still covers real UI needs. Define **roles, not
raw hues** — components reference roles, so the palette can change later without touching
components.

- **Color roles:** `surface`, `surface-raised`, `border`, `text-primary`, `text-muted`,
  one `accent` (plus a hover/active step), and semantic `success` / `warning` / `danger`.
  Follow the 60/30/10 balance (§12.3): neutral-dominant, accent earned. Prefer slightly
  tinted neutrals over pure gray; avoid pure `#000`/`#fff` on large surfaces. Check every
  foreground/background pairing against the AA contrast floor (§1) as you pick values — a
  greenfield palette that fails contrast is a broken palette. Build the text tiers
  deliberately (§1): primary text ~12–17:1, muted ~4.5–7:1 — never a muted tone that dips
  under 4.5:1, never pure `#000` on `#FFF`. If the context describes older users,
  outdoor/glare use, or high-stakes flows, raise the whole ladder (7:1 body or AA+headroom). Define `border` as a quiet hairline (~1.1–1.6:1 against `surface`, tinted toward the
  surface hue) per §12.5 — structure comes from spacing and surface shifts first. If a named
  bold-border style (Neobrutalism, Cyberpunk, Retro, …) is requested, encode that style's
  heavy border as the token value instead.

  Structure color as two thin layers — **primitives** (raw scale values, e.g.
  `--blue-600`) referenced by **semantic roles** (e.g. `--color-accent: var(--blue-600)`) —
  so themes and dark mode swap at the semantic layer without touching components.
  Components reference only semantic roles. A third, per-component token layer
  (`--button-bg`) is optional; add it only when a real customization need appears — don't
  scaffold it speculatively.
- **Type scale:** one font family (two at most: display + body), a modular scale (~1.2–1.25
  ratio, 4–6 sizes), 2–3 weights. Set body line-height ~1.5, headings tighter.
- **Spacing scale:** an 8px base with 4px for fine steps (Tailwind's default already does
  this — extend, don't fight it).
- **Radius scale:** a small set (e.g. inputs/buttons one step, cards a larger step, pills
  full) applied consistently, with concentric nesting (§12.6).
- **Elevation:** a 2–3 level shadow system (flat → raised → overlay), soft and low-contrast
  (§12.5).

Keep it lean. A handful of well-chosen tokens beats a sprawling palette. If the project
will have dark mode, define it as a first-class variant (re-checked contrast), not inverted
colors.

## 3. Record the tokens in a real source

Write the tokens to an actual file so they persist and future sessions (and the
`existing-project` path) can discover them — do not keep them only in your head:

- **Tailwind projects (default):** put them in `tailwind.config.{ts,js}` under
  `theme.extend` (colors, fontFamily, fontSize, spacing, borderRadius, boxShadow), and/or
  CSS custom properties in `globals.css` for runtime theming/dark mode.
- **Non-Tailwind:** a `:root { --... }` block in the main stylesheet, or a `tokens.json`,
  whichever matches the chosen stack.

This file is a first-class deliverable in greenfield mode — ship it alongside the
components (SKILL.md Step 8).

## 4. Build on the system

Now proceed exactly as the shared flow expects: generate components that reference only the
tokens you just defined, with all interaction states, responsive behavior, and the Part B
heuristics. Because you defined the system, "only token-backed colors" is fully enforceable
from the first component.

## Guardrails specific to greenfield

- **Don't over-build the system.** Define what the current request needs plus the obvious
  near-neighbors; don't ship a 200-token design system for a login form. Extend later as
  real needs appear.
- **Stay coherent across a multi-part request.** If asked for several screens at once,
  define the system once and reuse it everywhere — the whole point of doing tokens first.
- **State your choices briefly, don't lecture.** One line on the direction and the token
  set is enough; the developer can override in a follow-up or a context file.
- **If the developer later adds a Figma file or real brand tokens,** that becomes the
  source of truth and replaces the provisional greenfield set (switch to the Figma/MCP or
  existing-project path).
