---
name: hf-css-coding-styles
description: "Conventions for CSS coding style (formatting and notation)."
---

# Frontend: CSS Coding Styles

Conventions for CSS coding style.

## Chop down selectors right after each comma

- In a selector list (comma-separated), break the line right after each `,`, putting **one selector per line**.
- No exceptions — always chop down, even with just two selectors.

```css
/* NG: multiple selectors on one line */
.a, .b, .c {
  color: #cc3300;
}

/* OK: chop down right after each comma */
.a,
.b,
.c {
  color: #cc3300;
}
```

## Put one blank line between selectors (rules)

- Between one selector (rule) and the next, insert exactly **one blank line**.
- Even when the next rule is preceded by a comment, keep the blank line — put it before the comment.

```css
/* NG: no blank line between rules */
.a {
  color: #cc3300;
}
.b {
  color: #cc3300;
}
```

```css
/* OK: one blank line between rules; keep it even when a comment precedes the next rule */
.a {
  color: #cc3300;
}

/* styles for b */
.b {
  color: #cc3300;
}
```
