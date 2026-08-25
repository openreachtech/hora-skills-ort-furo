# Naming and consumption

## Naming conventions

- `*Clerk` — a class that manages/operates something. `Clerk` is used broadly across Furo apps (`StorageClerk`, `AccessTokenClerk`, `FormElementClerk`).
- `*Detector` — a classification/lookup helper (`CardBrandDetector`).
- All modules live flat in `app/modules/`.

## Consumption

Instantiate anywhere via `X.create(...)`:

```js
const timerClerk = TimerClerk.create({
  callback,
  timeInMilliseconds: 3000,
})
```
