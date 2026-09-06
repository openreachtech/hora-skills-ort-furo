# Unit Selectors

## 1. Divide UI into units

Decompose each component/page into logical UI **units**. A unit is a root styling boundary and MUST use the `.unit-` prefix.

### Good

```css
.unit-header {}
.unit-form {}
.unit-modal {}
.unit-card {}
```

### Bad

```css
.header {}          /* no unit root */
.page-header {}     /* context-duplicating prefix instead of unit- */
.app-main {}
```

## 2. Every selector chain starts from a unit

### Good

```css
.unit-card > .title {}
.unit-card > .content {}
```

### Bad

```css
.title {}     /* global, no unit root */
.content {}
```

Never create global descendant selectors without a unit root. Because Vue `scoped` styles already isolate the component, the unit root documents intent rather than providing isolation.

## 3. Use short descendant selectors

Inside a unit, use the shortest meaningful name. The unit already supplies the context, so do not repeat it.

Prefer: `.heading .body .content .text .title .label .value .icon .image .input .list .item .row .col .group .actions .header .footer`

### Good

```css
.unit-modal > .header {}
.unit-modal > .body {}
.unit-modal > .footer {}
```

### Bad

```css
.unit-modal > .modal-header {}   /* context duplicated */
.unit-modal > .modal-body {}
```

## 4. Prefer the child combinator (`>`)

Direct-child selectors document the expected DOM shape and avoid accidental matches. Use descendant selectors only when a direct child is impossible.

### Good

```css
.unit-card > .body > .content {}
```

### Bad

```css
.unit-card .body .content {}
```

## 5. Keep chains short — create new units instead of deep nesting

Aim for 2–4 levels, never exceed ~5. When a section grows deep, promote it into its own unit instead of extending the chain.

### Bad

```css
.unit-page > .body > .content > .section > .card > .header > .title {}
```

### Better

```css
.unit-page > .body {}

.unit-card > .header > .title {}
```

Excessive nesting signals poor component decomposition or a missing unit boundary.

## 6. Example

```html
<div class="unit-header">
  <div class="heading">
    <span class="text">Title</span>
  </div>
  <div class="body">
    <div class="content">
      <span class="text">Description</span>
    </div>
  </div>
</div>
```

```css
.unit-header {}
.unit-header > .heading {}
.unit-header > .heading > .text {}
.unit-header > .body {}
.unit-header > .body > .content {}
.unit-header > .body > .content > .text {}
```
