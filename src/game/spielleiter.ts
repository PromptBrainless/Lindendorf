import type { ArtKey, EffektId, PortraitKey, SceneView } from "./types";

export const SPIELLEITER_FLAG = "lindendorf.spielleiter.an";
export const SPIELLEITER_STORE = "lindendorf.spielleiter.karten.v1";

export type KartePatch = {
  title?: string;
  art?: ArtKey;
  portrait?: PortraitKey | null;
  artSrc?: string;
  portraitSrc?: string;
  lines?: string[];
  choices?: string[];
  effekte?: EffektId[];
  effekteFort?: EffektId[];
};

export function spielleiterAktiv(): boolean {
  if (typeof window === "undefined") return false;
  const query = new URLSearchParams(window.location.search);
  if (query.has("spielleiter") || query.has("gm")) return true;
  try {
    return window.localStorage.getItem(SPIELLEITER_FLAG) === "1";
  } catch {
    return false;
  }
}

export function setzeSpielleiterAktiv(an: boolean) {
  try {
    if (an) window.localStorage.setItem(SPIELLEITER_FLAG, "1");
    else window.localStorage.removeItem(SPIELLEITER_FLAG);
  } catch {
    /* privater Modus */
  }
}

export function karteSchluessel(view: Pick<SceneView, "title" | "lines" | "choices">): string {
  const roh = `${view.title}\n${view.lines.join("\n")}\n—\n${view.choices.join("\n")}`;
  let hash = 2166136261;
  for (let i = 0; i < roh.length; i += 1) {
    hash ^= roh.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `k${(hash >>> 0).toString(16)}`;
}

export function sichtSchluessel(view: SceneView): string[] {
  const keys = [karteSchluessel(view)];
  if (view.original) {
    const orig = karteSchluessel({
      title: view.original.title,
      lines: view.original.lines,
      choices: view.original.choices,
    });
    if (!keys.includes(orig)) keys.push(orig);
  }
  return keys;
}

export function ladeKarten(): Record<string, KartePatch> {
  try {
    const roh = window.localStorage.getItem(SPIELLEITER_STORE);
    if (!roh) return {};
    const gelesen = JSON.parse(roh) as Record<string, KartePatch>;
    return gelesen && typeof gelesen === "object" ? gelesen : {};
  } catch {
    return {};
  }
}

export function patchFuerSicht(view: SceneView): { schluessel: string; patch: KartePatch } {
  const alle = ladeKarten();
  const keys = sichtSchluessel(view);
  for (const key of keys) {
    if (alle[key] && Object.keys(alle[key]).length) return { schluessel: key, patch: alle[key] };
  }
  const treffer = Object.entries(alle).filter(([, patch]) => {
    if (!patch || !Object.keys(patch).length) return false;
    if (patch.title && patch.title === view.title) return true;
    if (patch.choices && patch.choices.length === view.choices.length && view.title && patch.lines?.length) {
      return false;
    }
    return false;
  });
  const genau = treffer.filter(([, patch]) => patch.title === view.title);
  if (genau.length === 1) return { schluessel: genau[0][0], patch: genau[0][1] };
  return { schluessel: keys[0] ?? karteSchluessel(view), patch: {} };
}

export function speichereKarte(schluessel: string, patch: KartePatch) {
  const alle = ladeKarten();
  alle[schluessel] = patch;
  try {
    window.localStorage.setItem(SPIELLEITER_STORE, JSON.stringify(alle));
  } catch {
    /* voll oder gesperrt */
  }
}

export function loescheKarte(schluessel: string) {
  const alle = ladeKarten();
  delete alle[schluessel];
  try {
    window.localStorage.setItem(SPIELLEITER_STORE, JSON.stringify(alle));
  } catch {
    /* ignore */
  }
}

function uniqueIds(ids: EffektId[]): EffektId[] | undefined {
  const next = [...new Set(ids)];
  return next.length ? next : undefined;
}

export function wendePatchAn(view: SceneView, patch: KartePatch | null | undefined): SceneView {
  if (!patch) return view;
  const portrait =
    patch.portrait === null ? undefined : (patch.portrait ?? view.portrait);
  const choices = patch.choices?.length
    ? view.choices.map((alt, index) => patch.choices?.[index]?.trim() || alt)
    : view.choices;
  return {
    ...view,
    title: patch.title?.trim() || view.title,
    art: patch.art ?? view.art,
    portrait,
    artSrc: patch.artSrc?.trim() || view.artSrc,
    portraitSrc: patch.portraitSrc?.trim() || view.portraitSrc,
    lines: patch.lines?.map((line) => line.trim()).filter(Boolean) ?? view.lines,
    choices,
    seiteHinzu: uniqueIds([...(view.seiteHinzu ?? []), ...(patch.effekte ?? [])]),
    seiteFort: uniqueIds([...(view.seiteFort ?? []), ...(patch.effekteFort ?? [])]),
  };
}

export function patchAusSicht(view: SceneView): KartePatch {
  return {
    title: view.title,
    art: view.art,
    portrait: view.portrait ?? null,
    artSrc: view.artSrc,
    portraitSrc: view.portraitSrc,
    lines: [...view.lines],
    choices: [...view.choices],
  };
}
