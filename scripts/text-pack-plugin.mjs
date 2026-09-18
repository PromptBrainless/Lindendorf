import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function attach(server, root) {
  server.middlewares.use(async (req, res, next) => {
    const pathOnly = (req.url ?? "").split("?", 1)[0] ?? "";
    if (pathOnly !== "/__lindendorf/text-pack") {
      next();
      return;
    }
    const packPath = join(root, "src/game/text-pack.json");
    const method = (req.method ?? "GET").toUpperCase();
    res.setHeader("content-type", "application/json; charset=utf-8");
    try {
      if (method === "GET") {
        res.end(readFileSync(packPath, "utf8"));
        return;
      }
      if (method !== "POST") {
        res.statusCode = 405;
        res.end(JSON.stringify({ ok: false, error: "method" }));
        return;
      }
      const raw = (await readBody(req)) || "{}";
      const body = JSON.parse(raw);
      const pack = body.pack ?? { version: 1, patches: {} };
      writeFileSync(packPath, `${JSON.stringify(pack, null, 2)}\n`);
      let apply = null;
      if (body.apply) {
        const run = spawnSync("node", [join(root, "scripts/apply-text-pack.mjs")], {
          encoding: "utf8",
          cwd: root,
        });
        const out = (run.stdout || "").trim().split("\n").pop() || "";
        try {
          apply = JSON.parse(out);
        } catch {
          apply = { error: (run.stderr || out || "apply failed").slice(0, 400) };
        }
      }
      res.end(JSON.stringify({ ok: true, apply }));
    } catch (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ ok: false, error: String(err?.message ?? err) }));
    }
  });
}

export function textPackPlugin() {
  return {
    name: "lindendorf-text-pack",
    configureServer(server) {
      attach(server, server.config.root);
    },
    configurePreviewServer(server) {
      attach(server, server.config.root);
    },
  };
}
