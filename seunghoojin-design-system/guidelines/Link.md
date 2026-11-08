Links and cross-references: black and underlined, red on hover.

Markup: plain `<a>` inside any `ds-page` content is `ink` (#111) with an underline and turns `accent` red on hover. Cross-references take `class="ds-xref"` so they never wrap: "[12]", "Section 3.2", "Table 2", "Figure 4", "Eq. (1)". Add the external-link icon (`.ds-link__ext`, inline SVG drawn with `currentColor`) only for links that leave the site.

Entry titles are the one exception: bold `ink-body`, red and underlined only on hover (see Box). Write link text that names the destination, never "here".
