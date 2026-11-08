Data table in the booktabs style: horizontal rules only, in `ink`, small Arial.

Markup: `<figure class="ds-table-wrap">` holding a `<figcaption>` that starts `<span class="ds-table__label">Table N:</span>`, then `<table class="ds-table">` with a `<thead>` and a `<tbody>`. The wrapper scrolls sideways on narrow screens. Text is `small` (12px) in `ink-body`, headers bold `ink`, numbers right-aligned (`ds-num-cell`) in tabular figures.

Rules: `rule-thick` (2px) above and below, 1px under the header. A header spanning columns: `<th class="ds-cmid" colspan="N"><span>…</span></th>`. `tr.ds-group` starts a group with 1px; `tr.ds-ours` starts the proposed rows with 2px. Mark the best value in a column with `ds-best` (bold `ink`).
