import { BookOpen, Coins, FlaskConical, Heart, KeyRound, Save, ScrollText } from "lucide-react";
import { HEILTRANK, MAX_LP, SCHLUESSEL, type Held } from "@/game/types";
import { werteMitEffekt } from "@/game/effekte";
import { Button } from "@/components/ui/button";

export function Hud({
  held,
  onSave,
  saveMessage,
  onKnowledge,
  onLeiter,
  leiterOpen,
}: {
  held: Held;
  onSave: () => void;
  saveMessage: string | null;
  onKnowledge: () => void;
  onLeiter: () => void;
  leiterOpen: boolean;
}) {
  const hpPct = Math.max(0, Math.min(100, (held.lp / MAX_LP) * 100));
  const werte = werteMitEffekt(held);

  return (
    <div className="safe-top pointer-events-none absolute inset-x-0 top-0 z-20 p-3 sm:p-4">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 rounded-lg border border-border bg-ink/82 px-3 py-2.5 text-xs text-fg shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:gap-4 sm:text-sm">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate font-display text-base font-semibold tracking-tight sm:text-lg">{held.name}</p>
            <span className="inline-flex items-center gap-1.5 tabular-nums text-muted-fg">
              <Heart className="size-3.5 text-hp" aria-hidden />
              {held.lp}/{MAX_LP}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-hp transition-[width] duration-[var(--motion-fast)]"
              style={{ width: `${hpPct}%` }}
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-muted-fg">
          <span className="inline-flex items-center gap-1 tabular-nums">
            <span className="text-muted-fg">ST</span>
            <span className={werte.staerke === held.staerke ? "text-fg" : werte.staerke > held.staerke ? "text-ok" : "text-hp"}>
              {werte.staerke}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <span className="text-muted-fg">GE</span>
            <span className={werte.geschick === held.geschick ? "text-fg" : werte.geschick > held.geschick ? "text-ok" : "text-hp"}>
              {werte.geschick}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <span className="text-muted-fg">CH</span>
            <span className={werte.charisma === held.charisma ? "text-fg" : werte.charisma > held.charisma ? "text-ok" : "text-hp"}>
              {werte.charisma}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Coins className="size-3.5" aria-hidden />
            {held.gold}
          </span>
          {held.inventar.includes(HEILTRANK) ? (
            <span className="inline-flex items-center gap-1">
              <FlaskConical className="size-3.5" aria-hidden />
              Trank
            </span>
          ) : null}
          {held.inventar.includes(SCHLUESSEL) ? (
            <span className="inline-flex items-center gap-1">
              <KeyRound className="size-3.5" aria-hidden />
              Schlüssel
            </span>
          ) : null}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="default"
          className="pointer-events-auto h-9 shrink-0 px-2 text-xs sm:px-3"
          onClick={onSave}
          title="Spielstand speichern"
        >
          <Save className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">Speichern</span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="default"
          className="pointer-events-auto h-9 shrink-0 px-2 text-xs sm:px-3"
          onClick={onKnowledge}
          title="Wissenstagebuch öffnen"
        >
          <BookOpen className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">Wissen</span>
        </Button>
        <Button
          type="button"
          variant={leiterOpen ? "default" : "secondary"}
          size="default"
          className="pointer-events-auto h-9 shrink-0 px-2 text-xs sm:px-3"
          onClick={onLeiter}
          title="Spielleiter-Modus (Alt+S)"
        >
          <ScrollText className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">Spielleiter</span>
        </Button>
        {saveMessage ? (
          <p className="text-[11px] text-ok sm:max-w-52" aria-live="polite">
            {saveMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
