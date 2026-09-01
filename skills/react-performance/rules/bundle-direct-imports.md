# Prefer Analyzable Imports

For large libraries, import from documented subpaths when that materially improves tree-shaking or bundle size. Do not create blanket rules against every barrel file; local application barrels can be fine when they do not hide large dependency graphs.
