import { BookOpen, FolderOpen, Play, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ART } from "@/game/art";

export function TitleScreen({
  onStart,
  onRules,
  onLoad,
  canLoad,
}: {
  onStart: () => void;
  onRules: () => void;
  onLoad: () => void;
  canLoad: boolean;
}) {
  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-bg text-fg">
      <img src={ART.title} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/25" />
      <div className="safe-bottom relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col justify-end px-5 pb-12 pt-16 sm:justify-center sm:pb-0">
        <p className="mb-2 text-xs uppercase tracking-[0.28em] text-accent">How to be a Hero</p>
        <h1 className="font-display text-5xl font-semibold leading-none tracking-tight sm:text-6xl">
          Lindendorf
        </h1>
        <p className="mt-4 max-w-md text-base text-fg/90">
          Ein kurzes Textabenteuer mit Würfelproben. Wenige Attribute, W10, Entscheidungen mit
          Konsequenzen — jetzt als illustriertes Spiel.
        </p>
        <div className="mt-8 grid gap-2">
          <Button size="lg" onClick={onStart}>
            <Play className="size-4" aria-hidden />
            Abenteuer starten
          </Button>
          {canLoad ? (
            <Button variant="secondary" size="lg" onClick={onLoad}>
              <FolderOpen className="size-4" aria-hidden />
              Spielstand laden
            </Button>
          ) : null}
          <Button variant="secondary" size="lg" onClick={onRules}>
            <ScrollText className="size-4" aria-hidden />
            Kurzregeln lesen
          </Button>
        </div>
        <p className="mt-6 inline-flex items-center gap-2 text-xs text-muted-fg">
          <BookOpen className="size-3.5" aria-hidden />
          Vertical Slice 0.1 — Dorf, Wald, Steinbruch
        </p>
      </div>
    </div>
  );
}
