import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ART, PORTRAITS } from "@/game/art";
import type { ArtKey, PortraitKey, SceneView } from "@/game/types";
import type { KartePatch } from "@/game/spielleiter";

const ART_KEYS = Object.keys(ART) as ArtKey[];
const PORTRAIT_KEYS = Object.keys(PORTRAITS) as PortraitKey[];

export function SpielleiterPanel({
  original,
  patch,
  schluessel,
  onChange,
  onReset,
  onClose,
}: {
  original: SceneView;
  patch: KartePatch;
  schluessel: string;
  onChange: (next: KartePatch) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const exportText = useMemo(
    () =>
      JSON.stringify(
        {
          schluessel,
          title: original.title,
          patch,
        },
        null,
        2,
      ),
    [original.title, patch, schluessel],
  );

  const linesText = (patch.lines ?? original.lines).join("\n\n");
  const choices = patch.choices ?? original.choices;

  return (
    <aside className="safe-bottom pointer-events-auto absolute inset-x-0 bottom-0 z-30 max-h-[70dvh] overflow-y-auto border-t border-border bg-ink/94 px-3 py-3 shadow-lg backdrop-blur-md sm:inset-x-auto sm:bottom-6 sm:right-4 sm:max-h-[80dvh] sm:w-[24rem] sm:rounded-xl sm:border">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold">Spielleiter</p>
          <p className="text-[11px] text-muted-fg">
            Nur diese Karte. Wahl-Anzahl bleibt {original.choices.length}, sonst bricht der Lauf.
          </p>
        </div>
        <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onClose}>
          Schließen
        </Button>
      </div>

      <label className="mb-2 block text-xs text-muted-fg">
        Titel
        <input
          className="mt-1 w-full rounded-sm border border-border bg-surface px-2 py-1.5 text-sm text-fg"
          value={patch.title ?? original.title}
          onChange={(event) => onChange({ ...patch, title: event.target.value })}
        />
      </label>

      <div className="mb-2 grid grid-cols-2 gap-2">
        <label className="text-xs text-muted-fg">
          Bild
          <select
            className="mt-1 w-full rounded-sm border border-border bg-surface px-2 py-1.5 text-sm text-fg"
            value={patch.art ?? original.art}
            onChange={(event) => onChange({ ...patch, art: event.target.value as ArtKey })}
          >
            {ART_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted-fg">
          Portrait
          <select
            className="mt-1 w-full rounded-sm border border-border bg-surface px-2 py-1.5 text-sm text-fg"
            value={patch.portrait === null ? "" : (patch.portrait ?? original.portrait ?? "")}
            onChange={(event) => {
              const value = event.target.value;
              onChange({ ...patch, portrait: value ? (value as PortraitKey) : null });
            }}
          >
            <option value="">keins</option>
            {PORTRAIT_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mb-2 block text-xs text-muted-fg">
        Eigenes Bild (URL, optional)
        <input
          className="mt-1 w-full rounded-sm border border-border bg-surface px-2 py-1.5 text-sm text-fg"
          placeholder="/art/chapel.jpg oder https://…"
          value={patch.artSrc ?? ""}
          onChange={(event) => onChange({ ...patch, artSrc: event.target.value })}
        />
      </label>

      <label className="mb-2 block text-xs text-muted-fg">
        Text — eine Leerzeile trennt Absätze
        <textarea
          className="mt-1 min-h-36 w-full rounded-sm border border-border bg-surface px-2 py-1.5 text-sm leading-relaxed text-fg"
          value={linesText}
          onChange={(event) =>
            onChange({
              ...patch,
              lines: event.target.value
                .split(/\n\s*\n/)
                .map((line) => line.replace(/\n/g, " ").trim())
                .filter(Boolean),
            })
          }
        />
      </label>

      <div className="mb-3 space-y-1.5">
        <p className="text-xs text-muted-fg">Wahlen (Reihenfolge = Logik)</p>
        {original.choices.map((_, index) => (
          <input
            key={index}
            className="w-full rounded-sm border border-border bg-surface px-2 py-1.5 text-sm text-fg"
            value={choices[index] ?? original.choices[index]}
            onChange={(event) => {
              const next = [...(patch.choices ?? original.choices)];
              next[index] = event.target.value;
              onChange({ ...patch, choices: next });
            }}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" className="h-9 px-3 text-xs" onClick={onReset}>
          Karte zurücksetzen
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="h-9 px-3 text-xs"
          onClick={() => void navigator.clipboard.writeText(exportText)}
        >
          Patch kopieren
        </Button>
      </div>
      <p className="mt-2 text-[11px] text-subtle-fg">
        Gespeichert im Browser unter {schluessel}. Ins Spiel kommt der Text erst, wenn er in der Quest-Datei landet.
      </p>
    </aside>
  );
}
