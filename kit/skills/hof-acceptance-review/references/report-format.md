# Report Format

One file per run, at `<project-root>/docs/reports/acceptance-<date>-<scope>.md`.

The severity scale and verification labels match the interface-audit convention deliberately, so a reader can
read both reports as one and a finding can be moved between them without translation.

## Severity

| Level | Meaning |
| --- | --- |
| Blocker | A user cannot complete a core flow, or completes it and loses work. Ship-stopping |
| Major | A capability is unreachable, or a failure is silent. The product is usable but a documented requirement is not met |
| Minor | Friction, an unclear message, a missing empty state where the region is rarely empty |
| Note | Worth knowing; no action required now |

## Verification labels

Every finding carries exactly one.

| Label | Means |
| --- | --- |
| Verified | Observed running. Say where — which step, which screen, which provocation |
| Static | Read from code with certainty, no execution involved |
| Inferred | Professional judgment, or a mechanical check that could not run here and was done by reading |
| Unverifiable | Cannot be settled with what this environment provides. Belongs in "couldn't verify", not in the findings |

## Skeleton

```markdown
# Acceptance Review — <app> — <date>

## What this review could prove
Mode: scoped | full — and what the scope was.
Stack: what was detected.
Live pass: ran | not run, and why.
Scenario source: a maintained specification (which one, which version) | derived from the declaration's core
flows. If specified: how many scenarios ran, and which did not.
Roles exercised: which, and which not.
Checks that could not run here: which, and what was read instead.

## Gates
| Gate | Result |
|---|---|
| 0 Capability stated | pass / fail |
| 1 Declaration present | pass / fail |
| 2 Every operation classified | pass / fail |
| 3 Static sweep clean | pass / fail |
| 4 Every screen mounted, flows completed, console silent | pass / fail / not run |

A failed gate is reported as a failed gate. Do not summarise a run with a failed gate as a pass.

## Findings
Ranked, most severe first. Each one:

### <n>. <one sentence saying what is wrong>
- **Severity** / **Verification**
- **Where**: file and line, or screen and step
- **What a user experiences**: in their words, not the code's
- **Why it happens**: one or two sentences
- **What would fix it**: the direction, not the patch

## Couldn't verify
What was not settled, and what it would take. This section being non-empty is normal.

## Capability matrix
The full table as an appendix.
```

## Writing the findings

- **Lead with the user's experience.** "Uploading appears to do nothing" before "the envelope is not
  unwrapped". The second sentence is for whoever fixes it; the first is what makes them believe it matters.
- **One finding per defect**, even when several share a cause. A shared cause goes in each entry's "why".
- **Do not propose a patch.** State the direction and stop; the person who owns the code chooses.
- **Cite the project's identifiers** where it has them, so a finding can be traced to the requirement it
  breaks. Where it has none, cite files and lines.
- **Name what you did not check** next to what you did, so an absence of findings in an area is never read as
  a pass in that area.

## After the report

Anything accepted rather than fixed goes into the declaration's "Known and accepted" so the next run does not
report it again. Anything excluded on purpose goes into the exclusion table **with its reason** — the checks
read that table, and an entry that stops matching is reported rather than trusted.
