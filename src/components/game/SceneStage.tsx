import { Dices, PenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ART, PORTRAITS } from "@/game/art";
import { commitPack, mergedPack, patchCount, upsertPatch } from "@/game/text-pack";
import type { KartePatch } from "@/game/spielleiter";
import type { SceneView } from "@/game/types";
import { Hud } from "./Hud";
import { KnowledgeJournal } from "./KnowledgeJournal";
import { SpielleiterPanel } from "./SpielleiterPanel";

export function SceneStage({
  view,
  original,
  onChoose,
  onSave,
  saveMessage,
  onKnowledge,
  knowledgeOpen,
  debug,
  leiterOpen,
  patch,
  schluessel,
  onLeiter,
  onPatch,
  onResetKarte,
  authorMode,
}: {
  view: SceneView;
  original: SceneView;
  onChoose: (index: number) => void;
  onSave: () => void;
  saveMessage: string | null;
  onKnowledge: () => void;
  knowledgeOpen: boolean;
  debug: boolean;
  leiterOpen: boolean;
  patch: KartePatch;
  schluessel: string;
  onLeiter: () => void;
  onPatch: (next: KartePatch) => void;
  onResetKarte: () => void;
  authorMode: boolean;
}) {
  const karte = view.original ?? { title: original.title, lines: original.lines, choices: original.choices };
  const [title, setTitle] = useState(view.title);
  const [body, setBody] = useState(view.lines.join("\n"));
  const [choices, setChoices] = useState(view.choices);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setTitle(view.title);
    setBody(view.lines.join("\n"));
    setChoices(view.choices);
    setStatus(null);
  }, [view.textKey, view.title, view.lines, view.choices]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (leiterOpen) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT")) return;
      const n = Number(event.key);
      if (n >= 1 && n <= view.choices.length) onChoose(n - 1);
      if (event.key === "Enter" && view.choices.length === 1 && !authorMode) onChoose(0);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authorMode, leiterOpen, onChoose, view.choices.length]);

  function remember() {
    const lines = body
      .split("\n")
      .map((line) => line.trimEnd())
      .filter((line, i, all) => line.length > 0 || i < all.length - 1);
    const nextChoices = choices.map((label, i) => label.trim() || karte.choices[i]);
    const pack = upsertPatch(karte, {
      title: title.trim() || karte.title,
      lines: lines.length ? lines : karte.lines,
      choices: nextChoices,
    });
    setStatus("Auf dieser Karte gemerkt.");
    return pack;
  }

  async function übernehmen() {
    const pack = remember();
    if (!pack || patchCount(pack) === 0) {
      setStatus("Kein geänderter Satz auf dieser oder einer früheren Karte.");
      return;
    }
    setBusy(true);
    try {
      const result = await commitPack(pack, false);
      if (!result.ok) setStatus(result.error ? `Übernehmen fehlgeschlagen: ${result.error}` : "Übernehmen ist fehlgeschlagen.");
      else setStatus(`Gespeichert. ${patchCount(pack)} Karten gelten ab jetzt im Spiel.`);
    } catch (err) {
      setStatus(`Übernehmen ist fehlgeschlagen${err instanceof Error ? `: ${err.message}` : "."}`);
    } finally {
      setBusy(false);
    }
  }

  const hintergrund = view.artSrc || ART[view.art];
  const portrait = view.portraitSrc || (view.portrait ? PORTRAITS[view.portrait] : "");

  return (
    <div className="relative isolate min-h-dvh overflow-x-hidden overflow-y-auto bg-bg text-fg">
      <img src={hintergrund} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/20" />
      {view.held ? (
        <Hud
          held={view.held}
          onSave={onSave}
          saveMessage={saveMessage}
          onKnowledge={onKnowledge}
          onLeiter={onLeiter}
          leiterOpen={leiterOpen}
        />
      ) : null}
      {knowledgeOpen && view.held ? <KnowledgeJournal held={view.held} debug={debug} onClose={onKnowledge} /> : null}

      <div className="safe-bottom relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col justify-end gap-3 px-3 pb-6 pt-32 sm:gap-4 sm:px-6 sm:pb-8 sm:pt-28">
        {authorMode ? (
          <div className="flex flex-col gap-2 rounded-lg border border-accent/40 bg-ink/90 px-3 py-2.5 text-xs text-fg shadow-lg sm:flex-row sm:items-center sm:justify-between sm:text-sm">
            <p className="inline-flex items-center gap-2">
              <PenLine className="size-3.5 text-accent" aria-hidden />
              Textmodus. {patchCount(mergedPack())} Karten merken auf Übernehmen.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" disabled={busy} onClick={remember}>
                Karte merken
              </Button>
              <Button disabled={busy} onClick={() => void übernehmen()}>
                In den Spieltext übernehmen
              </Button>
            </div>
          </div>
        ) : null}
        <div className="flex items-end gap-4">
          {portrait ? (
            <img
              src={portrait}
              alt=""
              className="hidden h-36 w-24 shrink-0 rounded-lg border border-border object-cover shadow-sm sm:block sm:h-44 sm:w-28"
            />
          ) : null}
          <div className="min-w-0 flex-1 rounded-xl border border-border bg-ink/82 p-3.5 shadow-lg backdrop-blur-md sm:p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              {authorMode ? (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={remember}
                  className="w-full rounded-sm border border-border bg-ink/70 px-2 py-1 font-display text-xl font-semibold tracking-tight text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-2xl"
                  aria-label="Kartentitel"
                />
              ) : (
                <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{view.title}</h2>
              )}
              {portrait ? (
                <img src={portrait} alt="" className="h-14 w-10 rounded-md border border-border object-cover sm:hidden" />
              ) : null}
            </div>

            {view.probe ? (
              <div className="mb-3 flex items-start gap-2 rounded-md border border-border bg-surface/80 px-3 py-2 text-sm" role="status" aria-live="polite">
                <Dices className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <div>
                  <p>
                    Probe{view.probe.beschreibung ? ` (${view.probe.beschreibung})` : ""}:{" "}
                    {view.probe.attributName} {view.probe.attributWert} + W10 ({view.probe.wurf}) ={" "}
                    <span className="tabular-nums">{view.probe.summe}</span> gegen {view.probe.schwierigkeit}
                  </p>
                  <p className={view.probe.erfolg ? "text-ok" : "text-hp"}>{view.probe.erfolg ? "Erfolg." : "Misserfolg."}</p>
                </div>
              </div>
            ) : null}

            {authorMode ? (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onBlur={remember}
                rows={Math.max(4, view.lines.length + 1)}
                className="w-full resize-y rounded-sm border border-border bg-ink/70 px-3 py-2 text-sm leading-relaxed text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-base"
                aria-label="Kartentext"
              />
            ) : (
              <div className="space-y-2.5 text-sm leading-relaxed text-fg sm:text-base">
                {view.lines.map((line, index) => (
                  <p key={`${index}-${line.slice(0, 24)}`}>{line}</p>
                ))}
              </div>
            )}

            {view.log?.length ? (
              <div className="mt-3 space-y-1 text-sm text-accent">
                {view.log.map((line, index) => (
                  <p key={`${index}-${line.slice(0, 24)}`}>{line}</p>
                ))}
              </div>
            ) : null}

            {view.ending ? (
              <p className="mt-4 font-display text-lg italic text-accent sm:text-xl">Ende: {view.ending}</p>
            ) : null}

            {authorMode && status ? <p className="mt-3 text-sm text-accent">{status}</p> : null}
          </div>
        </div>

        <div className="grid gap-2">
          {authorMode
            ? karte.choices.map((label, index) => (
                <div key={`edit-${index}`} className="flex items-center gap-2">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xs border border-border text-xs text-muted-fg tabular-nums">
                    {index + 1}
                  </span>
                  <input
                    value={choices[index] ?? label}
                    onChange={(e) => {
                      const next = [...choices];
                      next[index] = e.target.value;
                      setChoices(next);
                    }}
                    onBlur={remember}
                    className="h-11 min-w-0 flex-1 rounded-sm border border-border bg-ink/70 px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Wahl ${index + 1}`}
                  />
                  <Button variant="choice" size="choice" className="w-auto shrink-0 px-3" onClick={() => onChoose(index)}>
                    Gehen
                  </Button>
                </div>
              ))
            : view.choices.map((label, index) => (
                <Button key={`${index}-${label}`} variant="choice" size="choice" onClick={() => onChoose(index)}>
                  <span className="mr-2 inline-flex size-6 shrink-0 items-center justify-center rounded-xs border border-border text-xs text-muted-fg tabular-nums">
                    {index + 1}
                  </span>
                  {label}
                </Button>
              ))}
        </div>
      </div>

      {leiterOpen ? (
        <SpielleiterPanel
          original={original}
          patch={patch}
          schluessel={schluessel}
          onChange={onPatch}
          onReset={onResetKarte}
          onClose={onLeiter}
        />
      ) : null}
    </div>
  );
}
