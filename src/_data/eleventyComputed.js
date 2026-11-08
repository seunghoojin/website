// Values derived for every entry from its front matter.
import fs from "node:fs";
import path from "node:path";
import { englishDate, isLocalFile, COVER_CACHE, COVER_NAME, INPUT } from "../../eleventy.config.js";

function entryDir(data) {
  return path.dirname(data.page.inputPath);
}

export default {
  // The date line: a period ("March 2022 – present") or a date ("2 November 2026").
  dateText: (data) => data.period || (data.section && data.date ? englishDate(data.date) : ""),

  // Size of a PDF kept in the entry's folder, for the button label.
  pdfBytes: (data) => {
    if (!isLocalFile(data.pdf)) return 0;
    const file = path.join(entryDir(data), data.pdf);
    return fs.existsSync(file) ? fs.statSync(file).size : 0;
  },

  // The plate on the article page: the entry's own image, else page 1 of its PDF.
  plate: (data) => {
    if (data.image) return data.image;
    if (!isLocalFile(data.pdf)) return "";
    const rel = path.relative(INPUT, entryDir(data));
    return fs.existsSync(path.join(COVER_CACHE, rel, COVER_NAME)) ? COVER_NAME : "";
  },
};
