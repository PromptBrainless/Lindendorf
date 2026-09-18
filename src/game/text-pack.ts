export const AUTHOR_STORAGE = "lindendorf-author-v1";
export const PACK_STORAGE = "lindendorf-text-pack-v1";

export type CardText = {
  title: string;
  lines: string[];
  choices: string[];
};

export type CardPatch = {
  title?: string;
  lines?: string[];
  choices?: string[];
};

export type PackEntry = {
  original: CardText;
  patch: CardPatch;
};

export type TextPack = {
  version: 1;
  patches: Record<string, PackEntry>;
};

let fileCache: TextPack = { version: 1, patches: {} };

export function fingerprint(card: CardText): string {
  const raw = JSON.stringify([card.title, card.lines, card.choices]);
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i += 1) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function applyPatch(card: CardText, patch: CardPatch | undefined): CardText {
  if (!patch) return card;
  const lines = patch.lines?.length ? patch.lines : card.lines;
  const choices = patch.choices?.length === card.choices.length ? patch.choices : card.choices;
  return {
    title: patch.title?.trim() ? patch.title : card.title,
    lines,
    choices,
  };
}

function emptyPack(): TextPack {
  return { version: 1, patches: {} };
}

function asPack(value: unknown): TextPack {
  if (!value || typeof value !== "object") return emptyPack();
  const rec = value as { version?: number; patches?: Record<string, PackEntry> };
  if (rec.version !== 1 || !rec.patches || typeof rec.patches !== "object") return emptyPack();
  return { version: 1, patches: rec.patches };
}

export function filePack(): TextPack {
  return fileCache;
}

export function hydrateFilePack(pack: TextPack) {
  fileCache = asPack(pack);
}

export async function loadFilePack(): Promise<void> {
  try {
    const res = await fetch("/__lindendorf/text-pack");
    if (!res.ok) return;
    hydrateFilePack(asPack(await res.json()));
  } catch {
    /* preview ohne Speicherweg: nur localStorage */
  }
}

export function readAuthorMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(AUTHOR_STORAGE) === "1";
  } catch {
    return false;
  }
}

export function writeAuthorMode(on: boolean) {
  try {
    window.localStorage.setItem(AUTHOR_STORAGE, on ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function readLocalPack(): TextPack {
  if (typeof window === "undefined") return emptyPack();
  try {
    const raw = window.localStorage.getItem(PACK_STORAGE);
    if (!raw) return emptyPack();
    return asPack(JSON.parse(raw) as unknown);
  } catch {
    return emptyPack();
  }
}

export function writeLocalPack(pack: TextPack) {
  try {
    window.localStorage.setItem(PACK_STORAGE, JSON.stringify(pack));
  } catch {
    /* ignore */
  }
}

export function mergedPack(): TextPack {
  return { version: 1, patches: { ...filePack().patches, ...readLocalPack().patches } };
}

export function upsertPatch(original: CardText, patch: CardPatch): TextPack {
  const pack = mergedPack();
  const key = fingerprint(original);
  const nextPatch: CardPatch = {};
  if (patch.title !== undefined && patch.title !== original.title) nextPatch.title = patch.title;
  if (patch.lines && JSON.stringify(patch.lines) !== JSON.stringify(original.lines)) nextPatch.lines = patch.lines;
  if (patch.choices && JSON.stringify(patch.choices) !== JSON.stringify(original.choices)) {
    nextPatch.choices = patch.choices;
  }
  if (!nextPatch.title && !nextPatch.lines && !nextPatch.choices) {
    delete pack.patches[key];
  } else {
    pack.patches[key] = { original, patch: nextPatch };
  }
  writeLocalPack(pack);
  return pack;
}

export function patchCount(pack: TextPack): number {
  return Object.keys(pack.patches).length;
}

export function lookupPatch(original: CardText): CardPatch | undefined {
  return mergedPack().patches[fingerprint(original)]?.patch;
}

export async function commitPack(
  pack: TextPack,
  apply = false,
): Promise<{
  ok: boolean;
  error?: string;
  apply?: { applied: number; missing: number; ambiguous: number; cards: number; kept: number; error?: string };
}> {
  const res = await fetch("/__lindendorf/text-pack", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ pack, apply }),
  });
  const text = await res.text();
  let data: {
    ok?: boolean;
    error?: string;
    apply?: { applied: number; missing: number; ambiguous: number; cards: number; kept: number; error?: string };
  };
  try {
    data = JSON.parse(text) as typeof data;
  } catch {
    return { ok: false, error: "Der Speicherweg antwortet nicht." };
  }
  if (data.ok) hydrateFilePack(pack);
  return { ok: Boolean(data.ok), error: data.error, apply: data.apply };
}
