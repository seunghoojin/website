A section on the board: a 1px `#ccc` box holding a red section title and one or more entries, separated by grey rules where the content changes kind.

Markup: `<div class="ds-box">` with, in order: `<span class="ds-box__section"><a href="section.html">Writing</a></span>` (red, 24.4px, English only; it opens the section's SectionIndex); an optional `<p class="ds-box__lead">` running straight on from the title; entries; and an optional `<p class="ds-box__links">` of plain underlined links, one per line, with `ds-sub` for indented sub-items. A box under another in the same group has no title and takes `ds-box--cont`.

An entry is `<h3 class="ds-entry__title"><a href="article.html">…</a></h3>` (16px bold, `ink-body`, red and underlined on hover), an optional image in a `ds-frame` (see ImageFrame), one or two short paragraphs of snippet, and in dated sections a closing `<p class="ds-entry__date">2 November 2026</p>`. The date always comes last, written out in English.

`<hr class="ds-rule">` (1px `rule`, 13px above and below) separates an introduction from entries, entries of different kinds, and a closing link list. Dated entries in a running list follow one another without rules. Snippets are 13px on 1.45; paragraphs 13px apart; 2px padding inside the border.
