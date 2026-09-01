# Consider content-visibility for Very Long Content

For large offscreen sections, CSS `content-visibility: auto` can reduce initial rendering work. Do not use it blindly on interactive areas where layout/measurement assumptions matter.
