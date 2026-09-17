export const LEICHT = 8;
export const MITTEL = 12;
export const SCHWER = 15;
export const START_LP = 10;
export const MAX_LP = 10;

export const HEILTRANK = "Heiltrank";
export const SCHLUESSEL = "Schlüssel";

export type Loesungsweg = "kampf" | "schleich" | "ueberreden" | null;

export type ArtKey =
  | "title"
  | "road"
  | "village"
  | "townhall"
  | "tavern"
  | "well"
  | "forest"
  | "ditch"
  | "camp"
  | "sneak"
  | "combat"
  | "gate"
  | "death"
  | "return";

export type PortraitKey = "holm" | "mara" | "kess" | "miller";

export type Held = {
  name: string;
  staerke: number;
  geschick: number;
  charisma: number;
  lp: number;
  inventar: string[];
  gold: number;
  banditenGewarnt: boolean;
  buergermeisterVertraut: boolean;
  verwundet: boolean;
  holmBesucht: boolean;
  auftragErhalten: boolean;
  lagerGeloest: boolean;
  loesungsweg: Loesungsweg;
  lebend: boolean;
  beuteGerettet: boolean;
  bettlerGeholfen: boolean;
  bettlerAbgewiesen: boolean;
  maraGeholfen: boolean;
  maraAbgewiesen: boolean;
  schmiedGeholfen: boolean;
  schmiedAbgewiesen: boolean;
  mehlsackGefunden: boolean;
  mehlsackGemeldet: boolean;
  letzterGastGefunden: boolean;
  letzterGastAbgewiesen: boolean;
  kernGeholfen: boolean;
  kernAbgewiesen: boolean;
  holmSiegelGefunden: boolean;
  holmSiegelVerschwiegen: boolean;
  schnurGeholfen: boolean;
  schnurAbgewiesen: boolean;
  sannaGeholfen: boolean;
  sannaAbgewiesen: boolean;
  salzGerettet: boolean;
  salzLiegenGelassen: boolean;
  glockeGestoppt: boolean;
  glockeGescheitert: boolean;
  artefaktErhalten: boolean;
  artefaktVerloren: boolean;
  artefaktWeg: Loesungsweg;
};

export type ProbeResult = {
  beschreibung: string;
  attributName: string;
  attributWert: number;
  wurf: number;
  summe: number;
  schwierigkeit: number;
  erfolg: boolean;
};

export type SceneView = {
  title: string;
  art: ArtKey;
  portrait?: PortraitKey;
  lines: string[];
  held?: Held;
  probe?: ProbeResult;
  log?: string[];
  ending?: string;
  choices: string[];
};

export function createHeld(name: string, staerke: number, geschick: number, charisma: number): Held {
  return {
    name: name.trim() || "Namenlos",
    staerke,
    geschick,
    charisma,
    lp: START_LP,
    inventar: [],
    gold: 0,
    banditenGewarnt: false,
    buergermeisterVertraut: false,
    verwundet: false,
    holmBesucht: false,
    auftragErhalten: false,
    lagerGeloest: false,
    loesungsweg: null,
    lebend: true,
    beuteGerettet: false,
    bettlerGeholfen: false,
    bettlerAbgewiesen: false,
    maraGeholfen: false,
    maraAbgewiesen: false,
    schmiedGeholfen: false,
    schmiedAbgewiesen: false,
    mehlsackGefunden: false,
    mehlsackGemeldet: false,
    letzterGastGefunden: false,
    letzterGastAbgewiesen: false,
    kernGeholfen: false,
    kernAbgewiesen: false,
    holmSiegelGefunden: false,
    holmSiegelVerschwiegen: false,
    schnurGeholfen: false,
    schnurAbgewiesen: false,
    sannaGeholfen: false,
    sannaAbgewiesen: false,
    salzGerettet: false,
    salzLiegenGelassen: false,
    glockeGestoppt: false,
    glockeGescheitert: false,
    artefaktErhalten: false,
    artefaktVerloren: false,
    artefaktWeg: null,
  };
}

export function cloneHeld(held: Held): Held {
  return { ...held, inventar: [...held.inventar] };
}

export function tot(held: Held): boolean {
  return held.lp <= 0 || !held.lebend;
}
