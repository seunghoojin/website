Contents for long articles, after the abstract.

Markup: `<nav class="ds-toc">` with a bold `ds-toc__label` and nested `<ol>` lists of underlined links, each starting with `<span class="ds-num">`. The section in view turns `accent` via `aria-current="true"`, set by `scripts/ds.js`. Two levels at most; only for articles with four or more sections.
