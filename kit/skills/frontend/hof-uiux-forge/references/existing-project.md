# Source of Truth — Existing Project (maintain / update / add)

Use this module when there is **already a codebase** with a token source and/or established
component conventions. This is the maintain-and-update case: add a feature, extend a screen,
build a new component that must look and behave like the rest of the app. Here the existing
code IS the source of truth. Your job is to match it, not to redesign it.

The controlling principle: **discover, then conform.** Never introduce a parallel design
system, a second button style, or a rogue color alongside what already exists.

## 1. Discover the design tokens

Use the token location from the context file if one was given. Otherwise look, in roughly
this order, at what's in the workspace/session:

1. `tailwind.config.{js,ts,cjs,mjs}` — `theme` / `theme.extend` (colors, fontFamily,
   fontSize, spacing, borderRadius, boxShadow).
2. CSS custom properties — `:root { --... }` in `globals.css`, `app.css`, `index.css`,
   `theme.css`, or similar.
3. A token file — `tokens.json`, `design-tokens.json`, `theme.json`, `*.tokens.*`.
4. Any file the developer attached this session that defines colors/type/spacing.

Extract the concrete token names/values you're allowed to use, and prefer the project's
**semantic** tokens (`bg-surface`, `text-primary`, `border-danger`) over raw palette steps.

**If you truly cannot find any token source**, ask the developer to point you at it or to
confirm you may use framework defaults — but first double-check this is really an existing
project and not a greenfield one mislabeled. If there genuinely are no tokens and the
developer wants you to define them, switch to `greenfield.md`. Do not emit hardcoded colors.

## 2. Audit the existing conventions

Matching tokens is necessary but not sufficient — match how the codebase is *written* so
new code is indistinguishable from existing code:

- **Component patterns:** how are buttons, inputs, cards, modals built? Class-based,
  variant props (e.g. `cva`), a component library (shadcn/Radix/MUI)? Reuse the existing
  component, don't hand-roll a lookalike.
- **File & naming conventions:** directory layout, file naming, export style, how variants
  and sizes are named. Follow them.
- **Icon set:** identify the one in use (lucide, heroicons, custom) and use only it.
- **State & interaction patterns:** how existing components express hover/focus/disabled/
  loading, how they handle async, what toast/dialog/confirm primitives exist. Reuse them.
- **Spacing & layout rhythm:** the gaps and container widths already in use; match them.

Briefly report what you found and will conform to (e.g. "Matching shadcn `Button`
variants, lucide icons, `cn()` class pattern, 4px spacing, tokens from
`tailwind.config.ts`").

## 3. Build to match

Generate the new UI so it slots into the existing app seamlessly: existing tokens only,
existing component primitives reused, existing conventions followed, plus every hard rule
and Part B heuristic from `ux-guidelines.md`. New work should look like the same team wrote
it on the same day.

## Guardrails specific to existing projects

- **Respect scope.** If the context marks something out of scope, or the change would
  ripple beyond what was asked (e.g. altering a shared component used elsewhere), flag it
  and ask before touching shared code — don't silently restyle the whole app.
- **Missing token, don't invent.** If the feature needs a color/size the token set doesn't
  provide, surface the gap and propose adding a named token — never drop in a raw literal.
- **Don't "improve" unasked.** If you notice the existing system violates a hard rule
  (e.g. a control missing a focus state), you may note it, but match the request's scope;
  wholesale refactors happen only when asked.
- **Consistency over your own taste.** Even if you'd design it differently, conform to what
  exists unless the developer asks for a redesign (which is a different, greenfield-like
  task).
