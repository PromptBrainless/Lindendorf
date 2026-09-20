import { useMemo, useState } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ART, PORTRAITS } from "@/game/art";
import { EFFEKT_IDS, EFFEKTE, effekteDerGruppe, hatEffekt, type EffektId } from "@/game/effekte";
import { HERKUNFT_FRAGEN } from "@/game/herkunft";
import { ladeSpielleiterBild } from "@/game/sl-upload";
import type { ArtKey, Held, PortraitKey, SceneView } from "@/game/types";
import type { KartePatch } from "@/game/spielleiter";

const ART_KEYS = Object.keys(ART) as ArtKey[];
const PORTRAIT_KEYS = Object.keys(PORTRAITS) as PortraitKey[];

function BildFeld({
  label,
  src,
  onSrc,
}: {
  label: string;
  src: string;
  onSrc: (src: string) => void;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setStatus(null);
    try {
      onSrc(await ladeSpielleiterBild(file));
      setStatus("Bild liegt auf dieser Karte.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Bild ließ sich nicht lesen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <label className="mb-2 block text-xs text-muted-fg">
      {label}
      <input
        className="mt-1 w-full rounded-sm border border-border bg-surface px-2 py-1.5 text-sm text-fg"
        placeholder="/art/chapel.jpg oder https://…"
        value={src}
        onChange={(event) => onSrc(event.target.value)}
      />
      <span className="mt-1 flex items-center gap-2">
        <span className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-sm border border-border bg-surface px-2 text-xs text-fg">
          <ImagePlus className="size-3.5" aria-hidden />
          Hochladen
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              void onFile(file);
            }}
          />
        </span>
        {src ? <img src={src} alt="" className="h-9 w-7 rounded-xs border border-border object-cover" /> : null}
        {status ? <span className="text-ok">{status}</span> : null}
      </span>
    </label>
  );
}

function EffektReihe({
  ids,
  an,
  onToggle,
}: {
  ids: EffektId[];
  an: (id: EffektId) => boolean;
  onToggle: (id: EffektId, wert: boolean) => void;
}) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      {ids.map((id) => {
        const aktiv = an(id);
        return (
          <Button
            key={id}
            type="button"
            variant={aktiv ? "default" : "secondary"}
            className="h-9 px-2.5 text-xs"
            title={EFFEKTE[id].hint}
            onClick={() => onToggle(id, !aktiv)}
          >
            {EFFEKTE[id].name}
          </Button>
        );
      })}
    </div>
  );
}

export function SpielleiterPanel({
  original,
  patch,
  schluessel,
  held,
  onChange,
  onReset,
  onClose,
  onEffekt,
  onLageVorlegen,
}: {
  original: SceneView;
  patch: KartePatch;
  schluessel: string;
  held: Held | null;
  onChange: (next: KartePatch) => void;
  onReset: () => void;
  onClose: () => void;
  onEffekt: (id: EffektId, an: boolean) => void;
  onLageVorlegen: (frageIndex: number) => void;
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
  const kartenEffekte = patch.effekte ?? [];
  const kartenFort = patch.effekteFort ?? [];
  const [lageWahl, setLageWahl] = useState(0);

  function toggleKarte(id: EffektId) {
    const next = kartenEffekte.includes(id)
      ? kartenEffekte.filter((item) => item !== id)
      : [...kartenEffekte, id];
    onChange({ ...patch, effekte: next.length ? next : undefined });
  }

  function toggleFort(id: EffektId) {
    const next = kartenFort.includes(id)
      ? kartenFort.filter((item) => item !== id)
      : [...kartenFort, id];
    onChange({ ...patch, effekteFort: next.length ? next : undefined });
  }

  return (
    <aside className="safe-bottom pointer-events-auto absolute inset-x-0 bottom-0 z-30 max-h-[70dvh] overflow-y-auto border-t border-border bg-ink/94 px-3 py-3 shadow-lg backdrop-blur-md sm:inset-x-auto sm:bottom-6 sm:right-4 sm:max-h-[80dvh] sm:w-[24rem] sm:rounded-xl sm:border">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold">Spielleiter</p>
          <p className="text-xs text-muted-fg">
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

      <BildFeld
        label="Eigenes Bild — URL oder Datei"
        src={patch.artSrc ?? ""}
        onSrc={(artSrc) => onChange({ ...patch, artSrc })}
      />
      <BildFeld
        label="Eigenes Portrait — URL oder Datei"
        src={patch.portraitSrc ?? ""}
        onSrc={(portraitSrc) => onChange({ ...patch, portraitSrc })}
      />

      <div className="mb-3">
        <p className="text-xs text-muted-fg">Gunst — Bonus auf Proben</p>
        <EffektReihe ids={effekteDerGruppe("gunst")} an={(id) => hatEffekt(held, id)} onToggle={onEffekt} />
        <p className="mt-2 text-xs text-muted-fg">Last — Malus auf Proben</p>
        <EffektReihe ids={effekteDerGruppe("last")} an={(id) => hatEffekt(held, id)} onToggle={onEffekt} />
        <p className="mt-2 text-xs text-muted-fg">An dieser Karte festmachen</p>
        <EffektReihe
          ids={EFFEKT_IDS}
          an={(id) => kartenEffekte.includes(id)}
          onToggle={(id, wert) => {
            if (wert === kartenEffekte.includes(id)) return;
            toggleKarte(id);
          }}
        />
        <p className="mt-2 text-xs text-muted-fg">Beim Verlassen dieser Karte abnehmen</p>
        <EffektReihe
          ids={EFFEKT_IDS}
          an={(id) => kartenFort.includes(id)}
          onToggle={(id, wert) => {
            if (wert === kartenFort.includes(id)) return;
            toggleFort(id);
          }}
        />
        <p className="mt-1 text-xs text-subtle-fg">
          Jedes Mal ist Gunst oder Last. Grün hebt, rot drückt. Die Probe nimmt den geänderten Wert.
        </p>
      </div>

      <div className="mb-3">
        <p className="text-xs text-muted-fg">Lage dem Helden vorlegen</p>
        <div className="mt-1.5 flex gap-2">
          <select
            className="h-11 min-w-0 flex-1 rounded-sm border border-border bg-surface px-2 text-sm text-fg"
            value={lageWahl}
            onChange={(event) => setLageWahl(Number(event.target.value))}
          >
            {HERKUNFT_FRAGEN.map((frage, index) => (
              <option key={frage.id} value={index}>
                {frage.titel}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="secondary"
            className="h-11 shrink-0 px-3 text-xs"
            onClick={() => onLageVorlegen(lageWahl)}
          >
            Vorlegen
          </Button>
        </div>
        <p className="mt-1 text-xs text-subtle-fg">Er sieht die Geschichte und wählt. Die Antwort setzt den Zustand.</p>
      </div>

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
      <p className="mt-2 text-xs text-subtle-fg">
        Gespeichert im Browser unter {schluessel}. Ins Spiel kommt der Text erst, wenn er in der Quest-Datei landet.
      </p>
    </aside>
  );
}
