# The Capability Matrix

One table, built from the API surface, that says of every operation the product can perform: where a user
reaches it, what they press, what that runs, and whether any of it was observed.

## Why it starts at the API

"Is the CRUD complete?" cannot be answered without first knowing what complete would mean, and a list
assembled by looking at the UI can only contain what the UI already has. **What the API exposes is the
contract of what the product can do**, it is machine-readable, and it was written by someone who intended
each operation to be used.

A gap then stops depending on somebody noticing an absence: it becomes a difference — an operation with a
client built for it and no call site. On a first run against a mature app this routinely surfaces
requirements that were implemented on both sides and never wired to a screen.

## Columns

| Column | Content |
| --- | --- |
| Operation | The identifier in the API surface |
| Source | Where it was found — schema, spec, or route file |
| Entity | What it acts on |
| Verb | `create` / `read` / `list` / `update` / `delete` / `restore` / `execute` |
| Reached from | The screen and the path through the UI that gets there |
| Affordance → handler | What the user presses, and what that call reaches |
| Verification | The label from the report format |
| Note | Or the exclusion's reason |

## `execute` is not CRUD

Reindexing, retrying a job, regenerating a derivative: these act on nothing the user can point at, and they
carry a requirement CRUD does not. **An `execute` operation must be able to say three things** — it was
accepted, it finished, it failed. A screen that can only say "accepted" leaves a job that failed looking
exactly like one still running, and a user waiting on a result that is never coming.

## What "complete" means

Not every entity needs every verb. These rules are what make the judgment defensible rather than arbitrary.

| Rule | Because |
| --- | --- |
| What can be created can be read back | Otherwise the user cannot confirm their own work |
| What can be updated can be read back | An edit whose result is invisible cannot be checked |
| What can be deleted either has a restore, or a confirmation that names the consequence in counts | A destructive action with neither is a trap |
| A list is paginated and has an empty state | An unbounded list breaks at scale; a blank one reads as a fault |
| An `execute` reports accepted, finished, and failed | See above |
| Every verb reachable by a role is reachable *only* by that role | A boundary guarded on one side is not guarded |

## Reachability is a path, not a presence

An operation is reached when a user starting from a signed-in screen can get to it. All of these are
unreachable even though the code is present and correct:

- The affordance renders but nothing listens to it.
- The screen exists but nothing navigates there.
- The screen requires a role, and no user can obtain that role through the UI.
- The affordance appears only inside a container that never opens.

Record the path, not just the screen. "Reachable from the editor" hides that the only way in is a button
behind a dialog that no longer opens.

## Filling it in

1. Enumerate operations mechanically. Prefer the script; where it cannot run, read the client directory or
   the schema and mark the rows Inferred.
2. Classify each: reached, unreached, or excluded with a reason from the declaration.
3. For rows claiming `Verified`, name what was observed and where — a live pass step, not a reading of the
   code.
4. Apply the completeness rules per entity and add a finding for each rule broken.

The finished matrix goes in the report as an appendix. It is the part a reader returns to, because it is the
only place that says what the app can do next to what a user can get at.
