import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ART } from "@/game/art";
import { createHeld, type Held } from "@/game/types";

function Stepper({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface/70 px-3 py-2.5">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-muted-fg">{hint}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          className="size-11 p-0"
          aria-label={`${label} verringern`}
          onClick={() => onChange(Math.max(1, value - 1))}
        >
          <Minus className="size-4" />
        </Button>
        <span className="w-8 text-center font-display text-2xl tabular-nums">{value}</span>
        <Button
          type="button"
          variant="secondary"
          className="size-11 p-0"
          aria-label={`${label} erhöhen`}
          onClick={() => onChange(Math.min(10, value + 1))}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function CreateHero({
  onReady,
  onBack,
}: {
  onReady: (held: Held) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [staerke, setStaerke] = useState(5);
  const [geschick, setGeschick] = useState(5);
  const [charisma, setCharisma] = useState(5);

  return (
    <div className="relative min-h-dvh overflow-x-hidden overflow-y-auto bg-bg text-fg">
      <img src={ART.road} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/35" />
      <div className="safe-bottom relative z-10 mx-auto flex min-h-dvh max-w-xl flex-col justify-end px-5 py-8 sm:justify-center">
        <div className="rounded-xl border border-border bg-ink/80 p-5 shadow-sm backdrop-blur-md sm:p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">Heldenerstellung</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Aufbruch</h1>
          <p className="mt-3 text-sm text-fg/90">
            In Lindendorf braucht man keinen Auserwählten. Man braucht jemanden, der geht, wenn
            andere bleiben. Es gibt kein Punktelimit — aber 3 in allem ist ein anderer Held als
            9/2/2.
          </p>

          <label className="mt-5 block text-sm text-muted-fg" htmlFor="hero-name">
            Name
          </label>
          <Input
            id="hero-name"
            className="mt-1.5"
            placeholder="Namenlos"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={24}
            autoComplete="off"
          />

          <div className="mt-4 grid gap-2">
            <Stepper label="Stärke" hint="Kraft, Kampf, Hindernisse" value={staerke} onChange={setStaerke} />
            <Stepper
              label="Geschicklichkeit"
              hint="Schleichen, Spuren, Fingerfertigkeit"
              value={geschick}
              onChange={setGeschick}
            />
            <Stepper
              label="Charisma"
              hint="Reden, Lügen, Vertrauen"
              value={charisma}
              onChange={setCharisma}
            />
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Button
              size="lg"
              onClick={() => onReady(createHeld(name, staerke, geschick, charisma))}
            >
              Nach Lindendorf
            </Button>
            <Button variant="secondary" size="lg" onClick={onBack}>
              Zurück
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
