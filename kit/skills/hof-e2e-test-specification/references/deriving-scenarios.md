# Deriving the Scenario Inventory

Where scenarios come from, how many there should be, and what makes the set complete. Referenced from Phase 2
of [SKILL.md](../SKILL.md).

**The inventory is produced before any scenario is written.** Writing and deriving at the same time produces
the scenarios that were easy to think of, in whatever order they came to mind, and no way to tell what is
missing. Derive the list, agree it, then write.

## Source 1 — the capability inventory

Start from what the product exposes, because that list was written by someone who intended each operation to
be used, and because it is the only list that can include something everyone else has forgotten.

**Group the operations into flows, then write scenarios per flow — not per operation.** A user does not
"invoke `updateApplication`"; they change their application and check it took. One scenario covers several
operations, and one operation appears in several scenarios. **Coverage is *at least one*, never *exactly
one*.**

Two ways operations cluster into flows, and both are usually present:

- **By the life of an entity** — created, read back, changed, read back, removed, restored. This produces the
  backbone scenarios of the flow.
- **By the journey a person is on** — everything they touch between arriving with a goal and leaving with it
  satisfied. This produces the scenarios that cross entities, which are the ones that find the gaps between
  two teams' work.

### What makes an entity's coverage complete

Each rule forces at least one scenario. They are what make "we have covered this entity" a defensible claim
rather than a feeling:

| Rule | The scenario it forces |
| --- | --- |
| What can be created can be read back | Create it, then find it again from a fresh screen — not from the response of the create |
| What can be updated can be read back | Change it, leave, return, and see the change |
| What can be deleted has a restore, or a confirmation that names the consequence before it happens | Delete and restore; or delete and, before confirming, be told how many other things go with it and which records they are |
| A list is paginated and can say it is empty | Reach the second page; and see the empty list of something the actor legitimately has none of |
| An `execute`-style operation can say accepted, finished, and failed | One scenario for the successful run to completion; the failed one belongs to the failure band |
| A verb reachable by a role is reachable *only* by that role | Belongs to the permission band, below |

An entity that legitimately lacks a verb needs no scenario for it — but it needs a line in the flow file's
exclusion table saying so, because "no scenario" and "no capability" otherwise look the same.

## Source 2 — the provocation catalogue

The failure band comes from [failure-scenarios.md](./failure-scenarios.md). What belongs to the derivation
step is the **selection rule**, because not every possible error deserves a number:

- **Write a scenario for a failure the product promises to survive.** A dependency it retries, an input it
  validates, a conflict it detects.
- **Write a scenario for a failure whose silent version would read as a product bug.** A screen that shows
  nothing after a failed save looks exactly like a broken button, and that confusion is the defect worth
  specifying against.
- **Do not write a scenario for a failure with no user-visible contract.** If the product makes no promise
  about what happens when the machine loses power mid-write, a scenario asserting one is inventing
  requirements.

Every flow gets at least one entry in the failure band. A flow with none has been specified as though its
happy path were the only path.

## Source 3 — the role list

For every role in the declaration, two kinds of scenario:

- **What the role must reach** — that its own area is reachable from where it lands after signing in. One per
  role. This catches the role that technically has permission and no route.
- **What the role must not reach** — per restricted operation, that it is **neither offered nor accepted**.
  Both halves in one scenario: the control is absent from the screen, *and* going straight to the address or
  submitting anyway is refused. Hiding a control is not a guard, and guarding without hiding is an
  invitation.

Where the product has many roles and many restricted operations, the number of combinations is too large to
specify exhaustively. Cover **the boundary that would hurt most if it were open** per role, name that choice
in the index, and let the rest be a documented gap rather than an unstated one.

## Exclusions, and the two places they live

| Kind | Where | Meaning |
| --- | --- | --- |
| This flow will never cover this operation | The flow file's exclusion table | A decision, with its reason |
| No scenario for this yet | The index's coverage-gaps table | An acknowledged debt, with what it is waiting for |

- **A reason is mandatory on an exclusion.** Without one it is an oversight that has been written down, and it
  looks like a reviewed decision while allowing the very gap the coverage check exists to find.
- **Exclusions are checked in both directions.** An exclusion naming an operation that no longer exists is
  reported, not ignored: an exception that has quietly stopped applying is how a real gap hides behind an old
  decision.

## How many scenarios is right

There is no ratio to hit, but there are two shapes that mean the derivation went wrong:

- **One scenario per operation.** The specification has become a list of API calls dressed up as a UI; the
  scenarios will be short, numerous, and none of them will exercise a journey. Merge them into flows.
- **A flow with thirty normal-path scenarios.** It is several flows. Split it before writing, because the
  identifiers are permanent and splitting them again later means a migration recorded in the index.

As a rough shape: a flow holds a handful of normal-path scenarios, at least one failure scenario, and a
permission scenario for each role that the flow distinguishes between.

## When there is no capability inventory

Read the API surface directly — the schema, the specification, or the client directory. It is the same source
the inventory would have been built from.

Say in the index that the derivation was made this way. It matters later: an inventory built from a
hand-scanned surface may have missed an operation, and a coverage report that reads "complete" against an
incomplete list is the strongest false confidence this document can produce.