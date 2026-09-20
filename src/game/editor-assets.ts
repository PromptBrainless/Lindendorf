import { ART, PORTRAITS } from "./art";

export type AssetBefund = { schluessel: string; src: string; ok: boolean; art: "bild" | "portrait" };

export async function pruefeAssets(): Promise<AssetBefund[]> {
  const liste: AssetBefund[] = [
    ...Object.entries(ART).map(([schluessel, src]) => ({ schluessel, src, art: "bild" as const, ok: false })),
    ...Object.entries(PORTRAITS).map(([schluessel, src]) => ({ schluessel, src, art: "portrait" as const, ok: false })),
  ];
  await Promise.all(
    liste.map(async (item) => {
      try {
        const antwort = await fetch(item.src, { method: "HEAD" });
        item.ok = antwort.ok;
      } catch {
        item.ok = false;
      }
    }),
  );
  return liste;
}
