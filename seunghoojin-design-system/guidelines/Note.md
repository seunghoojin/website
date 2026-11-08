Labelled blocks for definitions, propositions, remarks and proofs, after LaTeX's amsthm.

Markup: `<div class="ds-note">` with a paragraph starting `<span class="ds-note__label">Definition 1</span>` (optional `<span class="ds-note__name">(Name)</span>` inside the label; the period is added). `ds-note--plain` sets the body in italic (propositions); `ds-note--remark` sets the label in italic. Notes are indented 20px on both sides, no box. A proof is `<p class="ds-proof">` with `<span class="ds-proof__label">Proof.</span>`, ending with `<span class="ds-qed">`.
