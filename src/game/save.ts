import { createHeld, type Held } from "./types";

const SAVE_KEY = "lindendorf-save-v1";

type SavePayload = {
  version: 1;
  savedAt: string;
  held: Held;
};

function isHeld(value: unknown): value is Held {
  if (!value || typeof value !== "object") return false;
  const held = value as Partial<Held>;
  return (
    typeof held.name === "string" &&
    typeof held.staerke === "number" &&
    typeof held.geschick === "number" &&
    typeof held.charisma === "number" &&
    typeof held.lp === "number" &&
    Array.isArray(held.inventar) &&
    typeof held.gold === "number" &&
    typeof held.lebend === "boolean"
  );
}

export function hasSavedGame(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SAVE_KEY) !== null;
}

export function saveGame(held: Held): boolean {
  if (typeof window === "undefined") return false;
  const payload: SavePayload = { version: 1, savedAt: new Date().toISOString(), held };
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function loadGame(): Held | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw) as Partial<SavePayload>;
    if (payload.version !== 1 || !isHeld(payload.held)) return null;
    const defaults = createHeld(payload.held.name, payload.held.staerke, payload.held.geschick, payload.held.charisma);
    return {
      ...defaults,
      ...payload.held,
      inventar: [...payload.held.inventar],
      effekte: [...(payload.held.effekte ?? [])],
      mal: payload.held.mal ?? "",
    };
  } catch {
    return null;
  }
}

export function clearSavedGame(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(SAVE_KEY);
}
