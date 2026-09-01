# Avoid Memoizing Trivial Work

Do not wrap cheap primitive calculations or every handler in `useMemo` / `useCallback`. Memoization has its own complexity and bookkeeping cost. Use it for measured expensive work or identity-sensitive APIs.
