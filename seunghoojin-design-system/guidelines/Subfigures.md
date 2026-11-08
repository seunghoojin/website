Two or three panels side by side under one caption, each with an (a), (b) label.

Markup: a `ds-figure` holding `<div class="ds-subfigs" style="--cols:2">` with one `<figure class="ds-subfig">` per panel (an image with `ds-frame`, a `<figcaption>` starting `<span class="ds-subfig__label">(a)</span>`), then the figure's `ds-figure__caption`. Panels are 6px apart, aligned at the top, each framed within its own width. Labels are 12px, centred. On phones panels keep their columns; use `--cols:1` to stack them.
