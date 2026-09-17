import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const script = await readFile(resolve(root, "src/game/script.ts"), "utf8");
const knowledge = await readFile(resolve(root, "src/game/knowledge.ts"), "utf8");
const content = await readFile(resolve(root, "src/game/content.ts"), "utf8");

const requiredKnowledge = [
  "artefakt_gesehen",
  "artefakt_erhalten",
  "holm_besucht",
  "auftrag_erhalten",
  "banditen_bekannt",
  "rotes_siegel_gesehen",
  "glockenweg_bekannt",
  "glocke_vorteil",
];
for (const key of requiredKnowledge) {
  if (!knowledge.includes(`"${key}"`)) throw new Error(`Wissenspunkt fehlt: ${key}`);
}

const requiredHooks = [
  "holmBesucht",
  "artefaktErhalten",
  "glockenwegLabel",
  "Was du weißt",
  "Nach dem roten Wachs fragen",
];
for (const hook of requiredHooks) {
  if (!script.includes(hook)) throw new Error(`Freischalthaken fehlt: ${hook}`);
}

if (!content.includes("IntroArtifactContentSchema.parse")) {
  throw new Error("Die Intro-Contentdaten werden nicht gegen das Schema validiert.");
}

console.log("knowledge-keys=ok");
console.log("gate-hooks=ok");
console.log("content-schema=ok");
