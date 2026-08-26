# UX Guidelines

The rule set for all generated UI. Read in full before writing code.

This file has three parts:

- **Part A — Hard rules.** Pass/fail constraints. Generated code that violates any of these
  is broken and must be fixed before it is shown. These are checked in the skill's
  self-verify step.
- **Part B — Design heuristics.** Judgment guidance that makes UI genuinely good, not just
  compliant. Apply them while generating; where a call is subjective, prefer the option
  that satisfies more of these. They inform choices — they are not binary gates.
- **Part C — Pre-ship checklist & Company Internal Rules.**

## Contents
PART A — HARD RULES
  1. Accessibility (WCAG 2.1 AA)
  2. Color & Tokens
  3. Typography
  4. Spacing & Layout
  5. Interaction States
  6. Responsive Behavior
  7. Motion
  8. Forms
  8b. Legal & Consent (UI-level)
PART B — DESIGN HEURISTICS
  9. Nielsen's 10 Usability Heuristics
  10. Behavioral & Psychology Principles
  11. Gestalt / Visual Perception
  12. Visual Craft & Modern Aesthetics
PART C
  13. Pre-ship UX Checklist
  14. Company Internal Rules  ← your team edits this section

===============================================================================
PART A — HARD RULES  (pass/fail; enforced)
===============================================================================

## 1. Accessibility (WCAG 2.1 AA)

- **Contrast — floors, not targets.** WCAG minimums are the legal floor: 4.5:1 for body
  text, 3:1 for large text (>=24px, or >=19px bold) and for UI components that must be
  identified (focus indicators, control boundaries, essential icons). Verify against the
  actual token values, not the color's name, and flag a failing pairing rather than
  shipping it. But do NOT treat maximum contrast as the goal — pure `#000` on `#FFF`
  (21:1) causes halation/glare for users with astigmatism, light sensitivity, and many
  dyslexic readers, and flattens visual hierarchy. Design contrast in **tiers**:
  - *Primary text:* ~12–17:1 (near-black on near-white; e.g. `#1C1B18` on `#FFFFFF` ≈ 17:1)
    — comfortably above the floor, below the harsh extreme.
  - *Secondary/muted text:* ~4.5–7:1 — still passing, visibly quieter. Muted must never dip
    below 4.5:1; "muted" is a hierarchy choice, not an exemption.
  - *Disabled controls, decorative graphics, logos:* WCAG-exempt — do not inflate them to
    pass; their low contrast IS the signal.
  - *Placeholders:* hold to 4.5:1 anyway (they carry real hints), which is another reason a
    placeholder is not a label.
  - *Non-text boundaries:* the 3:1 rule applies only when the boundary is what identifies
    the control. Decorative and structural borders (dividers, table lines, card outlines)
    are exempt — and should in fact default to quiet, low-contrast hairlines (§12.5). For
    inputs, prefer identification via fill difference + visible label + strong focus
    treatment, which frees the border itself to be soft; a border that is a control's
    *only* identifier must meet 3:1. Focus indicators are always >=3:1 against
    adjacent colors — no exceptions.
  **Audience adjusts the floor upward, never downward** (see the context file): products
  for older users, low-vision audiences, outdoor/sunlight or glare-prone use, or
  safety-critical flows should target 7:1 body text (AAA) or at minimum build ~10–15%
  headroom above AA, since anti-aliasing, gradients, images-under-text, and rendering
  differences eat margin. Long-form reading surfaces should also soften the top tier
  toward ~15:1 for comfort. In dark mode, avoid pure white body text on dark surfaces
  (glow/halation) — soften toward `#E6E4DF`-class near-whites and re-verify ratios.
  (WCAG 2.x ratios are the enforceable standard today; the APCA model in draft WCAG 3 is
  font-size/weight-aware and better matches perception — treat it as informative direction,
  not a license to break the 2.x floor.)
- **Semantic HTML first:** Use the correct native element (`<button>`, `<a>`, `<nav>`,
  `<main>`, `<label>`, `<ul>`, ordered headings) before `<div role="...">`.
- **Keyboard operable:** Every interactive control reachable and operable by keyboard, in a
  logical tab order. No positive `tabindex`. Custom controls get the right key handlers
  (Enter/Space, Esc to close, arrows for menus/tabs).
- **Visible focus:** Every focusable element has a clearly visible `focus-visible`
  indicator. Never `outline: none` without a replacement.
- **Names & roles:** Icon-only buttons need an accessible name (`aria-label` or visually
  hidden text). Images need `alt`; decorative images use `alt=""`. Inputs need labels (§8).
- **Don't signal by color alone:** Errors/status/required also carry text, icon, or shape.
- **Target size:** Touch targets at least 44x44 CSS px (or equivalent spacing).
- **Live regions:** Async status uses `aria-live="polite"`; errors use `role="alert"`.

## 2. Color & Tokens

- **No rogue colors.** Only colors that resolve to a defined token — a Tailwind theme
  color, a CSS custom property, or a value from the project's token source. Never emit a
  raw hex/rgb/hsl literal that isn't backed by a token.
- If a required color doesn't exist in the tokens, **do not invent one** — surface the gap.
- Prefer semantic tokens (`bg-surface`, `text-primary`, `border-danger`) over raw palette
  steps (`bg-blue-500`) when the project defines them.

## 3. Typography

- Use the project's type scale and font-family tokens; no arbitrary `font-size`/
  `line-height` outside the scale.
- Readable line length (~45-75 characters) for body copy.
- Sensible line-height (~1.4-1.6 for body).
- Preserve heading hierarchy — one `<h1>` per view, no skipped levels for styling.

## 4. Spacing & Layout

- Use the project spacing scale (Tailwind 4px base by default). Avoid magic-number spacing
  (`mt-[13px]`) unless a token demands it.
- Consistent, rhythmic spacing — the same relationship uses the same gap everywhere.
- Avoid fixed pixel sizes that clip content; prefer fluid sizing with sensible max-widths.

## 5. Interaction States

Every interactive element defines **all** applicable states — default-only is incomplete:
`hover`, `focus-visible`, `active`, `disabled` (visually distinct + non-interactive), and
`loading` for async actions (busy state + prevent double-submit).

When multiple states apply, priority (highest wins):
`disabled > loading > active > focus-visible > hover > default`.

Derive state colors from the base token (a small shade/opacity step), not new arbitrary
values. Standard transitions: color/background/opacity ~150ms, transform/shadow ~200ms
(§12.8), honoring reduced motion. Concrete per-component specs (sizes, paddings, state
tables) live in `component-specs.md` — read it when building buttons, inputs, cards,
modals, tables, or toasts from scratch.

## 6. Responsive Behavior

- **Mobile-first.** Base styles for small screens; layer `sm: md: lg:`.
- No horizontal scroll or clipped content at 320px.
- Layouts reflow (stack -> grid) rather than shrinking text into illegibility.
- Media scale within their container (`max-w-full`, sensible aspect ratios).

## 7. Motion

- Short, purposeful transitions (typically 150-300ms).
- Honor `prefers-reduced-motion: reduce`.
- Never use motion as the only indicator of a state change.

## 8. Forms

- Every input has an associated, visible `<label>` (`htmlFor`/`id`). Placeholder is not a
  label.
- Group related controls with `<fieldset>`/`<legend>` where appropriate.
- Mark required fields in text (not color alone); expose them (`required`/`aria-required`).
- Errors tied to their field (`aria-describedby`), announced (`role="alert"`), phrased as
  helpful text, not just a red border.
- Correct `type`/`inputmode`/`autocomplete` per field.
- **Custom controls follow ARIA patterns.** If you replace a native control (select,
  combobox, checkbox, toggle) with a custom component, it MUST implement the matching ARIA
  Authoring Practices pattern: correct roles, full keyboard support (arrow keys, Enter/
  Space, Esc, and typeahead for lists), and managed focus. A `<div>` with an `onClick` is
  not an acceptable dropdown. If you can't meet the pattern, use the native control.

## 8b. Legal & Consent (UI-level)

Scope: the legal obligations a front-end developer actually controls in the interface. This
is not legal advice — it's the set of UI-level requirements that keep generated interfaces
compliant with common accessibility, privacy, and consumer-protection law. When a feature
clearly implicates any of these, treat the relevant point as a hard rule; when in doubt or
when a jurisdiction-specific obligation is involved, flag it for the developer/ their
counsel rather than guessing.

- **Accessibility is a legal baseline, not just best practice.** In many jurisdictions the
  WCAG target in §1 is legally mandated (e.g. ADA in the US, Section 508 for US federal,
  EN 301 549 in the EU, AODA in Ontario). The project's accessibility target may be a legal
  requirement — meet it, and if the context file sets a stricter one, that governs.
- **Consent must be freely given.** Where the UI asks for consent to tracking, analytics,
  marketing, or non-essential cookies: reject/decline must be as easy as accept (equal
  prominence, same number of clicks), nothing that gathers consent is pre-ticked or
  pre-enabled, and non-essential processing does not start before the user opts in. No
  "accept all" button without an equally reachable "reject all".
- **Clear disclosure.** Data collection, its purpose, and links to privacy/terms are
  visible and readable before the user commits — not buried, not in near-invisible text.
- **No dark patterns (increasingly legislated).** Confirmshaming, forced continuity,
  hidden costs, disguised ads, obstructed cancellation ("roach motel"), and preselected
  paid add-ons are prohibited here and are the subject of active regulation (e.g. EU DSA
  and consumer-protection rules, US FTC guidance and state laws like the California CPRA).
  This reinforces the hard "no dark patterns" rule in Part B §10.
- **Cancellation/withdrawal parity.** If the UI lets a user subscribe, opt in, or consent,
  it must let them unsubscribe, opt out, or withdraw with comparable ease.
- **Age-appropriate handling.** If a feature targets or foreseeably reaches children, don't
  design engagement-maximizing or consent-nagging patterns aimed at them; flag anything
  that collects data from minors for review.

If a request would require building something that violates one of these (e.g. a
cookie banner with only "Accept"), do not build it silently — implement the compliant
version and flag the change, or surface the conflict if the developer insists.

===============================================================================
PART B — DESIGN HEURISTICS  (apply with judgment)
===============================================================================

## 9. Nielsen's 10 Usability Heuristics

Each is followed by its concrete UI implication.

1. **Visibility of system status** — always show what's happening: loading states, saved
   indicators, progress, selected/active states.
2. **Match the real world** — use users' language and familiar concepts; order things the
   way users think, not the way the database does.
3. **User control & freedom** — provide clear exits: cancel, back, undo, dismiss. Never
   trap the user; destructive actions are reversible or confirmed.
4. **Consistency & standards** — same thing looks/behaves the same everywhere; follow
   platform and web conventions (Jakob's Law).
5. **Error prevention** — prevent errors before they happen: sensible defaults, constraints
   (disable invalid options), confirmation for destructive/irreversible actions.
6. **Recognition over recall** — show options and context; don't make users remember data
   across steps. Autofill, summaries, visible labels.
7. **Flexibility & efficiency** — accelerators for frequent users (keyboard shortcuts,
   bulk actions, saved preferences) without hurting first-timers.
8. **Aesthetic & minimalist design** — every element earns its place; remove decoration
   and copy that don't help the task.
9. **Help users recover from errors** — plain-language messages that say what went wrong
   and how to fix it; no codes-only errors.
10. **Help & documentation** — provide contextual help where needed (tooltips, empty-state
    guidance, inline hints); make it findable and task-focused.

## 10. Behavioral & Psychology Principles

Named principles behind good product decisions. Apply them to layout, flow, and copy.

- **Hick's Law** — decision time grows with the number/complexity of choices. Reduce
  options, use progressive disclosure, provide a recommended default, break long forms into
  steps.
- **Fitts's Law** — time to hit a target depends on its size and distance. Make primary
  actions large and easy to reach; keep related controls close; use screen edges/corners.
- **Miller's Law** — working memory holds ~7 (±2) chunks. Chunk content and group into
  small sets; don't present long undifferentiated lists.
- **Jakob's Law** — users expect your product to work like the others they already use.
  Favor conventional patterns for nav, search, forms, and icons over novel ones.
- **Von Restorff (Isolation) Effect** — the item that differs is remembered and clicked.
  Give the single primary action distinct visual weight; don't make everything loud.
- **Serial Position Effect** — first and last items are best recalled. Put the most
  important nav items / actions at the start or end of a set.
- **Zeigarnik Effect** — unfinished tasks stay top-of-mind. Use progress indicators and
  checklists to nudge completion.
- **Goal-Gradient Effect** — motivation rises closer to a goal. Show progress and, where
  honest, endowed progress (e.g. "step 2 of 4").
- **Peak-End Rule** — people judge an experience by its peak and its end. Invest in key
  moments and endings: success states, confirmations, empty-to-first-win transitions.
- **Aesthetic-Usability Effect** — attractive interfaces are perceived as more usable and
  earn tolerance for minor flaws. Visual polish is functional, not decoration.
- **Doherty Threshold** — keep system response under ~400ms or the user disengages. Give
  immediate feedback: optimistic UI, skeletons, spinners, disabled+busy buttons.
- **Cognitive Load** — minimize total mental effort. One primary action per screen; reduce
  clutter; defer advanced options.
- **Progressive Disclosure** — reveal complexity only as needed (accordions, "advanced"
  sections, wizards) so the default view stays simple.
- **Default Effect** — people tend to keep preselected options. Choose safe, beneficial,
  honest defaults.
- **Anchoring** — the first value seen frames judgment (e.g. show original price beside the
  discounted one). Use truthfully.
- **Loss Aversion** — losses feel larger than equivalent gains. Frame around protecting
  what the user has (e.g. "keep your progress") without dark patterns.
- **Social Proof** — people look to others' behavior. Surface reviews, counts, and
  testimonials where relevant and genuine.
- **Confirmation before destruction** — pair irreversible actions with a clear, specific
  confirm ("Delete 3 invoices?") rather than a generic "Are you sure?".
- **Signifiers / affordance** — a control must visually communicate what it does and how to
  use it: buttons look pressable, links look clickable, draggable things look draggable.
  Don't make users guess whether something is interactive.
- **Feedback** — every user action produces immediate, visible feedback (state change,
  toast, inline confirmation). Silence reads as "it didn't work."
- **Feedforward** — tell users what will happen *before* they act: hover/focus hints,
  previews, and warnings like "This can't be undone" on the control itself.
- **Actionable labels** — button and link text names the action ("Create account", "Save
  changes"), not "Submit"/"OK". The prompt itself says what happens next.
- **Visual anchors** — give each view a deliberate focal point (a heading, an image, the
  primary CTA) that starts the eye and leads it through the content.
- **Nudge** — gently steer toward the recommended or safest option with emphasis, ordering,
  and defaults — never by hiding or disabling the alternative.
- **Priming & consistency** — earlier visual context sets expectations; keep styling,
  terminology, and iconography consistent so nothing later feels contradictory.
- **Tesler's Law (conservation of complexity)** — some complexity is irreducible; handle it
  in the UI (smart defaults, inference) rather than pushing it onto the user.
- **Occam's Razor** — prefer the simplest layout/flow that does the job; remove steps,
  fields, and options that don't earn their place.
- **Spark Effect** — lower the effort of the primary action; the smaller the perceived
  effort, the more likely users act (fewer required fields, one-tap start).
- **Centre-Stage Effect** — in a set of comparable options (e.g. pricing tiers), the middle
  draws the most attention; arrange options intentionally and honestly.
- **Framing** — the same fact worded differently changes perception; frame honestly and
  constructively (e.g. "2 steps left" over "you haven't finished").
- **Picture Superiority** — pair meaningful icons/imagery with text labels; visuals are
  grasped and remembered faster than words alone (never icon-only without a name — see §1).
- **Labor Illusion** — for unavoidable waits, show what's happening ("Checking availability…"
  / stepwise progress) instead of a bare spinner.
- **Negativity Bias** — one bad moment outweighs several good ones; handle errors gently and
  without blame, and protect users from costly mistakes.

> **Use these to help users, never to manipulate them. No dark patterns — this is a hard
> rule, not a heuristic.** The persuasion-oriented principles above and in the wider
> catalog (Scarcity, Decoy Effect, Social Proof, Reciprocity, Authority Bias, Loss
> Aversion, Variable Reward, Bandwagon, Sunk Cost) are easy to misuse. Never fabricate
> scarcity or social proof, use confirmshaming, force continuity, obscure exits/costs, or
> preselect paid options. If a requested pattern would deceive or trap the user, flag it
> instead of building it.

> **Source & full catalog.** The behavioral principles here are curated for UI code from a
> larger set of ~106 cognitive biases and principles maintained by Dan Benoni &
> Louis-Xavier Lavallée at https://growth.design/psychology (descriptions and UI guidance
> above are written for this skill, not copied). Browse the full catalog there for
> research/growth principles beyond component building; add any you want enforced to §14.

## 11. Gestalt / Visual Perception

How the eye groups things — use these to structure layout without extra chrome.

- **Proximity** — elements placed close together are read as related. Group with spacing
  before reaching for borders/boxes.
- **Similarity** — items that share color/shape/size read as the same kind. Keep like
  things visually alike; differentiate unlike things.
- **Common Region** — a shared background/border binds items into a group (cards, panels).
- **Closure** — the mind completes shapes; you don't need to draw every boundary.
- **Continuation** — the eye follows lines and alignment; align elements along shared axes.
- **Figure/Ground** — ensure a clear separation between foreground content and background.
- **Prägnanz (simplicity)** — the eye prefers the simplest interpretation; favor clean,
  regular shapes and layouts over ambiguous or busy ones.

## 12. Visual Craft & Modern Aesthetics

The difference between compliant UI and UI that looks genuinely modern and considered.
Apply with judgment; prefer these defaults unless the project's tokens/design say otherwise.

### 12.1 Hierarchy & focus
- **One primary action per view.** Give it the most visual weight; demote the rest to
  secondary (outline/tonal) and tertiary (text/ghost) styles.
- **Establish hierarchy with more than size.** Combine size, weight, color, and spacing —
  don't rely on font-size alone.
- **Squint test.** If you blur the screen, the most important element should still stand
  out. If everything is bold, nothing is.

### 12.2 Typography craft
- **Use a modular type scale** (e.g. 1.2-1.25 ratio) rather than arbitrary sizes; 4-6 sizes
  is plenty for most apps.
- **Limit weights** to ~2-3 (e.g. regular / medium / semibold). Avoid ultra-thin weights at
  small sizes — they hurt legibility.
- **Line-height scales inversely with size:** roomy for body (~1.5), tighter for large
  headings (~1.1-1.25).
- **Tighten tracking on large headings** slightly (negative letter-spacing); leave body at
  default. Add small positive tracking to ALL-CAPS labels.
- **Constrain measure** to ~45-75 characters for readability (`max-w-prose` / `max-w-[65ch]`).
- **Use tabular/lining numerals** (`tabular-nums`) for tables, prices, and any aligned
  figures so digits don't jitter.
- **Avoid widows/orphans** in headings; prevent single-word last lines where it matters.

### 12.3 Color & theming craft
- **Neutrals do most of the work.** Roughly a 60/30/10 split: dominant neutral surface,
  secondary tone, ~10% accent. The accent should feel earned.
- **Prefer slightly tinted neutrals** over pure gray, and avoid pure `#000`/`#fff` for large
  surfaces — soften to near-black/near-white for a more refined feel.
- **Build from token roles, not raw hues:** surface, surface-raised, border, text-primary,
  text-muted, accent, and semantic success/warning/danger. Map every color to a role.
- **State via a consistent system** — hover/active are usually a small lightness/opacity
  shift of the base token, not a new arbitrary color.
- **Dark mode is a first-class variant,** not inverted colors: re-check contrast, reduce
  large pure-white fills, and soften shadows (which barely show on dark).
- **Gradients/overlays, if used, stay subtle** and derive from token colors.

### 12.4 Spacing, grid & rhythm
- **Commit to a spacing scale** (an 8px base, with 4px for fine adjustments, is the modern
  default — Tailwind's scale already follows this). No off-scale magic numbers.
- **Space communicates grouping:** more space between unrelated groups, less within a group
  (ties to proximity, §11). Keep the label→control gap consistent everywhere.
- **Be generous with padding,** especially in cards, buttons, and around text. Cramped
  padding is the most common "amateur" tell.
- **Maintain vertical rhythm** — consistent gaps between stacked sections rather than ad-hoc
  margins.

### 12.5 Depth, elevation & borders
- **Adopt a small elevation system** (e.g. flat → subtle raised → overlay/modal) and use
  each level consistently for the same kind of surface.
- **Shadows are soft and low-contrast:** larger blur, low opacity, slight downward offset;
  tint them with the surface color rather than pure black. Avoid harsh 90s drop shadows.
- **Prefer one separation method at a time** — a border *or* a shadow *or* a background
  shift, not all three stacked on one element.
- **Quiet borders are the default.** Decorative and structural borders — card outlines,
  dividers, table lines, section separators — should be dim hairlines, roughly 1.1–1.6:1
  against their surface and tinted toward the surface hue (the modern-system range; e.g.
  `#E4E4E7`- or `#D0D7DE`-class neutrals on white). Full-strength dark borders on these
  read as dated. Let spacing, background shifts, and subtle elevation carry structure
  first, and reach for a border only when those aren't enough. This is WCAG-safe by
  design: the 3:1 non-text rule applies only to boundaries *required to identify* a
  component (see §1), which decorative borders are not.
- **Tables especially:** no full dark gridlines. Use light horizontal row dividers only
  (quiet-border token), generous row height, and a header distinguished by weight/case or
  a soft background — not by heavy rules. Zebra striping, if used, is a token-level
  surface tint, not a border.
- **Interactive controls stay identifiable without loud borders:** pair a quiet input
  border with a subtle fill difference (`bg-surface` vs. page), a visible label, and a
  strong focus treatment — the border may then be soft because identification doesn't
  depend on it. Never let a sub-3:1 border be a control's *only* identifier, and never
  quiet the focus indicator (>=3:1 always, §1).
- **Named-style override:** if the user requests a specific bold-border aesthetic —
  Neobrutalism, Pop-Art/Comic, Cyberpunk, Sci-Fi/HUD, Retro, Memphis, and the like — or
  directly asks for darker/stronger borders, that style's border language replaces this
  default entirely (thick high-contrast outlines and hard shadows are *correct* in
  Neobrutalism, not a defect). Apply the style consistently and record the choice (context
  file or a stated line) so audits judge against it.

### 12.6 Corner radius
- **Pick a radius scale and stick to it** (e.g. inputs/buttons `rounded-lg`, cards
  `rounded-xl/2xl`, pills `rounded-full`). Mixing many radii looks inconsistent.
- **Nested radius rule:** an inner element's radius should be smaller than its container's
  (inner ≈ outer − padding) so corners stay concentric.

### 12.7 Layout & composition
- **Constrain content width** on large screens (`max-w-*` with a centered container);
  full-bleed body text on a wide monitor reads poorly.
- **Align to a grid** and keep consistent page margins/gutters. Use optical alignment where
  mathematical alignment looks off (e.g. icons vs. text).
- **Design breakpoints intentionally** — reflow layouts (stack → multi-column) at sensible
  widths rather than letting elements squeeze.
- **Zero unexpected layout shift.** Nothing on the page may jump, reflow, or push other
  content as it loads or updates. This is a firm requirement, not a nice-to-have (target
  CLS 0). Concretely:
  - Give every image/video/embed explicit `width`/`height` or an `aspect-ratio` so its box
    is reserved before it loads.
  - Reserve space for async content with skeletons sized to match the final content; the
    skeleton and the loaded state occupy the same box.
  - Never insert banners, alerts, validation messages, or ads by pushing layout down —
    reserve their space up front, or overlay them, so surrounding content stays put.
  - Keep control size stable across states: a button showing a spinner must not grow or
    shrink; swap the label for the spinner within the same dimensions.
  - Prevent font-swap reflow (size-adjusted fallback fonts / `font-display` handling) and
    keep a stable scrollbar gutter (`scrollbar-gutter: stable`) so appearing scrollbars
    don't shift the layout.
  - Load without content "settling" — the first paint's layout is the final layout.
  - **Intentional, user-initiated changes are allowed and expected:** expanding/collapsing
    a section, opening an accordion or disclosure, showing a menu. Animate these smoothly
    (height/transform, honoring reduced-motion). What's forbidden is *unrequested* shift —
    movement the user didn't trigger.

### 12.8 Motion & micro-interactions
- **Animate `transform`/`opacity`,** not layout properties (width/height/top), for smooth,
  jank-free motion.
- **Use a small duration + easing scale:** ~150ms for small state changes, ~200-300ms for
  larger transitions; `ease-out` for elements entering, `ease-in` for leaving.
- **Micro-feedback on interaction** — a subtle scale/opacity/color shift on hover/press
  makes controls feel responsive and physical.
- **Motion has purpose** (orient, confirm, direct attention) and always respects
  `prefers-reduced-motion` (hard rule, §7).

### 12.9 Component consistency & sizing
- **Standardize control heights** (e.g. inputs and buttons share a height) so rows line up.
- **Size icons relative to text** and vertically center them with their label; keep a
  consistent icon size per context.
- **A component looks and behaves identically everywhere** — same padding, radius, shadow,
  and states. Build once, reuse; don't re-style per instance.
- **Match visual weight of paired elements** (e.g. an input and its adjacent button).

### 12.10 Data, content & formatting
- **Right-align numeric columns** and use tabular numerals; left-align text columns.
- **Format numbers, currency, and dates to locale;** never dump raw values.
- **Truncate gracefully** with ellipsis plus a tooltip/full value on demand; never let text
  overflow its container.
- **Design the empty, loading (skeleton), error, and success states** for any data view —
  the empty state is often the first impression and deserves guidance, not a blank panel.
- **Microcopy is concise and specific;** pick one case convention (sentence case is the
  modern default for UI) and apply it consistently to labels, buttons, and headings.

### 12.11 Overall taste
- **Restraint reads as quality:** few type sizes, few weights, a tight palette, consistent
  spacing. Most "ugly" UI is over-decorated, not under-decorated.
- **Consistency over cleverness** — a predictable, coherent system beats novel one-off
  treatments.
- **Polish the details:** alignment, consistent gaps, matching radii, real states, and
  crisp copy are what make UI feel modern and trustworthy.

### 12.12 Form controls & custom menus
- **A native `<select>`'s open option list is OS-rendered and cannot be styled with CSS.**
  Even a perfectly styled trigger shows a system-looking menu the moment it opens. For
  product UI that should feel designed, replace the popup with a custom accessible
  listbox/combobox (or a vetted headless library — Radix, Headless UI, React Aria), keeping
  it compliant per §8. Style the trigger AND control the menu.
- **Native controls remain fine when an OS-styled menu is acceptable** (simple internal
  forms, tight accessibility budget) — a styled native `<select>` is the most robust
  single-select. Choose deliberately rather than by default.
- **Match every control to the design system:** style or replace checkboxes, radios,
  toggles, sliders, and date pickers so they use token colors, radius, and focus rings
  instead of raw browser defaults (which look like the current OS).
- **Single vs multi-select — decide by the data, not by habit:**
  - *Single* when only one value is valid at a time — sort order, a mutually-exclusive
    mode/view, a status a record can only have one of.
  - *Multi* when several values can legitimately apply together — filtering a list by more
    than one status, owner, tag, or category.
  - When unsure, pick the option that matches how users actually filter/choose, render it
    as the appropriate accessible pattern (listbox with `aria-multiselectable`, or a set of
    checkboxes), and state the assumption. The developer can override per request or in
    `uiux-context.md`.

===============================================================================
PART C
===============================================================================

## 13. Pre-ship UX Checklist

Hard rules (must all pass):
- [ ] All colors/spacing/type map to defined tokens — zero rogue literals.
- [ ] Every input has a visible associated label; icon-only buttons have accessible names.
- [ ] Every interactive element has hover + focus-visible + active + disabled (+ loading if
      async).
- [ ] Contrast meets the project's target (AA default) against real token values.
- [ ] Mobile-first; no clipping/overflow at the minimum viewport.
- [ ] Semantic HTML; correct heading order.
- [ ] Reduced-motion honored; no color-only signaling.
- [ ] Zero unexpected layout shift: media/async content reserve their space, controls keep
      stable size across states, nothing pushes as it loads (user-initiated expand/collapse
      is fine).
- [ ] Any applicable UI-level legal/consent rule is met (§8b): consent freely given and
      symmetric, nothing pre-ticked, clear disclosure, cancellation parity, no dark
      patterns.

Heuristic review (apply judgment; improve where weak):
- [ ] One clear primary action, visually distinct (Von Restorff, hierarchy).
- [ ] Choices minimized / progressively disclosed (Hick's Law, cognitive load).
- [ ] Immediate feedback for every action; async shows busy/skeleton (Doherty, status
      visibility).
- [ ] Conventional patterns used; nothing surprising (Jakob, consistency).
- [ ] Destructive/irreversible actions prevented or confirmed clearly.
- [ ] Empty, loading, error, and success states all designed.
- [ ] Related items grouped by proximity/common region; layout aligned to a grid.
- [ ] Errors are plain-language and actionable.
- [ ] No dark patterns.

Visual craft (apply judgment; §12):
- [ ] Type from a modular scale; ~2-3 weights; body measure constrained; tabular nums for
      aligned figures.
- [ ] Neutral-dominant palette with a restrained accent; colors mapped to token roles;
      dark mode re-checked if applicable.
- [ ] Consistent spacing scale, generous padding, grouping via space.
- [ ] Consistent radius scale (concentric nesting) and a soft, consistent elevation system.
- [ ] Content width constrained on large screens; no layout shift on load.
- [ ] Transitions on transform/opacity with a small duration+easing scale; subtle
      hover/press micro-feedback.
- [ ] Consistent control heights; icons sized to and centered with text.
- [ ] Numbers/dates/currency formatted; graceful truncation; one case convention for copy.
- [ ] Controls match the design system (no raw OS-styled selects/checkboxes where a designed
      look is intended); custom menus follow the ARIA pattern; single vs multi-select chosen
      to fit the data.

## 14. Company Internal Rules

> Owned by your team. Add org-wide rules below and they are enforced like the global hard
> rules above. Delete the examples. (Per-CLIENT rules do not go here — put those in the
> project's `uiux-context.md`.)

<!-- Examples — replace these:
- Icon set is limited to lucide-react; do not import other icon libraries.
- Card corners use rounded-2xl; inputs use rounded-lg. No other radii.
- Never use native alert()/confirm(); use the in-app dialog component.
-->

(No company internal rules defined yet.)
