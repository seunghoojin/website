# Design system

This site uses the "Andrew SeungHoo Jin" design system in `design-system/`.

- Before building or changing any page, read `design-system/README.md`, then the guideline for each component you use in `design-system/guidelines/`.
- Load `design-system/css/tokens.css` and then `design-system/css/bundle.css` on every page. Put `class="ds-page"` on `<body>` and wrap the page in `<div class="ds-shell">` (add `ds-shell--article` on article and section pages). Load `design-system/js/ds.js` at the end of `<body>`.
- Build pages only from the `ds-` classes and the tokens. Do not add new colours, font sizes, shadows, rounded corners or spacing values; if something is missing, stop and ask.
- `design-system/examples/*.html` show the exact markup for each component. Copy their structure.
- Page structure: home = Masthead, `ds-board ds-board--home` of `ds-group`s, Footer. Section title opens a SectionIndex page; entry title opens an Article page.
- Mark continuation boxes `ds-box--cont` and the boxes that stay open on phones `ds-group--open`.
- Images use `class="ds-frame"`; set `--focus` per image when it is cropped.
- Section titles are English only. Dates are written in English ("2 November 2026") and come last in an entry.
- The footer keeps its three lines, including the credit to Patrick Henry Winston's home page.
