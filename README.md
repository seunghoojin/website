# seunghoojin.com

The personal website of Andrew SeungHoo Jin: a static site built with
[Eleventy](https://www.11ty.dev/) on the "Andrew SeungHoo Jin" design system.

## Run locally

Requires Node.js 22 or later, and `pdftoppm` (from Poppler) to render PDF
covers (`brew install poppler` on macOS).

```bash
npm install
npm start      # http://localhost:8080, rebuilds on save
npm run build  # writes the site to _site/
```

## Layout

```
src/
  _data/sections.js      Sections of the home board: order, title, lead, links
  _data/site.js          Name, subtitle, footer date
  _includes/             Masthead, footer, section box, page layouts
  index.njk              Home board
  section-index.njk      One SectionIndex page per section
  <section>/<slug>/      One folder per entry (see below)
  design-system/         Copy of seunghoojin-design-system/{css,js,fonts,assets}
seunghoojin-design-system/  The design system originals; do not edit here
```

## Adding an entry

Create a folder under its section and put an `index.md` in it:

```
src/projects/my-project/
  index.md
  article.pdf    optional: the full article
  cover.jpg      optional: the card image
```

```yaml
---
title: "My Project"
section: projects           # must match the folder and a slug in sections.js
date: 2026-11-02            # shown as "2 November 2026"; sorts newest first
period: ""                  # optional, replaces the date: "March 2022 – present"
order: 1                    # optional, sorts entries that have no date
snippet: "The opening of the article, shown on the board. Markdown links allowed."
image: "cover.jpg"          # optional, a file in this folder
focus: "50% 30%"            # optional, the crop point when the image is cropped
pdf: "article.pdf"          # optional, a file in this folder or a full URL
---

The article text, in Markdown.
```

The folder path is the entry's URL (`/projects/my-project/`), and files in the
folder are served from it, so the card, the article page and its PDF are linked
by sitting together. When an entry has a local PDF and no image, page 1 of the
PDF is rendered at build time and shown on the article page with an
"Open the PDF" button.

## Deployment

Pushing to `main` builds the site with GitHub Actions and publishes it to
GitHub Pages (`.github/workflows/deploy.yml`). The footer's "updated" date is
the build date.
