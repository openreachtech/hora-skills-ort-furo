# Debounce composables

Arrow-const style, return one function, auto-clear timers on unmount:

```js
export const useDebounce = ({
  callback,
  delayMs = 400,
}) => {
  /** @type {import('vue').Ref<ReturnType<typeof setTimeout> | null>} */
  const timeoutIdRef = ref(null)

  const debounce = (...args) => {
    clearTimeout(timeoutIdRef.value)
    timeoutIdRef.value = setTimeout(() => {
      callback(...args)
    }, delayMs)
  }

  onUnmounted(() => {
    clearTimeout(timeoutIdRef.value)
  })

  return debounce
}
```
