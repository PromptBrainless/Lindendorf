import type { ArtKey, PortraitKey } from "./types";

export const ART: Record<ArtKey, string> = {
  title: "/art/title.jpg",
  road: "/art/road.jpg",
  stranger: "/art/stranger.jpg",
  village: "/art/village.jpg",
  townhall: "/art/townhall.jpg",
  tavern: "/art/tavern.jpg",
  well: "/art/well.jpg",
  mill: "/art/mill.jpg",
  apothecary: "/art/apothecary.jpg",
  smithy: "/art/smithy.jpg",
  forest: "/art/forest.jpg",
  ditch: "/art/ditch.jpg",
  chapel: "/art/chapel.jpg",
  camp: "/art/camp.jpg",
  evidence: "/art/evidence.jpg",
  sneak: "/art/sneak.jpg",
  combat: "/art/combat.jpg",
  gate: "/art/gate.jpg",
  death: "/art/death.jpg",
  return: "/art/return.jpg",
};

export const ART_MOTION: Partial<Record<ArtKey, string>> = {};

export const PORTRAITS: Record<PortraitKey, string> = {
  holm: "/art/holm.jpg",
  mara: "/art/mara.jpg",
  kess: "/art/kess.jpg",
  miller: "/art/miller.jpg",
  kern: "/art/kern.jpg",
  sanna: "/art/sanna.jpg",
  smith: "/art/smith.jpg",
  beggar: "/art/beggar.jpg",
  grovin: "/art/grovin.jpg",
};

export const PORTRAIT_MOTION: Partial<Record<PortraitKey, string>> = {
  grovin: "/art/grovin.mp4",
};

export function isMotion(src: string) {
  return /\.(mp4|webm)$/i.test(src);
}

export function artSrcFor(art: ArtKey, override?: string) {
  return override || ART_MOTION[art] || ART[art];
}

export function portraitSrcFor(portrait: PortraitKey | undefined, override?: string) {
  if (override) return override;
  if (!portrait) return "";
  return PORTRAIT_MOTION[portrait] || PORTRAITS[portrait];
}

export function posterFor(src: string, art?: ArtKey) {
  if (!isMotion(src)) return undefined;
  if (art && ART[art]) return ART[art];
  return undefined;
}
