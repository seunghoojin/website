Andrew SeungHoo Jin's site looks like a hand-made academic home page, after the home page of Patrick Henry Winston (1943–2019), credited in the footer. The mark and the name sit at the top. Under them, a centred board of narrow outlined boxes: one red section title per box, bold entry titles, short snippets in plain Arial, black underlined links. Snippets are doors: an entry title opens the full article, a section title opens everything in that section.

## Principles

1. A board of snippets. Each section is a box holding its latest entries as a title, maybe an image, a few lines and a date. Nothing is shown in full on the board.
2. Plain and honest. Arial, black underlined links, 1px grey outlines, square corners, almost no padding. No shadows, gradients, pills or decorative icons.
3. One red. `accent` (#B31B1B) names sections, marks links on hover, fills the primary button and draws the focus ring. Links at rest stay black.
4. Dense boards, readable articles. Snippets are 13px; articles step up to 15px on 1.6 for long reading.
5. One level at a time on phones: sections, then a section's entries, then an entry.

## Writing

Write in plain declarative sentences. Section titles are English only (Research, Projects, Writing, Who.I.am, Guide). Entry text may be Korean or English; a full language switch for body text is planned for later. Snippets are the opening of the article, not a summary of it. Dates are written in English ("2 November 2026") and come last in an entry, after its text. Number sections, figures, tables and equations in articles and refer to them by name ("Section 3.2", "Figure 2", "Eq. (1)"). No emoji, no exclamation marks, no middle dots as separators. Messages to the reader, errors included, are calm requests.

## Layout

Every page is a `ds-shell`, centred at the board's width, 38px from the top. First the Masthead, then the board 24px below, then the Footer.

The home board (`ds-board ds-board--home`) holds one `ds-group` per section: the section's titled box and its continuation boxes. Groups flow into balanced columns 295px wide and 7px apart and never split: four columns (`board-4`, 1201px) from 1251px windows, three (`board-3`, 899px) from 949px, two (`board-2`, 597px) from 647px. Inside a box: 2px padding within a 1px `#ccc` border, 13px paragraph margins, and a 1px `#ccc` rule with 13px above and below between groups of content.

An article page (`ds-shell ds-shell--article`, 899px) shows the article as a box two columns wide (597px) with the section's box beside it. A section title opens a SectionIndex: every entry in that section, newest first.

## Responsive

Below 647px the site becomes one column up to 520px wide, with 15px text. The home page shows the open groups (`ds-group--open`: Who.I.am and Guide) first and in full, then every other section as its red title alone, a 44px row that opens the section's SectionIndex. There the reader sees entry titles and dates only, and picks one to read. The article takes the full width with 16px text; the red section label at its top leads back to the section.

## Images

Images keep their own proportions between `frame-wide` (2:1) and `frame-tall` (4:5); beyond that range the frame stops at the limit and the image is cropped around a focus point the author can move (see ImageFrame). One image per entry at most, full box width. In articles, figures have a small centred caption ("Figure 1: …"); a Plate fills the article box edge to edge and opens full size. Images show the work itself, never decoration.

## Color

One light theme. Pages and boxes are `paper` (white). Text is `ink-body` (#454545), including entry titles and dates. Links are `ink` (#111), underlined, turning `accent` red on hover. The footer is `ink-muted` (#767676). Box outlines and rules are `rule` (#ccc). Section titles are `accent` (#B31B1B, 6.5:1). Code and inputs use `paper-sunk`. Errors are shown by weight, not colour: a 2px `ink` border and an `ink` message.

## Typography

Everything is Arial (`sans`). Hangul falls through Arial to Pretendard, whose proportions sit close to Arial's, so mixed lines stay even. Code is Courier New with Nanum Gothic Coding for Korean (`mono`); math is STIX Two Math (`math`), shipped in `fonts/`.

Page styles: `masthead` (30px bold), `masthead-sub` (13px), `section-title` (24.4px red), `entry-title` (16px bold), `snippet` (13px on 1.45), `footer` (12px). Article styles: `article-title` (22px bold), `article-section` (18px bold), `article-subsection` (16px bold), `body` (15px on 1.6), `small` (13px: captions, tables, references), `footnote` (12px). Use only these.

## Rules and boxes

Every box, including articles and section indexes, is a 1px `rule` outline with square corners. Inside a box, `ds-rule` separates groups. Tables use booktabs rules in `ink`. A footnote list starts with a short grey rule; Pagination sits under a 1px `rule`.

## States and focus

Links turn red on hover; entry titles also gain an underline. Nothing moves or grows. Keyboard focus is a solid 2px `accent` outline on every interactive element. Disabled controls use `ink-muted` text and `rule` borders.

## Mark

The supplied mark appears once, in the Masthead beside the name, at 52px (44px on phones), drawn inline with `fill: currentColor`. Never redraw, outline or recolour it; `assets/Logos/mark.svg` is the original file. The name is written "Andrew SeungHoo Jin", with the capital H, in Arial bold; the subtitle is "Architecture and Artificial Intelligence, Seoul National University".

## Components and scripts

Components are plain HTML with classes from `components/bundle.css`, prefixed `ds-`. Load the tokens and that stylesheet, put `ds-page` on `<body>` and `ds-shell` on the page wrapper. `scripts/ds.js` marks the section in view in an article's contents and opens Plates full size; load it at the end of `<body>`. Each component's guidelines list its classes and what the page must supply.
