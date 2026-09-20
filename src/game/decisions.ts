import type { Entscheidung } from "./heldSchema";
import type { Held } from "./types";

export function protokolliere(held: Held, eintrag: Omit<Entscheidung, "timestamp">): void {
  if (!held.entscheidungen) held.entscheidungen = [];
  held.entscheidungen.push({ ...eintrag, timestamp: Date.now() });
}
