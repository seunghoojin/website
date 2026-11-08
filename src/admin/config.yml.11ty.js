// Decap CMS configuration, served at /admin/config.yml.
//
// It is generated from src/_data/sections.js so that every section of the
// board has a collection in the editor. JSON is valid YAML, so the output is
// written as JSON.
//
// Each entry is a folder, src/<section>/<slug>/index.md, and its media (the
// card image, the PDF) is stored in that same folder, as README.md describes.

import sections from "../_data/sections.js";

// The GitHub OAuth proxy (cms-auth/, a Cloudflare Worker). Set this to the
// Worker's URL once it is deployed; see "Editing in the browser" in README.md.
export const OAUTH_PROXY = "https://seunghoojin-cms-auth.CHANGE-ME.workers.dev";

// Sections that hold text on the board but no entries.
const WITHOUT_ENTRIES = new Set(["guide"]);

function fields(slug) {
  return [
    { label: "Title", name: "title", widget: "string" },
    { label: "Section", name: "section", widget: "hidden", default: slug },
    {
      label: "Date",
      name: "date",
      widget: "datetime",
      required: false,
      format: "YYYY-MM-DD",
      date_format: "YYYY-MM-DD",
      time_format: false,
      picker_utc: true,
      hint: 'Shown as "2 November 2026". Entries with a date are listed newest first.',
    },
    {
      label: "Period",
      name: "period",
      widget: "string",
      required: false,
      hint: 'Optional. Replaces the date, for example "March 2022 – present".',
    },
    {
      label: "Order",
      name: "order",
      widget: "number",
      value_type: "int",
      required: false,
      hint: "Optional. Sorts entries that have no date, from 1.",
    },
    {
      label: "Snippet",
      name: "snippet",
      widget: "text",
      hint: "The opening of the article, shown on the board. Markdown links are allowed.",
    },
    {
      label: "Image",
      name: "image",
      widget: "image",
      required: false,
      hint: "Optional. The card image, stored in the entry's folder.",
    },
    {
      label: "Focus",
      name: "focus",
      widget: "frame-focus",
      required: false,
      hint: "The point the image is cropped around when it is wider than 2:1 or taller than 4:5.",
    },
    {
      label: "PDF",
      name: "pdf",
      widget: "file",
      required: false,
      hint: "Optional. The full article. Page 1 is shown on the article page after the next build.",
    },
    { label: "Body", name: "body", widget: "markdown" },
  ];
}

function collection(sec) {
  return {
    name: sec.slug,
    label: sec.title,
    label_singular: `${sec.title} entry`,
    folder: `src/${sec.slug}`,
    path: "{{slug}}/index",
    extension: "md",
    format: "frontmatter",
    create: true,
    slug: "{{slug}}",
    identifier_field: "title",
    summary: "{{title}}",
    sortable_fields: ["date", "order", "title"],
    // Media sits beside index.md, so "cover.jpg" in the front matter is the
    // file in the entry's folder.
    media_folder: "",
    public_folder: "",
    fields: fields(sec.slug),
  };
}

export default class {
  data() {
    return { permalink: "/admin/config.yml", eleventyExcludeFromCollections: true };
  }

  render() {
    const config = {
      backend: {
        name: "github",
        repo: "seunghoojin/website",
        branch: "main",
        base_url: OAUTH_PROXY,
        auth_endpoint: "auth",
        auth_scope: "public_repo",
        commit_messages: {
          create: "Add {{collection}} entry {{slug}}",
          update: "Update {{collection}} entry {{slug}}",
          delete: "Delete {{collection}} entry {{slug}}",
          uploadMedia: "Upload {{path}}",
          deleteMedia: "Delete {{path}}",
        },
      },
      // With `npx decap-server` running, the editor on localhost writes to
      // this checkout instead of GitHub. It has no effect on the live site.
      local_backend: true,
      site_url: "https://seunghoojin.com",
      display_url: "https://seunghoojin.com",
      // Files uploaded outside an entry. Entries keep their own media.
      media_folder: "src/media",
      public_folder: "/media",
      slug: { encoding: "ascii", clean_accents: true, sanitize_replacement: "-" },
      collections: sections.filter((s) => !WITHOUT_ENTRIES.has(s.slug)).map(collection),
    };
    return JSON.stringify(config, null, 2) + "\n";
  }
}
