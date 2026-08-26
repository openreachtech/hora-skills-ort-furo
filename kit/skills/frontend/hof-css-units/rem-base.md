# rem-Based Convention

Make rem the base unit of CSS and limit values to steps that humans can grasp intuitively.

## The base unit is rem (not px)

Decide CSS dimensions in rem. Do not build layout, spacing, or font sizes on a px basis.

- `1rem` is "a relative value that treats the root element's font size (i.e. the height of a character) as 1." It is not a unit of physical size.
- `1px`, by contrast, is a relative value based on a physical pixel.
- "`1rem = 16px`" is not an identity. It is merely a conversion that happens to hold when the root element's font size is the default 16px. 16px is the baseline default, not the meaning of rem itself. Many frontend engineers get this wrong and believe `1rem = 16px` is a fixed identity.
- Therefore the actual px that `1rem` resolves to changes with the user's font-size setting. For the same `1rem`, the corresponding number of px goes up or down depending on the setting.
  - Sharp-eyed younger users often choose a "small" font size because they want to display more information on screen.
  - Conversely, devices tuned for older users may default to a font size equivalent to "large" on an ordinary device.
- This is not limited to phones. The same thing happens on PCs via the browser's default font-size setting.

### Why rem (accessibility)

- CSS that fixes dimensions in px nullifies the user's font-size setting and forces the same default font size on
  everyone. This is a plain accessibility violation: it strips users of the right to adjust text to their own eyesight
  and environment.
- It is the habit of print design — where relative values never change — carried over to the web by people who do not know how web design works. It is a contemptible practice born of a lack of skill as a web designer, and we refuse to follow it.
- The "rem vs px" debate is noisy, but the conclusion is plainly a victory for rem. With accessibility as the judge, a
  px basis is a thing that only holds up by presupposing pinch-zoom and trampling usability; there is no justification
  for adopting it.
- With rem as the base, the whole design scales along with the font size the user has chosen.
- Specify padding / margin in rem as well. If a `<button>`'s padding is fixed in px, the padding becomes relatively cramped when the font size is enlarged and slack when it is reduced — either way the design breaks. With rem, the ratio to the font size is preserved.
- Decide layout spacing and responsive breakpoints in rem as far as possible too. When breakpoints are in rem, the number of characters that fit within a width stays roughly constant.

## Responses to px-based defenses

Typical arguments used to justify a px basis, and their rebuttals, are collected in [references/objections.md](./references/objections.md). Use this as material when responding to objections from users of the skill. None of those arguments supports making px the base unit of the design scale.

## Round values to 12 steps

Limit the values used for rem to the following 12 steps. The table shows the range 0–1, but values of 1 and above use the same granularity.

| Kind | Values |
| --- | --- |
| One decimal place (10 steps) | `0.0` `0.1` `0.2` `0.3` `0.4` `0.5` `0.6` `0.7` `0.8` `0.9` |
| One quarter / three quarters (2 steps) | `0.25` `0.75` |

- In effect the rule is: "round to one decimal place, but `0.25` / `0.75` (and `1.25`, `1.75`, … quarter steps) are allowed as exceptions."
- Examples: `0.4rem`, `0.75rem`, `1.5rem`, `2rem`, `1.25rem` are fine. `1.35rem` is not.
- Do not use values carried out to four decimal places such as `0.0625rem`. There are two reasons.
  1. It is a number that merely shows off the mistaken premise that "since `1rem = 16px`, `1px = 1/16rem`." Since
     `1rem` does not mean 16px, that conversion is meaningless.
  2. A difference on the order of 0.0005rem — the least significant digit of 0.0625rem — cannot be distinguished by the human eye, and on any screen it falls below the dip resolution and does not even appear on the display. Fine precision has no meaning.

### Why one quarter / three quarters are allowed as exceptions

- The criterion for the 12 steps is, consistently, "is this a step a human can grasp at a glance?" `0.25` (1/4) and `0.75` (3/4) can be **located at a glance** as one of four equal divisions. This cognitive graspability is the sole grounds for allowing them as exceptions.
- Thirds (1/3, 2/3) cannot be estimated the same way. Humans easily estimate "half," and the nesting of halves ("half of a half" = 1/4), but thirds do not fit intuition.
- This cognitive difference has left a trace in language, too: baseball's pitching delivery has the established term "three-quarter" (3/4), while a term like "two-third" (2/3) has taken hold in no field. But this is offered not as grounds — only as **corroborating evidence** for the cognitive difference above. We do not allow it "because the term is established." We allow it "because it is easy to grasp, and that ease also shows up in the established term."
- A purist might argue, "kick out the quarter steps too and write `calc(1rem / 4 * 3)`." But the purpose of the 12 steps is legibility, and excluding `0.25` / `0.75` — which are graspable at a glance — runs against that very purpose. Steps that are easy to grasp should be used actively.

### Why only one decimal place

- To put readability (legibility) of the written CSS first. Rounding to one decimal place keeps the rounding error to at most 0.05rem (half of one step). It is not worth adding digits, and harming legibility, for a difference that small.
- Since `1rem` does not mean 16px, the step could just as well be 10 or 8. A step of 8 brings out `0.125` (three decimal places), which is about as hard to read as a step of 16. A step of 10 with one decimal place keeps the most human-friendly system.

### When you need a value the 12 steps cannot express

- Values the 12 steps cannot land on — a fraction such as 1/3, or a type-scale ratio — are expressed by **combining 12-step-legal numbers with `calc()`**. Do not write raw decimals such as `0.3333333rem` or `1.5625rem`. The intent (divide into three / 1.25×) stays readable, and you avoid stretching out digits into spurious precision.
- Compose type-scale steps with a Custom Property, and keep the ratio itself a graspable number (`1.25`, `1.2` are fine; for a perfect fourth, `calc(1rem * 4 / 3)`).

```css
/* NG: writing a repeating fraction or a raw computed value (intent unclear, precision meaningless) */
.col { inline-size: 0.3333333rem; }
h2 { font-size: 1.5625rem; }

/* OK: combine 12-step numbers with calc, keeping the intent (fraction / ratio) */
.col { inline-size: calc(1rem / 3); }

:root {
  --ratio: 1.25;
}

h3 { font-size: calc(1rem * var(--ratio)); }                /* = 1.25rem */
h2 { font-size: calc(1rem * var(--ratio) * var(--ratio)); } /* don't write 1.5625rem raw */
```

## Scope

rem is a unit relative to font size. Therefore, **use rem only for specifications where there is a reason to align to the font size, and whenever you use rem, always use the 12-step rem.**

- **Sizes derived from font size use the 12-step rem.** This covers text-coupled spacing and dimensions (`padding`, `margin`, `gap`, etc. — things that should follow the font size). If you deliberately use rem for something like `box-shadow` because you judge that a font-size basis looks better, use the 12-step rem there too. `font-size` is included as well; a type scale that does not land on the 12 steps expresses its ratio with `calc()`, as in "When you need a value the 12 steps cannot express."
- **Properties for which unitless is correct are out of scope for the 12 steps.** `line-height` should be unitless (e.g. `1.5`), not rem. `z-index`, `opacity`, `flex-grow`, and the like are likewise out of scope.
- **For specifications not derived from font size, other relative units are free to use.** Dimensions based on layout proportion, fluid sizing, the viewport, or the container may use `%`, `fr`, `ch`, `vw`, `vh`, `dvh`, `clamp()`, `min()`, `max()`, `cqi`, and so on. The rule is "do not base things on px," not "use only rem."
- **Example: responsive breakpoints should use rem**, because they affect the number of characters shown across the width (i.e. there is a reason to align to the font size).

```css
/* OK: pick the unit by purpose */
.card {
  /* font-size-derived → 12-step rem */
  padding-inline: 0.75rem;
  gap: 0.5rem;
  font-size: 1rem;

  /* unitless is correct → do not use rem */
  line-height: 1.5;

  /* proportion is not font-derived → other relative units are free */
  inline-size: 100%;
  max-inline-size: 40rem;  /* container width: an appropriate rem per case */

  @media (min-width: 48rem) {
    padding-inline: 1rem;
  }
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;   /* split with fr */
  gap: 1rem;                        /* spacing is font-based → rem */
}
```

```css
/* NG: wrong unit for the job */
.card {
  line-height: 1.5rem;    /* should be unitless */
  gap: 6px;               /* font-based spacing fixed in px → use 0.4rem */
  inline-size: 480px;     /* proportion belongs in % / fr, not fixed px */
}
```

## Handling fixed px values

- As a rule, do not write raw px values directly in the CSS of the actual app.
- If you absolutely must use a fixed px value, name it as a CSS Custom Property before using it, without exception. If you cannot name it (cannot give it a meaningful name), that is proof there was no necessity to use px in the first place.
- The representative example is the hairline (the thinnest width the screen can display; used for things like a rule one physical pixel thick). Define it in one place as `--hairline-width` and reference it everywhere.

```css
/* OK: name a fixed px as a Custom Property, then reference it */
:root {
  --hairline-width: 1px;
}

.divider {
  border-block-end: var(--hairline-width) solid #ccc;
}

/* NG: writing raw px directly in the actual CSS */
.divider {
  border-block-end: 1px solid #ccc;
}
```

## Refactoring existing styles

Replace each value in existing styles that use px or fractional rem with the nearest of the 12 steps.

- Convert an existing px value to an exact rem using `1rem = 16px` — the premise held by whoever wrote it — then round to the nearest of the 12 steps.
- This rounding is uniquely determined. Two adjacent px values that round to the same one of the 12 steps always place their rounding target between the two exact rem values. A px step is `0.0625rem`, which is larger than the half-width `0.05rem` of the rounding, so the two values can never land on the same side of the target — they always straddle it.

```css
/* NG: px values / fractional rem */
.card {
  padding: 12px;        /* = 0.75rem */
  gap: 6px;             /* = 0.375rem → 0.4rem */
  margin-block-end: 0.0625rem;
}

/* OK: converted to the 12 steps */
.card {
  padding: 0.75rem;     /* quarter steps are allowed */
  gap: 0.4rem;
  margin-block-end: 0.1rem;
}
```

### px → rem (12-step) conversion table

Converted to exact rem using `1rem = 16px`, then rounded to the nearest of the 12 steps. Shows the sub-1rem remainder (0–15px).

| px | Exact rem | Adopted 12-step |
| --- | --- | --- |
| 0px | 0rem | `0.0rem` |
| 1px | 0.0625rem | `0.1rem` |
| 2px | 0.125rem | `0.1rem` |
| 3px | 0.1875rem | `0.2rem` |
| 4px | 0.25rem | `0.25rem` |
| 5px | 0.3125rem | `0.3rem` |
| 6px | 0.375rem | `0.4rem` |
| 7px | 0.4375rem | `0.4rem` |
| 8px | 0.5rem | `0.5rem` |
| 9px | 0.5625rem | `0.6rem` |
| 10px | 0.625rem | `0.6rem` |
| 11px | 0.6875rem | `0.7rem` |
| 12px | 0.75rem | `0.75rem` |
| 13px | 0.8125rem | `0.8rem` |
| 14px | 0.875rem | `0.9rem` |
| 15px | 0.9375rem | `0.9rem` |

- 4px (`0.25rem`) and 12px (`0.75rem`) are quarter steps, so adopt them as-is.
- `16px` does not appear in this table. `16px = 1rem` (i.e. 0px of the next cycle); it merely carries one into the integer part.
- For 16px and above, divide by 16, take the quotient as the integer part and look up the remainder (0–15px) in the table above, then add them (e.g. 20px = 16 + 4 → `1.25rem`; 22px = 16 + 6 → quotient 1 + `0.4rem` = `1.4rem`).
