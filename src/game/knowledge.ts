import type { Held } from "./types";

export type KnowledgeKey =
  | "dorf_ankunft"
  | "artefakt_gesehen"
  | "artefakt_erhalten"
  | "holm_besucht"
  | "auftrag_erhalten"
  | "banditen_bekannt"
  | "rotes_siegel_gesehen"
  | "hang_hinweis"
  | "glockenweg_bekannt"
  | "glocke_vorteil"
  | "banditen_gewarnt";

export type KnowledgeState = ReadonlySet<KnowledgeKey>;

export function deriveKnowledge(held: Held): KnowledgeState {
  const knowledge = new Set<KnowledgeKey>(["dorf_ankunft", "artefakt_gesehen"]);
  if (held.artefaktErhalten) knowledge.add("artefakt_erhalten");
  if (held.holmBesucht) {
    knowledge.add("holm_besucht");
    knowledge.add("banditen_bekannt");
    knowledge.add("rotes_siegel_gesehen");
  }
  if (held.auftragErhalten) knowledge.add("auftrag_erhalten");
  if (held.sannaGeholfen || held.mehlsackGefunden || held.holmSiegelGefunden || held.artefaktErhalten) {
    knowledge.add("hang_hinweis");
    knowledge.add("glockenweg_bekannt");
  }
  if (held.glockeGestoppt) knowledge.add("glocke_vorteil");
  if (held.banditenGewarnt) knowledge.add("banditen_gewarnt");
  return knowledge;
}

export function knows(held: Held, key: KnowledgeKey): boolean {
  return deriveKnowledge(held).has(key);
}

export function knowledgeLabels(held: Held): { sicher: string[]; offen: string[] } {
  const knowledge = deriveKnowledge(held);
  const sicher: string[] = [];
  if (knowledge.has("banditen_bekannt")) sicher.push("Banditen sitzen im alten Steinbruch.");
  if (knowledge.has("auftrag_erhalten")) sicher.push("Holm hat dir den Auftrag gegeben.");
  if (knowledge.has("artefakt_erhalten")) sicher.push("Das silberne Artefakt gehört zur Kirche.");
  if (knowledge.has("glocke_vorteil")) sicher.push("Die Glocke am Hang bleibt still.");
  if (knowledge.has("banditen_gewarnt")) sicher.push("Die Banditen wissen, dass jemand kommt.");

  const offen: string[] = [];
  if (!knowledge.has("banditen_bekannt")) offen.push("Warum steigt Rauch aus dem Steinbruch?");
  if (!knowledge.has("glockenweg_bekannt")) offen.push("Wer benutzt die Glocke am Hang?");
  if (!knowledge.has("artefakt_erhalten")) offen.push("Was geschah mit dem silbernen Artefakt?");
  return { sicher, offen };
}
