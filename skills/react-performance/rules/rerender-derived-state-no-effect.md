# Derive State During Render

If a value can be calculated from props/state, do not keep a synchronized copy.

```tsx
// Avoid
const [fullName, setFullName] = useState('')
useEffect(() => setFullName(`${firstName} ${lastName}`), [firstName, lastName])

// Prefer
const fullName = `${firstName} ${lastName}`
```
