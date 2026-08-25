---
name: hf-uiux-forge
description: "Generates production-quality frontend UI (React/Tailwind by default) that is correct by construction — WCAG AA accessibility, design tokens, interaction states, responsive layout, consent and legal rules — following the project's design source of truth, including a Figma file. Use this WHENEVER building any frontend UI: a component, form, modal, page, layout, nav, a whole screen, or \"just some quick UI\", even if UX, accessibility or tokens aren't mentioned. Auditing existing UI is uiux-audit."
---

# UX/UI Forge

Generate UI that is correct by construction. The developer describes a feature; this skill
produces frontend code (React + Tailwind by default) that satisfies the request **and** is
verified against a fixed set of UX/accessibility/legal rules, honors the project's design
**source of truth**, and reads as genuinely well-crafted before it is shown. The goal is a
guardrail: rogue colors, missing labels, absent focus states, broken mobile layouts,
unexpected layout shift, and out-of-scope work should be impossible to ship, not caught
later in review.

Write the code, not a design lecture. Do not offer subjective design opinions unless the
developer asks — enforce the standard and move on.

## Step 1 — Load the global rules (always)

Read `references/ux-guidelines.md` in full first. It has three parts: **Part A — hard
rules** (accessibility, legal/consent, tokens, states, responsive, forms — all pass/fail),
**Part B — design heuristics** (Nielsen's 10, behavioral/psychology principles, Gestalt,
visual polish) applied with judgment to make the UI genuinely good, and **Part C** — a
pre-ship checklist plus a **Company Internal Rules** section the team may have filled in.
Hard rules and any defined Company Internal Rules are binding constraints. If the Company
Internal Rules section still contains only the placeholder, proceed on the rest — do not
fabricate company rules.

## Step 2 — Determine the source of truth and load its module (always)

The most important decision is **what defines the design** for this task. Pick the mode
that fits and read the matching module in full. This is the seam the skill is built
around; do not skip it.

- **Figma / MCP** — the developer references a Figma file, frame, or component, OR a Figma
  (or comparable design-tool) MCP connector is available, OR the context file names Figma
  as the design source. The design is the binding spec.
  → Read `references/figma-mcp.md`.

- **Existing project** — there is already a codebase with a token source (a
  `tailwind.config`, CSS custom properties, a tokens file) and/or established component
  conventions to match. This is the maintain / update / add-a-feature case.
  → Read `references/existing-project.md`.

- **Greenfield** — a new project from scratch with no tokens, no components, and no design
  source yet. You establish a minimal, intentional design system first, then build on it.
  → Read `references/greenfield.md`.

If more than one applies, prefer them in this order: **Figma/MCP → existing project →
greenfield.** A Figma source of truth overrides guesses; an existing codebase overrides
greenfield defaults. When genuinely ambiguous (e.g. an existing project that also has a
Figma file), state which you're treating as authoritative and why, in one line, then
proceed. Do not stall.

## Step 3 — Load the project/client context (if present)

Look for a project context file in the workspace/session — their usual location is
`<project-root>/ai/contexts/` (also check the project root for older files). **Match by filename:**
treat the file named `uiux-context.md` (case-insensitive) as the project context file, along with
any `uiux-context-<suffix>.md` — the `uiux-context-` prefix followed by any word (e.g.
`uiux-context-notes.md`, `uiux-context-billing.md`) — as additional project context. Read them all
together. Also accept a file the developer attaches this session that clearly describes the overall
application. If several files match, read them all as one combined context; if two of them conflict,
prefer the most specific/most recently provided and note which you used. This file is
project-specific and is deliberately NOT bundled in the skill, because each client differs.

If found, read it in full and treat it as binding context: app type/users/goals; scope and
out-of-scope (never build what's marked out of scope — flag it instead); tech stack,
component library, and icon set (match them, respect off-limits libs); token location (feed
it to the source-of-truth module from Step 2); accessibility target (default WCAG AA;
enforce stricter if required — AAA, 508, EN 301 549); named design source (e.g. "Figma is
authoritative" — this decides Step 2); and any project-specific UX rules (enforce with the
same weight as the global hard rules).

If no context file is found, **create `uiux-context.md` before building** rather than
guessing at the project — use the `hf-uiux-context` skill to scaffold it under
`<project-root>/ai/contexts/` and fill in everything discoverable from the codebase. If that skill isn't available in this
session, create the file yourself from its questionnaire, filling what the code makes
verifiable and leaving the rest as `TBD`. Then read the new file as this step's context and
proceed. Do not invent client rules — a `TBD` is better than a fabricated one.

## Step 4 — Establish the design foundation (per the Step 2 module)

Resolve the concrete design values you're allowed to use — this is where the three modes
diverge, and it is handled by the module you loaded in Step 2:

- **Figma/MCP** → extract tokens, component specs, and layout intent from the design and
  map them to code tokens (`references/figma-mcp.md`).
- **Existing project** → discover the existing tokens and conventions and match them; never
  spin up a parallel system (`references/existing-project.md`).
- **Greenfield** → define a minimal, intentional token system (roles, type scale, spacing,
  radius, elevation) and record it in a real token source so it becomes the project's
  source of truth going forward (`references/greenfield.md`).

Never invent one-off colors, type sizes, or spacing during the build. In every mode the
rule is the same: **there is a defined token source, and generated code only uses tokens
from it.** Briefly tell the developer what foundation you're building on (e.g. "Using
tokens from `tailwind.config.ts`: `primary`, `surface`, `danger`, 4px spacing scale,
`Inter`" / "Established a greenfield token set: neutral-slate surfaces, one indigo accent,
1.25 type scale" / "Mapped from Figma variables: `color/*`, `space/*`, `radius/*`") so they
can catch a wrong-source mistake early.

## Step 5 — Read the request

Take the developer's raw request at face value for *what* to build, interpreted against the
context (Step 3) and the design foundation (Step 4). You supply the *how* (compliance).

**Multiple requirements in one request are expected.** If asked for several
features/components at once, or a whole screen or app, address each while keeping the system
coherent: establish the shared foundation once (Step 4), build the pieces so they reuse the
same tokens and component patterns, and don't restyle the same element differently per
instance. If a request is under-specified in a way that affects compliance ("add a delete
button" needs a confirm state; "a form" needs which fields), make a reasonable, stated
assumption consistent with the context and keep going rather than stalling.

## Step 6 — Generate compliant code

Write the component(s) to satisfy the request while enforcing every applicable rule from
Steps 1–4. Non-negotiably:

- **Only token-backed colors** — no raw hex/rgb literals that aren't a defined token (from
  the code, from Figma, or from the greenfield set you defined).
- **Accessible** — labels on all inputs, accessible names on icon buttons, semantic HTML,
  visible `focus-visible` states, keyboard operability, no color-only signaling, contrast
  meeting the project's target (AA by default) against the actual token values.
- **Legal/consent at the UI level** — where the feature involves consent, tracking, or
  data collection, follow Part A's legal rules (genuine reject option, nothing pre-ticked,
  clear disclosure, no dark patterns).
- **All interaction states** — hover, focus-visible, active, disabled, and loading where
  the action is async. A control with only a default state is incomplete.
- **Responsive & mobile-first** — base styles for small screens, layered `sm:/md:/lg:`,
  nothing clipped at the project's minimum viewport (320px by default).
- **No unexpected layout shift** — reserve space for media and async content; controls keep
  a stable size across states.
- **Consistent spacing/type** — from the project scale, no magic numbers.
- **In scope, on-stack, and true to the source** — nothing the context marks out of scope;
  match the stack, component library, and icon set; where Figma is the source, match its
  spec faithfully (see the fidelity-vs-correctness rule in `references/figma-mcp.md`).

Prefer semantic tokens over raw palette steps. Match the project's existing conventions
where visible. When building common components (buttons, inputs, cards, modals, tables,
toasts) without a component library to reuse, read `references/component-specs.md` for
concrete default sizes, paddings, and state tables so you don't guess. Beyond the hard
rules, apply the **design heuristics in Part B** to make the
UI genuinely good: one visually prominent primary action, minimized/progressively-disclosed
choices, immediate feedback, conventional patterns, proximity-based grouping, and designed
empty/loading/error/success states — not just the happy path. Never use dark patterns.

## Step 7 — Self-verify before showing (required)

Before returning code, walk the checklist and fix anything that fails. This step is what
makes the skill a guardrail rather than a suggestion. Do it silently, then present only
compliant code. The full checklist lives in Part C of `references/ux-guidelines.md`.

**Mechanical check first (when you can execute code):** run the bundled validator on the
file(s) you generated —

```bash
node scripts/validate-tokens.cjs <generated-file-or-dir>
```

It flags hardcoded hex/rgb/hsl colors, arbitrary Tailwind lengths (`mt-[13px]`), and inline
pixel styles; exit code 0 means token-clean. Fix every finding (or annotate a genuinely
deliberate exception with a `token-ok` comment and mention it to the developer). Token
source files and CSS variable definitions are automatically exempt. If you can't execute
code in this session, do the same scan manually. Then walk the judgment checklist:

**Hard rules — must all pass (fix before showing):**

- [ ] Every color/spacing/type value maps to a token from the source of truth — zero rogue
      literals.
- [ ] Every input has an associated visible `<label>`; icon-only buttons have names.
- [ ] Every interactive element has hover + focus-visible + active + disabled (+ loading
      if async).
- [ ] Contrast pairings meet the project's target against the real token values.
- [ ] Layout works mobile-first with no clipping/overflow at the minimum viewport; no
      unexpected layout shift.
- [ ] Semantic HTML and correct heading order.
- [ ] Any UI-level legal/consent rule that applies to the feature is satisfied.
- [ ] Request is in scope; stack/component/icon constraints are honored; where Figma is
      authoritative, the output matches the spec (deviations flagged).
- [ ] Any Company Internal Rule and any project-specific UX rule is satisfied.

**Heuristic review — apply judgment, strengthen where weak (don't block on subjectivity):**

- [ ] One clear, visually distinct primary action; sensible hierarchy.
- [ ] Choices minimized / progressively disclosed; low cognitive load.
- [ ] Immediate feedback for actions; async shows a busy/skeleton state.
- [ ] Conventional, unsurprising patterns; destructive actions prevented or confirmed.
- [ ] Empty, loading, error, and success states are all designed. No dark patterns.

If a rule genuinely cannot be met (e.g. no token provides a contrast-passing color for a
required pairing, or a Figma spec conflicts with an accessibility hard rule), do not
silently break it — emit the best compliant version and flag the specific gap with the
tradeoff so the developer can resolve it (add a token, adjust the design, confirm an
override).

## Step 8 — Output

Choose the shape based on what was asked and how it'll be used:

- **Multiple components, a full page/screen, or something with clear reuse** → write real
  file(s) (e.g. `Button.tsx`, `SignupForm.tsx`) so they're drop-in and iterable. In
  greenfield mode, also write the token source you defined (e.g. `tailwind.config.ts` /
  `globals.css`) so the design system persists.
- **A single small snippet or a quick answer to "how would I…"** → an inline
  copy-pasteable code block is fine.

When in doubt or when the developer states a preference, follow the developer's intent.
Keep any prose around the code short: what you built, which source of truth and tokens you
used, and any flagged gap or out-of-scope note from Step 7 — nothing more.
