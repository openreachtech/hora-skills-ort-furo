# The Project Declaration

`<project-root>/ai/contexts/acceptance-context.md` holds the facts a review cannot derive from code: what
the core flows are, who the users are, how to start the app, and which capabilities are deliberately absent.

It exists so the skill stays portable. Nothing project-specific belongs in the skill itself, and nothing
here should be guessed — an invented core flow produces a review of an app nobody asked for.

Fill everything discoverable from the codebase. Mark the rest `TBD`, and say in the report which `TBD`
entries limited the review.

## Schema

The skill ships the file as `templates/acceptance-context.md`. Copy it into place and fill it.

## Rules

- **A reason is mandatory on every exclusion.** The unreached-operation check reads this table, and it
  reports an exclusion that no longer matches anything: an exception that has quietly stopped applying reads
  as a reviewed decision while permitting the gap it was written to allow.
- **Credentials are per role.** A review that can only sign in as one role cannot check a permission
  boundary, and must record that as unverified rather than passing it.
- **The dependency list must say how to tell whether each one is up.** "The API is running" is not
  checkable; "answers on port 8001" is. A review that mistakes a stopped dependency for a broken screen
  wastes its findings.
- If the project keeps requirement or screen identifiers, name that scheme under Purpose and cite the
  identifiers in findings. Where there is no such scheme, cite files and lines instead.
