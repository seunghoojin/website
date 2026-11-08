The home page: the Masthead, then the sections as boxes flowing into up to four balanced columns, then the Footer, all centred.

Markup: `<div class="ds-shell">` holding a Masthead, `<div class="ds-board ds-board--home">`, and the Footer. Inside the board, one `<div class="ds-group">` per section, holding the section's titled box and any continuation boxes (`ds-box--cont`) under it. Groups flow top to bottom, then into the next column, and never split, so the columns stay balanced and no column is left with a hole. Groups that should stay open on phones (Who.I.am, Guide) take `ds-group--open`.

Widths: the board is `board-4` (1201px, four 295px columns 7px apart) from 1251px windows, `board-3` (899px) from 949px, `board-2` (597px) from 647px, and one column up to 520px below that. The shell, and with it the masthead and footer, is centred at the board's width, 38px from the top.

On phones the home page is one level at a time: the open groups come first and in full, then every other section as its red title alone, a 44px row with a chevron that opens the section's SectionIndex.
