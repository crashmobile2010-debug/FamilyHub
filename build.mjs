/* ====================================================================
   BUILD — concatenates all CSS and JS (in the exact order below)
   into a single deployable dist/index.html. Zero dependencies.

   Run:      node build.mjs
   Output:   dist/index.html   (the whole app, one file)
             .build/bundle.js  (concatenated JS, for `node --check`)

   ⚠️ ORDER MATTERS in both manifests:
   - CSS: theme.css must come after base.css (it overrides it).
   - JS:  config → core → widgets → boot. boot.js must be LAST.
     Adding a new widget? Insert its file before "src/boot.js".
   ==================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

const CSS_FILES = [
  "src/styles/slick.css",
];

const JS_FILES = [
  "config/config.js",
  "src/core/helpers.js",
  "src/core/state.js",
  "src/core/sync.js",
  "src/widgets/clock.js",
  "src/widgets/weather.js",
  "src/widgets/photos.js",
  "src/widgets/google-auth.js",
  "src/widgets/calendar.js",
  "src/widgets/tasks.js",
  "src/widgets/notes.js",
  "src/widgets/meals.js",
  "src/widgets/music.js",
  "src/widgets/kiosk.js",
  "src/widgets/screensaver.js",
  "src/widgets/settings.js",
  "src/widgets/pager.js",
  "src/widgets/home.js",
  "src/widgets/fun.js",
  "src/boot.js",              // ← must stay last
];

const read = (p) => readFileSync(join(ROOT, p), "utf8");
const banner = (p) => `\n/* ══════ ${p} ══════ */\n`;

const css = CSS_FILES.map((p) => banner(p) + read(p)).join("\n");
const js  = JS_FILES.map((p) => banner(p) + read(p)).join("\n");

// Safety: inline scripts must not contain a closing script tag.
if (/<\/script/i.test(js)) {
  console.error("✗ Build aborted: a JS source file contains '</script', which would break the inline bundle.");
  process.exit(1);
}

const template = read("src/index.html");
for (const token of ["/*__INLINE_CSS__*/", "/*__INLINE_JS__*/"]) {
  if (!template.includes(token)) {
    console.error(`✗ Build aborted: src/index.html is missing the ${token} token.`);
    process.exit(1);
  }
}

const html = template
  .replace("/*__INLINE_CSS__*/", () => css)
  .replace("/*__INLINE_JS__*/", () => js);

mkdirSync(join(ROOT, "dist"), { recursive: true });
mkdirSync(join(ROOT, ".build"), { recursive: true });
writeFileSync(join(ROOT, "dist/index.html"), html);
writeFileSync(join(ROOT, ".build/bundle.js"), js);
writeFileSync(join(ROOT, "dist/.nojekyll"), ""); // GitHub Pages: serve as-is

console.log(`✓ Built dist/index.html (${(html.length / 1024).toFixed(1)} KB) from ${CSS_FILES.length} CSS + ${JS_FILES.length} JS files`);
console.log("  Next: run `npm run check` to syntax-check the JS bundle.");
