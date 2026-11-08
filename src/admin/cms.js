// Editor additions for Decap CMS: the Focus field and the entry preview.
//
// Decap exposes CMS, h (React.createElement) and createClass as globals.
// Everything here is drawn with the design system's ds- classes and tokens;
// cms.css only places the pieces.

/* global CMS, h, createClass */

(function () {
  "use strict";

  // ImageFrame: an image keeps its proportions between 2:1 (wide) and 4:5
  // (tall). Beyond that the frame stops at the limit and the image is cropped
  // with object-fit: cover around --focus. The ratios do not depend on the
  // width, so the crop on the board (one column) and on the article plate
  // (two columns) is the same.
  const FRAME_WIDE = 1 / 2; // height / width
  const FRAME_TALL = 5 / 4;

  // Which axis is cropped and what fraction of it stays in view.
  function frameCrop(width, height) {
    if (!width || !height) return null;
    const ratio = height / width;
    if (ratio < FRAME_WIDE) return { axis: "x", visible: ratio / FRAME_WIDE };
    if (ratio > FRAME_TALL) return { axis: "y", visible: FRAME_TALL / ratio };
    return null;
  }

  function clamp(n, lo, hi) {
    return Math.min(hi, Math.max(lo, n));
  }

  // "30% 60%" -> [30, 60]; anything else is the centre.
  function parseFocus(value) {
    const m = String(value || "").match(/^\s*(-?[\d.]+)%\s+(-?[\d.]+)%\s*$/);
    return m ? [clamp(Number(m[1]), 0, 100), clamp(Number(m[2]), 0, 100)] : [50, 50];
  }

  // "2 November 2026", as the site writes it (eleventy.config.js).
  function englishDate(value) {
    if (!value) return "";
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  }

  // Snippets may hold Markdown links; render them as links, the rest as text.
  function inlineMarkdown(text) {
    const parts = [];
    const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
    let last = 0;
    let m;
    let i = 0;
    text = String(text || "");
    while ((m = re.exec(text))) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      const safe = /^(https?:|mailto:|\/|#)/i.test(m[2]) ? m[2] : "#";
      parts.push(h("a", { key: i++, href: safe }, m[1]));
      last = re.lastIndex;
    }
    parts.push(text.slice(last));
    return parts;
  }

  function fieldNamed(collection, name) {
    return collection && collection.get("fields").find((f) => f.get("name") === name);
  }

  // The URL of a file stored in the entry's folder, or "" while it loads.
  function assetUrl(getAsset, collection, path, fieldName) {
    if (!path) return "";
    if (/^[a-z]+:/i.test(path)) return path;
    const asset = getAsset(path, fieldNamed(collection, fieldName));
    if (!asset || asset.path === "empty.svg") return "";
    return String(asset);
  }

  // ---------------------------------------------------------------------------
  // Focus field: the image at the box width as it shows on the board, and the
  // whole image with the visible area outlined. Selecting a point on the whole
  // image, or the arrow keys, moves the focus along the cropped axis.

  const FocusControl = createClass({
    getInitialState: function () {
      return { path: "", src: "", width: 0, height: 0 };
    },

    componentDidMount: function () {
      this.sync();
      // The control is not re-rendered when another field changes, so follow
      // the image field from the current draft.
      this.timer = setInterval(this.sync, 400);
    },

    componentWillUnmount: function () {
      clearInterval(this.timer);
    },

    sync: function () {
      const entry = this.props.getEntry ? this.props.getEntry() : this.props.entry;
      const path = (entry && entry.getIn(["data", "image"])) || "";
      const src = assetUrl(this.props.getAsset, this.props.collection, path, "image");
      // A focus left from a removed image would crop the PDF's first page on
      // the article plate, which otherwise shows the top of the page.
      if (this.state.path && !path && this.props.value) this.props.onChange("");
      if (path !== this.state.path || src !== this.state.src) {
        this.setState({ path: path, src: src, width: 0, height: 0 });
      }
    },

    measure: function (e) {
      this.setState({ width: e.target.naturalWidth, height: e.target.naturalHeight });
    },

    crop: function () {
      return frameCrop(this.state.width, this.state.height);
    },

    // Position along the cropped axis, 0 to 100.
    position: function () {
      const crop = this.crop();
      const f = parseFocus(this.props.value);
      return crop && crop.axis === "x" ? f[0] : f[1];
    },

    setPosition: function (p) {
      const crop = this.crop();
      if (!crop) return;
      p = Math.round(clamp(p, 0, 100));
      this.props.onChange(crop.axis === "x" ? p + "% 50%" : "50% " + p + "%");
    },

    // Centre the visible area on the selected point, as far as it can go.
    pick: function (e) {
      const crop = this.crop();
      if (!crop) return;
      const r = e.currentTarget.getBoundingClientRect();
      const at = crop.axis === "x" ? (e.clientX - r.left) / r.width : (e.clientY - r.top) / r.height;
      const slack = 1 - crop.visible;
      if (slack <= 0) return;
      const start = clamp(at - crop.visible / 2, 0, slack);
      this.setPosition((start / slack) * 100);
    },

    onPointerDown: function (e) {
      if (!this.crop()) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      this.dragging = true;
      this.pick(e);
    },

    onPointerMove: function (e) {
      if (this.dragging) this.pick(e);
    },

    onPointerUp: function () {
      this.dragging = false;
    },

    onKeyDown: function (e) {
      if (!this.crop()) return;
      const step = e.shiftKey ? 10 : 1;
      const p = this.position();
      const moves = {
        ArrowLeft: p - step,
        ArrowUp: p - step,
        ArrowRight: p + step,
        ArrowDown: p + step,
        Home: 0,
        End: 100,
      };
      if (!(e.key in moves)) return;
      e.preventDefault();
      this.setPosition(moves[e.key]);
    },

    centre: function () {
      this.props.onChange("");
    },

    status: function (crop) {
      if (!this.state.path) return "Add an image to see how it is framed on the board.";
      if (!this.state.src || !this.state.width) return "Loading the image.";
      if (!crop) {
        return "The whole image is shown, so the focus point is not used. It is needed only for images wider than 2:1 or taller than 4:5.";
      }
      const what = crop.axis === "x" ? "wider than 2:1, so its sides are" : "taller than 4:5, so its top and bottom are";
      return (
        "The image is " + what + " cropped. Select a point on the whole image, or use the arrow keys, " +
        "to choose what stays in view. The article page uses the same crop."
      );
    },

    render: function () {
      const crop = this.crop();
      const value = this.props.value || "";
      const children = [h("p", { key: "status", className: "cms-focus__status" }, this.status(crop))];

      if (this.state.src) {
        const p = this.position();
        const area = { left: "0", top: "0", width: "100%", height: "100%" };
        if (crop) {
          const start = (1 - crop.visible) * p + "%";
          const size = crop.visible * 100 + "%";
          if (crop.axis === "x") Object.assign(area, { left: start, width: size });
          else Object.assign(area, { top: start, height: size });
        }

        children.push(
          h(
            "div",
            { key: "views", className: "cms-focus__views" },
            h(
              "div",
              { className: "cms-focus__view" },
              h("p", null, "On the board"),
              h(
                "div",
                { className: "ds-box cms-focus__box" },
                h("img", { className: "ds-frame", src: this.state.src, alt: "", style: { "--focus": value || "50% 50%" } })
              )
            ),
            h(
              "div",
              { className: "cms-focus__view" },
              h("p", null, crop ? "The whole image, with the part in view outlined" : "The whole image"),
              h(
                "div",
                { className: "ds-box cms-focus__box" },
                h(
                  "div",
                  {
                    id: this.props.forID,
                    className: "cms-focus__picker" + (crop ? " cms-focus__picker--active" : ""),
                    role: crop ? "slider" : undefined,
                    tabIndex: crop ? 0 : undefined,
                    "aria-label": crop ? (crop.axis === "x" ? "Focus, left to right" : "Focus, top to bottom") : undefined,
                    "aria-valuemin": crop ? 0 : undefined,
                    "aria-valuemax": crop ? 100 : undefined,
                    "aria-valuenow": crop ? p : undefined,
                    "aria-valuetext": crop ? p + "%" : undefined,
                    onPointerDown: this.onPointerDown,
                    onPointerMove: this.onPointerMove,
                    onPointerUp: this.onPointerUp,
                    onPointerCancel: this.onPointerUp,
                    onKeyDown: this.onKeyDown,
                    onFocus: this.props.setActiveStyle,
                    onBlur: this.props.setInactiveStyle,
                  },
                  h("img", { src: this.state.src, alt: "", draggable: false, onLoad: this.measure }),
                  crop ? h("div", { className: "cms-focus__area", style: area }) : null
                )
              )
            )
          )
        );

        if (crop) {
          children.push(
            h(
              "p",
              { key: "actions" },
              h("span", { className: "cms-focus__value" }, value ? "Focus: " + value : "Focus: the centre"),
              " ",
              h("button", { type: "button", className: "ds-button", onClick: this.centre, disabled: !value }, "Centre the focus")
            )
          );
        }
      }

      return h("div", { className: "ds-page cms-focus " + (this.props.classNameWrapper || "") }, children);
    },
  });

  const FocusPreview = createClass({
    render: function () {
      return h("p", null, this.props.value || "");
    },
  });

  CMS.registerWidget("frame-focus", FocusControl, FocusPreview);

  // ---------------------------------------------------------------------------
  // Entry preview: the card on the board, the row on the section's index, and
  // the article page, built from the same ds- markup as the site's templates
  // (src/_includes/box.njk, src/section-index.njk, layouts/article.njk).

  const EntryPreview = createClass({
    render: function () {
      const p = this.props;
      const d = (k) => p.entry.getIn(["data", k]);
      const sectionTitle = p.collection.get("label");
      const title = d("title") || "Untitled";
      const dateText = d("period") || englishDate(d("date"));
      const image = assetUrl(p.getAsset, p.collection, d("image"), "image");
      const focus = d("focus");
      const pdfRef = d("pdf");
      const pdf = assetUrl(p.getAsset, p.collection, pdfRef, "pdf");
      const snippet = inlineMarkdown(d("snippet"));
      const sectionLink = h("a", { href: "#" }, sectionTitle);
      const titleLink = h("a", { href: "#" }, title);

      const card = h(
        "div",
        { className: "ds-box cms-preview__box" },
        h("span", { className: "ds-box__section" }, sectionLink),
        h("h3", { className: "ds-entry__title" }, titleLink),
        image ? h("img", { className: "ds-frame", src: image, alt: title, style: focus ? { "--focus": focus } : null }) : null,
        h("p", null, snippet),
        dateText ? h("p", { className: "ds-entry__date" }, dateText) : null
      );

      const row = h(
        "section",
        { className: "ds-sectionindex" },
        h("span", { className: "ds-box__section" }, sectionLink),
        h(
          "ul",
          { className: "ds-sectionindex__list" },
          h(
            "li",
            { className: "ds-sectionindex__item" },
            h("h3", { className: "ds-entry__title" }, titleLink),
            h("p", null, snippet),
            dateText ? h("p", { className: "ds-entry__date" }, dateText) : null
          )
        )
      );

      let plate = null;
      if (image) {
        plate = h(
          "figure",
          { className: "ds-figure ds-figure--bleed" },
          h("img", { className: "ds-frame", src: image, alt: title, style: { "--focus": focus || "50% 50%" } }),
          h("figcaption", { className: "ds-figure__caption" }, h("span", { className: "ds-figure__label" }, "Figure 1:"), title)
        );
      } else if (pdfRef && !/^[a-z]+:/i.test(pdfRef)) {
        plate = h("p", null, "Page 1 of the PDF is shown here after the next build.");
      }

      const article = h(
        "article",
        { className: "ds-article" },
        h(
          "header",
          { className: "ds-header" },
          h("span", { className: "ds-header__section" }, sectionLink),
          h("h1", { className: "ds-title" }, title),
          dateText ? h("p", { className: "ds-byline" }, dateText) : null
        ),
        p.widgetFor("body"),
        plate,
        pdfRef ? h("p", null, h("a", { className: "ds-button ds-button--primary", href: pdf || "#" }, "Open the PDF")) : null
      );

      return h(
        "div",
        { className: "ds-page" },
        h(
          "div",
          { className: "ds-shell ds-shell--article cms-preview" },
          h("p", null, "On the board"),
          card,
          h("p", null, "On the section's index"),
          h("div", { className: "ds-board" }, row),
          h("p", null, "The article page"),
          h("div", { className: "ds-board" }, article)
        )
      );
    },
  });

  CMS.registerPreviewStyle("/design-system/css/tokens.css");
  CMS.registerPreviewStyle("/design-system/css/bundle.css");
  CMS.registerPreviewStyle("/admin/cms.css");

  // One preview per collection; the collections come from the generated config.
  fetch("/admin/config.yml")
    .then((r) => r.json())
    .then((config) => {
      for (const c of config.collections) CMS.registerPreviewTemplate(c.name, EntryPreview);
    })
    .catch((err) => console.warn("[cms] Could not register the entry preview:", err));
})();
