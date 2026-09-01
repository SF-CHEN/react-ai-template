# Do Not Define Components Inside Components

Nested component declarations create a new component identity on every parent render and can reset child state. Define components at module scope unless a render callback API explicitly requires otherwise.
