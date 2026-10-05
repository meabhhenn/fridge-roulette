// dev-server.js — run the app locally with `npm run dev` (no Vercel account needed).
// Serves the static files and routes /api/* to the same handler files Vercel uses.
// Not used in production: Vercel runs the /api files itself.

import http from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Load KEY=value lines from .env into process.env (tiny version of the dotenv package).
if (existsSync(path.join(root, ".env"))) {
  for (const line of readFileSync(path.join(root, ".env"), "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon" };

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // API routes: /api/recipes -> api/recipes.js
  if (url.pathname.startsWith("/api/")) {
    const name = path.basename(url.pathname);
    const file = path.join(root, "api", `${name}.js`);
    if (!/^[a-z-]+$/.test(name) || !existsSync(file)) return send(res, 404, { error: "Not found" });
    const { default: handler } = await import(pathToFileURL(file).href);
    return handler({ query: Object.fromEntries(url.searchParams), method: req.method }, vercelStyle(res));
  }

  // Static files
  const rel = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const file = path.normalize(path.join(root, rel));
  const blocked = !file.startsWith(root) || /(^|[\\/])(\.env|node_modules|api|lib)([\\/]|$)/.test(path.relative(root, file));
  if (blocked) return send(res, 404, { error: "Not found" });
  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    send(res, 404, { error: "Not found" });
  }
}).listen(PORT, () => {
  console.log(`Fridge Roulette running at http://localhost:${PORT}`);
  console.log(process.env.USE_MOCK === "true" ? "Using MOCK recipes (USE_MOCK=true)" : "Using live Spoonacular API");
});

// Give Node's response object the res.status(...).json(...) helpers Vercel provides.
function vercelStyle(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(obj)); return res; };
  return res;
}

function send(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
}
