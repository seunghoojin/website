Display equation centred, numbered on the right.

Markup: `<div class="ds-eq" id="eqN">` with `<div class="ds-eq__body">` holding `<math display="block">` and `<div class="ds-eq__no">(N)</div>`. Write MathML (generate it from TeX at build time with Temml or KaTeX's MathML output); it is set in STIX Two Math, shipped in `fonts/`. Refer to it as "Eq. (N)".
