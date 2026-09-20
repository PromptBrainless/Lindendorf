import type { ArtKey, EffektId, Held } from "./types";
import { setzeEffekt } from "./effekte";

export type OrtZustand = {
  hinzu: EffektId[];
  nimmt: EffektId[];
  fort: EffektId[];
};

const LEER: OrtZustand = { hinzu: [], nimmt: [], fort: [] };

export const ORT_ZUSTAENDE: Record<ArtKey, OrtZustand> = {
  title: LEER,
  road: { hinzu: ["nass"], nimmt: ["trocken"], fort: ["nass"] },
  stranger: { hinzu: ["neugierig"], nimmt: [], fort: ["neugierig"] },
  village: { hinzu: ["trocken"], nimmt: ["nass"], fort: ["trocken"] },
  townhall: { hinzu: ["konzentriert"], nimmt: [], fort: ["konzentriert"] },
  tavern: { hinzu: ["satt"], nimmt: ["hungrig", "durstig"], fort: ["satt"] },
  well: { hinzu: ["nass", "durstig"], nimmt: ["trocken"], fort: ["nass", "durstig"] },
  mill: { hinzu: ["erschoepfung", "hungrig"], nimmt: [], fort: ["erschoepfung"] },
  apothecary: { hinzu: ["segen"], nimmt: ["fieber"], fort: ["segen"] },
  smithy: { hinzu: ["motiviert"], nimmt: [], fort: ["motiviert"] },
  forest: { hinzu: ["furcht"], nimmt: [], fort: ["furcht"] },
  ditch: { hinzu: ["nass"], nimmt: ["trocken"], fort: ["nass"] },
  chapel: { hinzu: ["segen", "gelassen"], nimmt: ["furcht"], fort: ["segen", "gelassen"] },
  camp: { hinzu: ["erschoepfung"], nimmt: [], fort: ["erschoepfung"] },
  evidence: { hinzu: ["konzentriert"], nimmt: [], fort: ["konzentriert"] },
  sneak: { hinzu: ["konzentriert"], nimmt: [], fort: ["konzentriert"] },
  combat: { hinzu: ["motiviert"], nimmt: [], fort: ["motiviert"] },
  gate: { hinzu: ["furcht"], nimmt: [], fort: ["furcht"] },
  death: { hinzu: ["traurig"], nimmt: [], fort: [] },
  return: { hinzu: ["gelassen"], nimmt: ["furcht"], fort: ["gelassen"] },
};

export function ortZustand(art: ArtKey | undefined): OrtZustand {
  return art ? ORT_ZUSTAENDE[art] : LEER;
}

export function wendeOrtWechselAn(held: Held, von: ArtKey | undefined, nach: ArtKey): OrtZustand {
  const alt = ortZustand(von);
  const neu = ortZustand(nach);
  for (const id of alt.fort) setzeEffekt(held, id, false);
  for (const id of neu.nimmt) setzeEffekt(held, id, false);
  for (const id of neu.hinzu) setzeEffekt(held, id, true);
  return neu;
}

export function wendeEffektListenAn(held: Held, hinzu: EffektId[] = [], fort: EffektId[] = []) {
  for (const id of fort) setzeEffekt(held, id, false);
  for (const id of hinzu) setzeEffekt(held, id, true);
}
