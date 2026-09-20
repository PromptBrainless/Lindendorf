import { protokolliere } from "./decisions";
import type { Held } from "./types";

export function merkeDir(held: Held, szeneId: string, npcId: string, flagId: string): void {
  if (erinnertSich(held, npcId, flagId)) return;
  protokolliere(held, { szeneId, typ: "npc", ziel: npcId, wert: flagId });
}

export function erinnertSich(held: Held, npcId: string, flagId: string): boolean {
  return (held.entscheidungen ?? []).some((e) => e.typ === "npc" && e.ziel === npcId && e.wert === flagId);
}
