import { EFFEKTE, heldEffekte } from "@/game/effekte";
import type { EffektId, Held } from "@/game/types";
import { ZustandLeiste } from "./ZustandLeiste";

function Chip({ id, vor }: { id: EffektId; vor: "+" | "−" }) {
  const item = EFFEKTE[id];
  const gunst = item.gruppe === "gunst";
  return (
    <span
      className={`rounded-xs border px-1.5 py-0.5 text-xs ${
        gunst ? "border-ok/40 text-ok" : "border-hp/40 text-hp"
      }`}
    >
      {vor} {item.name}
    </span>
  );
}

export function SeitenFuss({
  held,
  hinzu,
  nimmt,
  fort,
  kompakt = false,
}: {
  held?: Held;
  hinzu?: EffektId[];
  nimmt?: EffektId[];
  fort?: EffektId[];
  kompakt?: boolean;
}) {
  if (!held) return null;
  const aktiv = heldEffekte(held);
  const legt = hinzu?.length ? hinzu : [];
  const nimmtListe = nimmt?.length ? nimmt : [];
  const faellt = fort?.length ? fort : [];

  return (
    <div className={kompakt ? "mt-2" : "mt-4 border-t border-border pt-3"}>
      {kompakt ? null : <ZustandLeiste held={held} />}
      {legt.length || nimmtListe.length || faellt.length ? (
        <div className="mt-1 space-y-1.5 text-xs text-muted-fg">
          {legt.length ? (
            <p className="flex flex-wrap items-center gap-1">
              <span>Dieser Ort legt auf</span>
              {legt.map((id) => (
                <Chip key={`h-${id}`} id={id} vor="+" />
              ))}
            </p>
          ) : null}
          {nimmtListe.length ? (
            <p className="flex flex-wrap items-center gap-1">
              <span>Dieser Ort nimmt</span>
              {nimmtListe.map((id) => (
                <Chip key={`n-${id}`} id={id} vor="−" />
              ))}
            </p>
          ) : null}
          {faellt.length ? (
            <p className="flex flex-wrap items-center gap-1">
              <span>Wenn du gehst, fällt</span>
              {faellt.map((id) => (
                <Chip key={`f-${id}`} id={id} vor="−" />
              ))}
            </p>
          ) : null}
        </div>
      ) : aktiv.length ? null : (
        <p className="mt-1 text-xs text-subtle-fg">Kein Zustand auf dieser Seite.</p>
      )}
    </div>
  );
}
