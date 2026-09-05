# Client / Project Context

> **How to use this file.** Save it under `<project-root>/ai/contexts/` as
> `ai/contexts/uiux-context.md` (case-insensitive) and fill in every section before building
> or auditing UI. Anything that doesn't fit the questionnaire can go in a
> `uiux-context-<suffix>.md` file in the same directory (e.g.
> `ai/contexts/uiux-context-notes.md`); the skills read those as additional context. Both the
> `hof-uiux-forge` (generator) and `hof-uiux-audit` (reviewer) skills read this file to understand
> the *whole* application, so when you later hand `hof-uiux-forge` a small raw requirement
> ("add a filters row to the orders table"), it already knows the app type, the scope, the
> stack, and this client's rules — and builds UI that fits instead of guessing; and
> `hof-uiux-audit` gains its scope-compliance, audience-fit, and expectation-fit sections
> instead of marking them "not assessable". The `hof-uiux-context` skill can create and fill
> this file for you.
>
> Answer under each **Q:** prompt. Leave `TBD` if genuinely unknown, but a filled-in file
> produces far better output. Keep it updated as scope changes — it's living documentation.

---

## 1. Project identity

- **Q: Client / project name?**
  > 

- **Q: One-sentence description of what this application is?**
  > 

- **Q: What stage is it in?** (greenfield / active build / maintenance / redesign)
  > 

## 2. Application type & audience

- **Q: What kind of application is this?** (e.g. marketing site, internal admin dashboard,
  customer-facing SaaS web app, e-commerce storefront, mobile-web PWA, booking portal…)
  > 

- **Q: Who are the primary users, and in what context do they use it?** (e.g. warehouse
  staff on tablets, general consumers on phones, analysts on large desktop monitors)
  > 

- **Q: What are the top 3 things users come here to do?**
  > 

- **Q: How familiar are these users with this kind of tool, and how often do they use it?**
  (first-timer → daily power user) — this drives information density, how much guidance/
  onboarding vs. efficiency and shortcuts, and how safe the defaults should be.
  > 

- **Q: What's their mindset and the stakes when using it, plus any audience-wide
  accessibility needs?** (e.g. rushed/anxious vs. calm; low-stakes vs. financial/medical/
  legal; older or low-vision users, one-handed or outdoor use) — this drives tone,
  reassurance, confirmation strength, error handling, and can raise the accessibility target
  above the WCAG AA baseline.
  > 

## 3. Scope

- **Q: What is IN scope?** (features, sections, and flows this engagement covers)
  > 

- **Q: What is explicitly OUT of scope?** (so the skill won't build things you shouldn't —
  e.g. "no auth UI, client provides it", "no admin panel this phase")
  > 

- **Q: Are there hard deadlines or phases that affect what to build now vs. later?**
  > 

## 4. Platforms & devices

- **Q: Which platforms must be supported?** (desktop / tablet / mobile — and priority order)
  > 

- **Q: Minimum viewport / smallest device to support?** (default is 320px wide)
  > 

- **Q: Browser support requirements?** (e.g. last 2 versions of evergreen browsers, or a
  specific legacy target)
  > 

## 5. Tech stack & tokens  *(the skill relies on this)*

- **Q: Framework and styling approach?** (e.g. React + Tailwind, Next.js, Vue + CSS
  modules — the skill defaults to React/Tailwind)
  > 

- **Q: WHERE are the design tokens defined?** (path to `tailwind.config.*`, the CSS file
  with `:root` custom properties, or a `tokens.json`) — the skill reads colors, type, and
  spacing from here and will not invent values.
  > 

- **Q: Is there a connected/authoritative design?** (e.g. a Figma file via MCP, or attached
  mockups) — if so, name it and note whether it defines light mode, dark mode, or both. The
  skill treats a provided design as the source of truth and matches it. (Precedence when
  several exist: Figma/design file → existing code tokens → skill-defined greenfield
  system.)
  > 

- **Q: Component library / design system in use?** (e.g. shadcn/ui, MUI, in-house lib)
  > 

- **Q: Icon set?** (e.g. lucide-react only) and any libraries that are OFF-limits.
  > 

- **Q: Existing components or patterns the skill should reuse rather than recreate?**
  > 

## 6. Accessibility & compliance

- **Q: Accessibility target?** (default and baseline is WCAG 2.1 AA — note if a client
  requires AAA, Section 508, EN 301 549, or something stricter)
  > 

- **Q: Anything about the audience or environment that should raise contrast above the
  baseline?** (e.g. older or low-vision users, outdoor/sunlight or vehicle use, clinical or
  safety-critical screens → target 7:1 body text or AA plus headroom; long-form reading
  app → also cap harsh extremes for comfort) — leave blank to use the tiered AA defaults.
  > 

- **Q: Any assistive-tech or audit requirements?** (e.g. must pass a specific client audit,
  screen-reader tested, keyboard-only walkthrough)
  > 

- **Q: Legal/consent obligations the UI must satisfy?** (e.g. GDPR/CCPA cookie consent with
  symmetric accept/reject, jurisdiction-specific disclosures, subscription cancellation
  parity, features reaching minors) — the skill enforces UI-level consent rules (§8b of its
  guidelines) by default; note anything stricter or jurisdiction-specific here.
  > 

## 7. Content, language & brand

- **Q: Languages / localization?** (single language, multi-language, right-to-left support?)
  > 

- **Q: Tone and voice for UI copy?** (formal, friendly, terse)
  > 

- **Q: Brand constraints beyond tokens?** (logo usage, imagery style, do's and don'ts)
  > 

- **Q: Named visual style direction?** (default is modern-quiet: soft hairline borders,
  structure from spacing/surfaces. Name it here if this project follows a bold aesthetic —
  Neobrutalism, Pop-Art/Comic, Cyberpunk, Sci-Fi/HUD, Retro, Memphis, … — so heavy borders
  and hard shadows are treated as the style working, not as defects.)
  > 

## 8. Project-specific UX rules  *(enforced like the global rules)*

> Rules unique to THIS client that the skill must treat as hard constraints. These live
> here (not in the shared skill) because they differ per project. Examples — replace them:

- Primary CTA always uses the `brand-accent` token; secondary actions use `neutral`.
- Every data table has a visible empty-state and loading skeleton.
- Currency is always shown with the client's locale formatting.
- No modals for destructive actions — use an inline confirm row.

  > **Your rules:**
  > 

## 9. Constraints & non-functional needs

- **Q: Performance, SEO, or bundle-size constraints that affect UI choices?**
  > 

- **Q: Anything else the skill should know before generating UI for this project?**
  > 

## 10. Open questions & assumptions

- **Q: What's still undecided?** (list open questions so they're visible, not silently
  guessed)
  > 

- **Q: Assumptions we're proceeding on until told otherwise?**
  > 
