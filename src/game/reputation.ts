import { protokolliere } from "./decisions";
import type { Held } from "./types";

export function rufAus(held: Held, ziel: string): number {
  const clamp = (n: number) => Math.max(-100, Math.min(100, n));
  return clamp(
    (held.entscheidungen ?? [])
      .filter((e) => e.typ === "ruf" && e.ziel === ziel)
      .reduce((sum, e) => sum + (typeof e.wert === "number" ? e.wert : 0), 0),
  );
}

export function aendereRuf(held: Held, szeneId: string, ziel: string, delta: number): void {
  if (!delta) return;
  protokolliere(held, { szeneId, typ: "ruf", ziel, wert: delta });
}

export function rufListe(held: Held): { ziel: string; wert: number }[] {
  const ziele = [...new Set((held.entscheidungen ?? []).filter((e) => e.typ === "ruf").map((e) => e.ziel))];
  return ziele
    .map((ziel) => ({ ziel, wert: rufAus(held, ziel) }))
    .filter((item) => item.wert !== 0);
}
