# Report Format

Every audit produces this structure. Keep findings tight and skimmable — a developer
should be able to act on the report top-to-bottom without re-reading it.

## Finding format (used everywhere)

```
[B1] Major · Verified · Interaction
Location: SignupForm.tsx:48 — the "Continue" button
Issue: No loading state; double-click fires two POST requests.
User impact: On a slow connection the user clicks again, creating duplicate
accounts and a confusing error on the second attempt.
Fix: Disable + spinner-in-place on submit (same dimensions), guard the handler.
Effort: S
```

- IDs are stable: B# Blockers, M# Major, m# Minor, P# Polish, E# Expectation gaps.
- Every finding has: severity · verification label · rubric section, a precise location
  (file:line, screenshot region, or URL element), the issue, the **user impact in
  plain language** (this is what makes it a pain point, not a rule citation), a concrete
  fix, and an effort tag (S/M/L).
- Cite the rubric/WCAG rule only where it adds authority (accessibility, legal).

## Report skeleton

```
# UX/UI Audit — <target> (<input type(s)>, <date>)

## Summary
Surface: <product UI | expressive | mixed> · Context file: <found/not found>
Verdict: 2–4 sentences — overall state, the theme behind the biggest issues,
and what's genuinely good.

| Dimension            | Rating              | Findings |
|----------------------|---------------------|----------|
| Accessibility        | Pass / Needs work / Fail | B:1 M:2 |
| Token/design source  | ...                 |          |
| Layout & responsive  | ...                 |          |
| Interaction          | ...                 |          |
| Usability heuristics | ...                 |          |
| Visual craft         | ...                 |          |
| Expectation fit      | ... / Not assessable|          |
| Legal & consent      | ... / Not applicable|          |

## Top priorities
The 3–5 fixes worth doing first (usually Blockers + the Majors with the
widest user impact). One line each, referencing finding IDs.

## Blockers
## Major
## Minor & Polish (patterns summarized, not itemized, when numerous)
## Expectation gaps (vs client context)
## End-user pain points
Per key task, a short narrative walkthrough with pain points tagged
[task → step → pain → severity → linked finding ID].

## What's working
Genuine strengths to preserve (mandatory, honest, specific).

## Couldn't verify from this input
Each item + which artifact would verify it (code, URL, token values,
second viewport, keyboard recording).

## Suggested next step
```

## Rules of the report

- Blockers first, always. Never bury an accessibility failure under spacing nits.
- No invented scores: the per-dimension rating is Pass / Needs work / Fail — resist
  inventing numeric scores that imply false precision.
- "Not assessable" is a valid rating (no context file → Expectation fit not assessable) and
  better than guessing.
- If mechanical checks ran (validate-tokens, contrast-check), include their raw verdict
  lines in the relevant findings — machine evidence beats prose.
- End by offering, not doing: offer to produce fixed code for the Blockers, or to re-audit
  after fixes. Don't rewrite the developer's work unprompted.
