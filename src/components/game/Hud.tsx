import { BookOpen, Coins, FlaskConical, Heart, KeyRound, Save, ScrollText } from "lucide-react";
import { HEILTRANK, MAX_LP, SCHLUESSEL, type Held } from "@/game/types";
import { Button } from "@/components/ui/button";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-1 tabular-nums">
      <span className="text-muted-fg">{label}</span>
      <span className="text-fg">{value}</span>
    </span>
  );
}

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
  const flags: string[] = [];
  if (held.verwundet) flags.push("verwundet");
  if (held.banditenGewarnt) flags.push("gewarnt");
  if (held.buergermeisterVertraut) flags.push("vertraut");

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
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-fg">
          <Stat label="ST" value={held.staerke} />
          <Stat label="GE" value={held.geschick} />
          <Stat label="CH" value={held.charisma} />
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
        {flags.length ? <p className="text-subtle-fg sm:max-w-40 sm:text-right">{flags.join(" · ")}</p> : null}
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
