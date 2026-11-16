import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

/* ---------------------------------------------------------------------------
   Local content editor server.

   Runs ONLY on your machine (`npm run edit`). It is never deployed: the live
   site is a static export with no backend, so this is where edits actually get
   written. It reads and writes app/content/site.json, saves uploaded images
   into public/, and has a Publish step that commits those changes and pushes
   to GitHub (which triggers Vercel to rebuild).

   No external dependencies: Node built-ins only. Binds to localhost so nothing
   is exposed on the network.
--------------------------------------------------------------------------- */

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", ".."); // scripts/editor -> project root
const SITE_JSON = join(ROOT, "app", "content", "site.json");
const PUBLIC_DIR = join(ROOT, "public");
const PORT = 4321;

/* The only paths Publish is ever allowed to stage. Keeps a publish from
   sweeping up unrelated working-tree changes (code, notes, tooling). */
const PUBLISH_PATHS = ["app/content/site.json", "public"];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
};

function send(res, status, body, type = "application/json") {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > 25 * 1024 * 1024) {
        reject(new Error("Body too large (25MB limit)."));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function git(args) {
  return new Promise((resolve) => {
    execFile("git", args, { cwd: ROOT, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      resolve({ ok: !err, code: err?.code ?? 0, out: (stdout || "") + (stderr || "") });
    });
  });
}

/* Logo lookup for the toolbox. Built once, lazily, from the icon package on
   the server side only, so the site bundle never pulls the whole icon set. A
   tool gets a real logo when the brand exists in the set; otherwise it stays a
   plain text chip (no invented logos). */
let ICON_INDEX = null;
const normName = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
async function iconIndex() {
  if (ICON_INDEX) return ICON_INDEX;
  const map = new Map();
  try {
    const si = await import("simple-icons");
    for (const v of Object.values(si)) {
      if (v && typeof v === "object" && v.path && v.title) {
        const t = normName(v.title);
        if (t && !map.has(t)) map.set(t, { path: v.path, title: v.title });
        if (v.slug) {
          const sg = normName(v.slug);
          if (sg && !map.has(sg)) map.set(sg, { path: v.path, title: v.title });
        }
      }
    }
  } catch {
    /* package missing: everything just stays a chip */
  }
  ICON_INDEX = map;
  return map;
}

/* Turn a label into a safe file stem: lowercase, alnum and dashes only. */
function slug(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";
}

const IMG_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif"]);

async function serveStatic(res, name) {
  try {
    const file = join(HERE, name);
    const body = await readFile(file);
    send(res, 200, body, MIME[extname(name)] ?? "application/octet-stream");
  } catch {
    send(res, 404, "Not found", "text/plain");
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  try {
    // --- UI ---
    if (req.method === "GET" && (path === "/" || path === "/index.html")) {
      return serveStatic(res, "index.html");
    }
    if (req.method === "GET" && (path === "/editor.js" || path === "/editor.css")) {
      return serveStatic(res, path.slice(1));
    }

    // --- preview uploaded images/resume straight from public/ ---
    if (req.method === "GET" && /^\/(certs|work)\/[^/]+$/.test(path)) {
      try {
        const body = await readFile(join(PUBLIC_DIR, path));
        return send(res, 200, body, MIME[extname(path)] ?? "application/octet-stream");
      } catch {
        return send(res, 404, "Not found", "text/plain");
      }
    }

    // --- read content ---
    if (req.method === "GET" && path === "/api/content") {
      const raw = await readFile(SITE_JSON, "utf-8");
      return send(res, 200, raw);
    }

    // --- save content ---
    if (req.method === "POST" && path === "/api/save") {
      const body = await readBody(req);
      let data;
      try {
        data = JSON.parse(body.toString("utf-8"));
      } catch {
        return send(res, 400, JSON.stringify({ ok: false, error: "Invalid JSON." }));
      }
      for (const key of ["profile", "experience", "projects", "skills", "certs", "posts"]) {
        if (!(key in data)) {
          return send(res, 400, JSON.stringify({ ok: false, error: `Missing "${key}".` }));
        }
      }
      await writeFile(SITE_JSON, JSON.stringify(data, null, 2) + "\n", "utf-8");
      return send(res, 200, JSON.stringify({ ok: true }));
    }

    // --- upload an image or the resume ---
    if (req.method === "POST" && path === "/api/upload") {
      const body = await readBody(req);
      const { kind, name, dataUrl } = JSON.parse(body.toString("utf-8"));
      const m = /^data:([^;]+);base64,(.*)$/s.exec(dataUrl || "");
      if (!m) return send(res, 400, JSON.stringify({ ok: false, error: "Bad file data." }));
      const buf = Buffer.from(m[2], "base64");

      if (kind === "resume") {
        // Always lands at the fixed resume path the site links to.
        const rel = "resume-eworitse-egbejule.pdf";
        await writeFile(join(PUBLIC_DIR, rel), buf);
        return send(res, 200, JSON.stringify({ ok: true, path: "/" + rel }));
      }

      const dir = kind === "work" ? "work" : "certs";
      let ext = extname(name || "").toLowerCase();
      if (!IMG_EXT.has(ext)) ext = ".png";
      const rel = `${dir}/${slug(name?.replace(/\.[^.]+$/, "") || kind)}-${Date.now().toString(36)}${ext}`;
      await mkdir(join(PUBLIC_DIR, dir), { recursive: true });
      await writeFile(join(PUBLIC_DIR, rel), buf);
      return send(res, 200, JSON.stringify({ ok: true, path: "/" + rel }));
    }

    // --- resolve a logo for a tool name (toolbox) ---
    if (req.method === "POST" && path === "/api/resolve-icon") {
      const body = await readBody(req);
      const { label } = JSON.parse(body.toString("utf-8"));
      const idx = await iconIndex();
      const hit = idx.get(normName(label));
      return send(res, 200, JSON.stringify({ ok: true, icon: hit?.path ?? null, title: hit?.title ?? null }));
    }

    // --- git status (what Publish would ship) ---
    if (req.method === "GET" && path === "/api/git-status") {
      const r = await git(["status", "--porcelain", "--", ...PUBLISH_PATHS]);
      return send(res, 200, JSON.stringify({ ok: r.ok, pending: r.out.trim() }));
    }

    // --- publish: commit the content + images and push ---
    if (req.method === "POST" && path === "/api/publish") {
      const add = await git(["add", "--", ...PUBLISH_PATHS]);
      if (!add.ok) return send(res, 200, JSON.stringify({ ok: false, step: "add", out: add.out }));

      const staged = await git(["diff", "--cached", "--name-only", "--", ...PUBLISH_PATHS]);
      if (!staged.out.trim()) {
        return send(res, 200, JSON.stringify({ ok: false, step: "nothing", out: "Nothing to publish: no content changes staged." }));
      }

      const msg = `Update site content (${new Date().toISOString().slice(0, 16).replace("T", " ")})`;
      const commit = await git(["commit", "-m", msg]);
      if (!commit.ok) return send(res, 200, JSON.stringify({ ok: false, step: "commit", out: commit.out }));

      const push = await git(["push"]);
      return send(res, 200, JSON.stringify({ ok: push.ok, step: push.ok ? "done" : "push", out: commit.out + "\n" + push.out }));
    }

    send(res, 404, JSON.stringify({ ok: false, error: "Not found" }));
  } catch (err) {
    send(res, 500, JSON.stringify({ ok: false, error: String(err?.message ?? err) }));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  const link = `http://localhost:${PORT}`;
  console.log(`\n  Content editor running at  ${link}\n  Editing: app/content/site.json`);
  console.log(`  Stop with Ctrl+C.\n`);
  // Best-effort: open the browser. Never fatal if it fails.
  const opener = process.platform === "win32" ? ["cmd", ["/c", "start", "", link]]
    : process.platform === "darwin" ? ["open", [link]]
    : ["xdg-open", [link]];
  try {
    execFile(opener[0], opener[1], () => {});
  } catch {
    /* ignore: the URL is printed above */
  }
});
