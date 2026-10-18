---
name: recreate-project-page
description: Recreate a project's detail page on this portfolio from a saved Squarespace (or other) HTML page the user provides. Use when the user gives an .html page and asks to make a surface-design project page look like it — copying its image order, layout, and text while reusing images already in the repo, without breaking the site.
---

# Recreate a project page from a provided HTML page

The user supplies a saved HTML page (usually from their old Squarespace site) and wants a project's page here to follow its pattern: image order, big images, text sections, "Process & Pitch", etc. The site is plain HTML/CSS/JS, driven by `assets/js/data.js`.

## How this site is wired (read before editing)

- Grid page: `surface-design/index.html` + `assets/js/surface.js` + `assets/css/surface.css`. Built from `siteData.surfaceProjects`.
- Detail page: `surface-detail/index.html` + `assets/js/detail.js` + `assets/css/detail.css`, opened as `surface-detail/?id=<project id>`.
- All content lives in `assets/js/data.js`. A project is an object in `surfaceProjects`. Layout is chosen by which fields exist:
  - Old layout: `images`, `processDescription`, `processImages`, `mockupImages`.
  - Big masonry layout (DrawChange): `gallery: [{ src, w, h }]` (two columns, each image into the shorter one, with lightbox), plus `processTitle`, `processParagraphs[]`, `pitchUrl`, optional `pitchImage`.
- Pages use `<base href="../">`; asset paths in data.js are relative to the repo root.
- `site-header` / `.logo-wrap` are black on every page; the surface-design grid page is white with black header and footer (tokens remapped in `.surface-page`). The detail page is white with black header and footer. Never change header/footer colours.

## Procedure

1. **Read the provided HTML** and extract, in order: title, intro text, each gallery image (filename, dimensions from `data-image-dimensions`), text sections, links (e.g. Figma pitch). Note the order Squarespace shows images — masonry fills the shorter column first.
2. **Find the images already in the repo. Do not download anything from the web page.** The Squarespace filenames (e.g. `ButtonsMockup.png`, `NotebookMockup1.png`) usually match originals under `assets/images/Surface Design/Surface Design/<n> - <Project>/`. Match by filename first. Also check the already-wired folder `assets/images/surface-design/<project>/` (`pattern-*`, `mockup-*`) — these can be a *different* set, so compare visually (build a contact sheet and view it) before deciding which to use.
   - If the user's wired images and the page's images differ, say so and ask which they prefer; the user has said they prefer existing repo images over newly created ones.
   - If an image from the page is not in the repo at all (e.g. a pitch-deck screenshot), do not invent it. Leave the optional field empty and tell the user what to add and where.
3. **Prepare images only if needed.** Originals can be 5–6 MB PNGs. If copies are required, make web-sized JPGs (max 2000px, quality ~84, transparency flattened onto white) in `assets/images/surface-design/<project>/gallery/`, and say clearly that they are resized copies of the user's own files. Prefer pointing at existing files when they already work.
4. **Edit `data.js`** for that project only: replace/add `description` (the intro), `gallery` (in page order, with real `w`/`h`), `processTitle`, `processParagraphs`, `pitchUrl`. Fix obvious typos in copy from the source and mention it.
5. **Only touch shared layout code (detail.js / detail.css / index.html) if the layout genuinely isn't supported yet.** Reuse the existing masonry/pitch/lightbox pieces. Keep other projects rendering exactly as before — new layout must be opt-in via the data fields.
6. **Verify — this is the important part.**
   - Run `python .claude/skills/recreate-project-page/check_data.py` from the repo root. It catches unescaped apostrophes, unbalanced brackets, and missing image paths. (Pre-existing missing `assets/images/hero/*` warnings are known and unrelated.)
   - Node is not installed here, so a JS syntax error in `data.js` cannot be caught by running it. **An unescaped `'` inside a single-quoted string once blanked the entire Surface Design grid.** Write apostrophes as `’` or `\'`, never bare, and escape `&` only if inside HTML (it isn't, text is set via `textContent`).
   - Confirm every `gallery[].src` exists and every `w`/`h` matches the real file.
   - `git diff --stat` and check that only the intended files changed; no other project entries changed.
7. **Report honestly**: which files changed, which images were reused vs. resized copies, what is missing (e.g. pitch screenshot), what you could not visually check (no browser here — say so and tell the user to hard-refresh with Ctrl+F5).

## Pitfalls learned

- Writing Python via a bash heredoc that contains apostrophes or backticks can fail with "unexpected EOF"; write the script to a file with the Write tool (scratchpad dir) and run it instead. Python's `open('/tmp/...')` doesn't map to bash's `/tmp` on Windows.
- Don't use `%` string formatting on text containing `%` (e.g. "18%"); use `.replace` on a placeholder.
- Files may use CRLF; preserve line endings when scripting edits (`newline=''`).
- Match the user's sizing instructions literally (gallery width `80vw`, text column `55rem`, etc.) and keep them consistent between the gallery and the Process & Pitch section. Don't "improve" sizes unprompted; when a change is ambiguous (e.g. "center it"), make the smallest reading and say what you did.
- Cover thumbnails for the grid page (`assets/images/covers/*`) have transparent margins; the grid zooms them (`scale(1.26)`) so artwork fills the card. Don't alter this when editing detail pages.
