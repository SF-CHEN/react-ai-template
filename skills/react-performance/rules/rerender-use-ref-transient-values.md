# Use Refs for Transient Non-visual Values

For values such as timers, previous pointer positions, or mutable integration handles that should not cause rendering, prefer `useRef` over state.
