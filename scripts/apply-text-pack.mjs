#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const packPath = join(root, "src/game/text-pack.json");
const gameDir = join(root, "src/game");
const files = [
  "script.ts",
  "quest-muehle.ts",
  "quest-brunnen.ts",
  "quest-kesseljahr.ts",
  "reihe-versorgung.ts",
  "knowledge.ts",
  "content.ts",
  "heal.ts",
];

function loadPack() {
  try {
    return JSON.parse(readFileSync(packPath, "utf8"));
  } catch {
    return { version: 1, patches: {} };
  }
}

function replaceOnce(src, from, to) {
  if (from === to) return { src, status: "same" };
  const needle = JSON.stringify(from);
  const repl = JSON.stringify(to);
  const count = src.split(needle).length - 1;
  if (count === 1) return { src: src.split(needle).join(repl), status: "applied" };
  if (count === 0) return { src, status: "missing" };
  return { src, status: "ambiguous" };
}

const pack = loadPack();
const patches = pack.patches ?? {};
const report = { applied: 0, missing: 0, ambiguous: 0, cards: 0, kept: 0 };
const remaining = {};

const sources = Object.fromEntries(
  files.map((name) => [name, readFileSync(join(gameDir, name), "utf8")]),
);

for (const [key, entry] of Object.entries(patches)) {
  const original = entry?.original;
  const patch = entry?.patch;
  if (!original || !patch) continue;
  report.cards += 1;

  const pairs = [];
  if (typeof patch.title === "string") pairs.push([original.title, patch.title]);
  if (Array.isArray(patch.lines)) {
    const n = Math.max(original.lines.length, patch.lines.length);
    for (let i = 0; i < n; i += 1) {
      const from = original.lines[i];
      const to = patch.lines[i];
      if (typeof from === "string" && typeof to === "string") pairs.push([from, to]);
    }
  }
  if (Array.isArray(patch.choices) && patch.choices.length === original.choices.length) {
    for (let i = 0; i < original.choices.length; i += 1) {
      pairs.push([original.choices[i], patch.choices[i]]);
    }
  }

  let dirty = false;
  for (const [from, to] of pairs) {
    let status = "missing";
    for (const name of files) {
      const result = replaceOnce(sources[name], from, to);
      sources[name] = result.src;
      if (result.status !== "missing") {
        status = result.status;
        break;
      }
    }
    if (status === "applied") report.applied += 1;
    else if (status === "ambiguous") {
      report.ambiguous += 1;
      dirty = true;
    } else if (status === "missing" && from !== to) {
      report.missing += 1;
      dirty = true;
    }
  }

  if (dirty) {
    remaining[key] = entry;
    report.kept += 1;
  }
}

for (const name of files) {
  writeFileSync(join(gameDir, name), sources[name]);
}
writeFileSync(packPath, `${JSON.stringify({ version: 1, patches: remaining }, null, 2)}\n`);
console.log(JSON.stringify(report));
