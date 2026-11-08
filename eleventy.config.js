// Eleventy configuration for seunghoojin.com.
//
// Content model: one folder per entry, src/<section>/<slug>/index.md, with
// the entry's files (a PDF, a cover image) beside it. The folder path is the
// entry's URL, so a file is linked to its card simply by sitting in the same
// folder.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import markdownIt from "markdown-it";

export const INPUT = "src";
export const OUTPUT = "_site";
export const COVER_CACHE = ".cache/pdf-covers";
export const COVER_NAME = "pdf-page-1.png";

const md = markdownIt({ html: true });

// "2 November 2026": always in English, read as a calendar date.
export function englishDate(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function isLocalFile(ref) {
  return Boolean(ref) && !/^[a-z]+:/i.test(ref) && !ref.startsWith("/");
}

// Newest first; entries without a date follow their `order`.
function sortEntries(entries) {
  const time = (e) => (e.data.date ? new Date(e.data.date).getTime() : null);
  return [...entries].sort((a, b) => {
    const ta = time(a);
    const tb = time(b);
    if (ta !== null && tb !== null && ta !== tb) return tb - ta;
    if (ta !== null && tb === null) return -1;
    if (ta === null && tb !== null) return 1;
    return (a.data.order ?? 999) - (b.data.order ?? 999);
  });
}

// Render page 1 of every local PDF to a PNG, once per PDF change. The PNG is
// kept in .cache/ and published next to the article as pdf-page-1.png.
function renderPdfCovers() {
  for (const file of fs.globSync(`${INPUT}/*/*/index.md`)) {
    const head = fs.readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const ref = head?.[1].match(/^pdf:\s*["']?([^"'\r\n]+?)["']?\s*$/m)?.[1];
    if (!isLocalFile(ref)) continue;

    const dir = path.dirname(file);
    const pdf = path.join(dir, ref);
    if (!fs.existsSync(pdf)) {
      console.warn(`[pdf] ${file} names ${ref}, which is not in its folder.`);
      continue;
    }
    const outDir = path.join(COVER_CACHE, path.relative(INPUT, dir));
    const out = path.join(outDir, COVER_NAME);
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(pdf).mtimeMs) continue;

    fs.mkdirSync(outDir, { recursive: true });
    try {
      // 150 dpi is enough for a 597px plate and a full-size view.
      execFileSync("pdftoppm", ["-png", "-singlefile", "-f", "1", "-l", "1", "-r", "150", pdf, out.replace(/\.png$/, "")]);
    } catch (err) {
      console.warn(`[pdf] Could not render page 1 of ${pdf} (is poppler installed?): ${err.message}`);
    }
  }
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy(`${INPUT}/design-system`);
  eleventyConfig.addPassthroughCopy(`${INPUT}/favicon*`);
  // Every file stored next to an entry is served from the entry's URL.
  eleventyConfig.addPassthroughCopy(`${INPUT}/*/*/*.{pdf,jpg,jpeg,png,webp,gif,svg}`);
  eleventyConfig.addPassthroughCopy({ [COVER_CACHE]: "/" });

  eleventyConfig.on("eleventy.before", renderPdfCovers);
  eleventyConfig.addWatchTarget(`${INPUT}/*/*/*.pdf`);

  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addCollection("entries", (api) =>
    sortEntries(api.getFilteredByGlob(`${INPUT}/*/*/index.md`).filter((e) => e.data.section))
  );

  eleventyConfig.addFilter("englishDate", englishDate);
  eleventyConfig.addFilter("inSection", (entries, slug) =>
    (entries || []).filter((e) => e.data.section === slug)
  );
  eleventyConfig.addFilter("sectionBySlug", (sections, slug) =>
    sections.find((s) => s.slug === slug)
  );
  // Pagination inside a section. Dated sections are sorted newest first, so
  // "Previous" is the older entry; undated ones follow `order`, so "Previous"
  // is the entry above.
  eleventyConfig.addFilter("neighbours", (entries, url) => {
    const i = entries.findIndex((e) => e.url === url);
    const above = i > 0 ? entries[i - 1] : null;
    const below = entries[i + 1] ?? null;
    return entries[i]?.data.date ? { prev: below, next: above } : { prev: above, next: below };
  });
  // Markdown on one line (snippets, leads), without a wrapping <p>.
  eleventyConfig.addFilter("mdInline", (text) => md.renderInline(String(text ?? "")));
  // Plain text for <meta name="description">.
  eleventyConfig.addFilter("plain", (text) =>
    String(text ?? "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/<[^>]+>/g, "")
      .trim()
  );
  eleventyConfig.addFilter("megabytes", (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  });

  return {
    dir: { input: INPUT, output: OUTPUT, includes: "_includes", data: "_data" },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
