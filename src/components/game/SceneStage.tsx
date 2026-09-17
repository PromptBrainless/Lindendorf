import { Dices } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ART, PORTRAITS } from "@/game/art";
import type { SceneView } from "@/game/types";
import { Hud } from "./Hud";

export function SceneStage({
  view,
  onChoose,
  onSave,
}: {
  view: SceneView;
  onChoose: (index: number) => void;
  onSave: () => void;
}) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const n = Number(event.key);
      if (n >= 1 && n <= view.choices.length) onChoose(n - 1);
      if (event.key === "Enter" && view.choices.length === 1) onChoose(0);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onChoose, view.choices.length]);

  return (
    <div className="relative isolate min-h-dvh overflow-x-hidden overflow-y-auto bg-bg text-fg">
      <img
        src={ART[view.art]}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/20" />
      {view.held ? <Hud held={view.held} onSave={onSave} /> : null}

      <div className="safe-bottom relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col justify-end gap-3 px-3 pb-6 pt-32 sm:gap-4 sm:px-6 sm:pb-8 sm:pt-28">
        <div className="flex items-end gap-4">
          {view.portrait ? (
            <img
              src={PORTRAITS[view.portrait]}
              alt=""
              className="hidden h-36 w-24 shrink-0 rounded-lg border border-border object-cover shadow-sm sm:block sm:h-44 sm:w-28"
            />
          ) : null}
          <div className="min-w-0 flex-1 rounded-xl border border-border bg-ink/82 p-3.5 shadow-lg backdrop-blur-md sm:p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                {view.title}
              </h2>
              {view.portrait ? (
                <img
                  src={PORTRAITS[view.portrait]}
                  alt=""
                  className="h-14 w-10 rounded-md border border-border object-cover sm:hidden"
                />
              ) : null}
            </div>

            {view.probe ? (
              <div className="mb-3 flex items-start gap-2 rounded-md border border-border bg-surface/80 px-3 py-2 text-sm">
                <Dices className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <div>
                  <p>
                    Probe{view.probe.beschreibung ? ` (${view.probe.beschreibung})` : ""}:{" "}
                    {view.probe.attributName} {view.probe.attributWert} + W10 ({view.probe.wurf}) ={" "}
                    <span className="tabular-nums">{view.probe.summe}</span> gegen{" "}
                    {view.probe.schwierigkeit}
                  </p>
                  <p className={view.probe.erfolg ? "text-ok" : "text-hp"}>
                    {view.probe.erfolg ? "Erfolg." : "Misserfolg."}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="space-y-2.5 text-sm leading-relaxed text-fg sm:text-base">
              {view.lines.map((line, index) => (
                <p key={`${index}-${line.slice(0, 24)}`}>{line}</p>
              ))}
            </div>

            {view.log?.length ? (
              <div className="mt-3 space-y-1 text-sm text-accent">
                {view.log.map((line, index) => (
                  <p key={`${index}-${line.slice(0, 24)}`}>{line}</p>
                ))}
              </div>
            ) : null}

            {view.ending ? (
              <p className="mt-4 font-display text-lg italic text-accent sm:text-xl">
                Ende: {view.ending}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2">
          {view.choices.map((label, index) => (
            <Button
              key={`${index}-${label}`}
              variant="choice"
              size="choice"
              onClick={() => onChoose(index)}
            >
              <span className="mr-2 inline-flex size-6 shrink-0 items-center justify-center rounded-xs border border-border text-xs text-muted-fg tabular-nums">
                {index + 1}
              </span>
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
