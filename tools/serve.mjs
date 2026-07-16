/* Tiny dev server: serves dist/ at http://localhost:8080 (no dependencies).
   Google sign-in works on localhost if you add http://localhost:8080 to
   your OAuth client's Authorized JavaScript origins (docs/SETUP.md §2). */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const PORT = process.env.PORT || 8080;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".json": "application/json" };

createServer(async (req, res) => {
  const path = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  try {
    const body = await readFile(join(DIST, path));
    res.writeHead(200, { "Content-Type": TYPES[extname(path)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404); res.end("Not found — did you run `node build.mjs` first?");
  }
}).listen(PORT, () => console.log(`▶ Family Hub dev server: http://localhost:${PORT}`));
