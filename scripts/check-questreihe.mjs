#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const root = resolve(process.cwd());
const gameDir = resolve(root, "src/game");

const types = await readFile(resolve(gameDir, "types.ts"), "utf8");
const script = await readFile(resolve(gameDir, "script.ts"), "utf8");
const artFile = await readFile(resolve(gameDir, "art.ts"), "utf8");

const questFiles = (await readdir(gameDir))
  .filter((name) => name.startsWith("quest-") && name.endsWith(".ts"))
  .map((name) => resolve(gameDir, name));

if (questFiles.length === 0) {
  throw new Error("Keine Quest-Module unter src/game/quest-*.ts gefunden.");
}

function unionValues(typeName) {
  const match = types.match(new RegExp(`export type ${typeName} =([\\s\\S]*?);`));
  return new Set([...(match?.[1] ?? "").matchAll(/"([a-z]+)"/g)].map((item) => item[1]));
}

const allowedArt = unionValues("ArtKey");
const allowedPortraits = unionValues("PortraitKey");

const heldBlock = types.match(/export type Held = \{([\s\S]*?)\n\};/)?.[1] ?? "";
const heldFields = new Set([...heldBlock.matchAll(/^\s+([a-zA-Z][a-zA-Z0-9]*)[?]?:"/gm)].map((m) => m[1]));
if (heldFields.size === 0) {
  for (const match of heldBlock.matchAll(/^\s+([a-zA-Z][a-zA-Z0-9]*): /gm)) heldFields.add(match[1]);
}

const createHeldBlock = types.slice(types.indexOf("export function createHeld"));
const errors = [];
const fail = (message) => errors.push(message);

const banned = [
  /[\u{1F300}-\u{1FAFF}]/u,
  /\bIn einer Welt\b/i,
  /\bdas Schicksal\b/i,
  /\bepische Quest\b/i,
  /\bmutige Herz\b/i,
];

const englishChoice = /label:\s*"(?:Start the|Attack|Sneak past|Talk to|Go back)[^"]*"/i;

for (const file of questFiles) {
  const source = await readFile(file, "utf8");
  const short = basename(file);
  const spec = `from "./${short.replace(/\.ts$/, "")}"`;

  if (!source.includes("export async function")) fail(`${short}: exportiert keine async function`);
  if (!script.includes(spec)) fail(`${short}: fehlt als Import in script.ts`);

  for (const match of source.matchAll(/\bart:\s*"([a-z]+)"/g)) {
    if (!allowedArt.has(match[1])) fail(`${short}: unbekannter ArtKey "${match[1]}"`);
  }
  for (const match of source.matchAll(/\bportrait:\s*"([a-z]+)"/g)) {
    if (!allowedPortraits.has(match[1])) fail(`${short}: unbekanntes Portrait "${match[1]}"`);
  }

  const assigned = [...source.matchAll(/\bheld\.([a-zA-Z][a-zA-Z0-9]*)\s*=/g)].map((m) => m[1]);
  for (const field of new Set(assigned)) {
    if (field === "inventar" || field === "lp" || field === "lebend") continue;
    if (!heldFields.has(field)) fail(`${short}: schreibt held.${field}, Feld fehlt auf Held`);
    else if (!createHeldBlock.includes(`${field}:`)) fail(`${short}: held.${field} ohne Default in createHeld`);
  }

  for (const field of new Set(assigned.filter((name) => name.startsWith("loesungsweg") && name !== "loesungsweg"))) {
    const epilogFn = script.slice(script.indexOf("function epilog"));
    if (!epilogFn.includes(field)) fail(`${short}: ${field} wird nicht in epilog() gelesen`);
    const reads =
      (script.match(new RegExp(`held\\.${field}`, "g")) ?? []).length +
      (source.match(new RegExp(`held\\.${field}`, "g")) ?? []).length;
    if (reads < 3) fail(`${short}: ${field} wird zu selten gelesen (${reads})`);
  }

  for (const pattern of banned) {
    if (pattern.test(source)) fail(`${short}: verbotene Floskel oder Emoji`);
  }
  if (englishChoice.test(source)) fail(`${short}: englisches Wahltext-Fragment`);
}

if (!script.includes("Zur Mühle gehen")) fail('Hub-Label "Zur Mühle gehen" fehlt');
if (!script.includes("Den trüben Eimer prüfen")) fail('Hub-Label "Den trüben Eimer prüfen" fehlt');
if (!artFile.includes("mill:") || !artFile.includes("well:")) fail("art.ts verliert mill/well");

if (errors.length) {
  console.error(errors.map((line) => `check:questreihe ${line}`).join("\n"));
  process.exit(1);
}

console.log(`quest-modules=${questFiles.length}`);
console.log("questreihe=ok");
