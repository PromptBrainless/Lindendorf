import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Dices,
  Download,
  GitBranch,
  Image as ImageIcon,
  Map,
  Route,
  ScanSearch,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ART } from "@/game/art";
import { pruefeAssets, type AssetBefund } from "@/game/editor-assets";
import { FLUSS, knoten, toteFlussKnoten, unbekannteKanten } from "@/game/editor-fluss";
import { QUEST_PFADE, probePfad } from "@/game/editor-quests";
import { exportiereIntro } from "@/game/content";
import { exportiereLager, exportiereLagerWege } from "@/game/lager-content";
import { LEICHT, MITTEL, SCHWER, cloneHeld, createHeld, type Held } from "@/game/types";
import { probe } from "@/game/engine";
import { KNOWLEDGE_META, deriveKnowledge, knowledgeLabels, type KnowledgeKey } from "@/game/knowledge";
import { hatEffekt, setzeEffekt } from "@/game/effekte";
import { rufListe } from "@/game/reputation";
import { synchronisiereLog } from "@/game/taten";

type Fach = "fluss" | "probe" | "wissen" | "quest" | "netz" | "assets" | "export";

const FAECHER: { id: Fach; titel: string; icon: typeof Map }[] = [
  { id: "fluss", titel: "Fluss", icon: Map },
  { id: "probe", titel: "Probe", icon: Dices },
  { id: "wissen", titel: "Wissen", icon: BookOpen },
  { id: "quest", titel: "Pfade", icon: Route },
  { id: "netz", titel: "Tote Knoten", icon: GitBranch },
  { id: "assets", titel: "Bilder", icon: ImageIcon },
  { id: "export", titel: "Module", icon: Download },
];

const FLAGGEN: Array<{ key: keyof Held; label: string }> = [
  { key: "holmBesucht", label: "Holm besucht" },
  { key: "auftragErhalten", label: "Auftrag" },
  { key: "artefaktErhalten", label: "Artefakt" },
  { key: "sannaGeholfen", label: "Sanna" },
  { key: "glockeGestoppt", label: "Glocke still" },
  { key: "muehleBesucht", label: "Mühle" },
  { key: "truebungBestaetigt", label: "Trübung" },
  { key: "gasseBesucht", label: "Gasse" },
  { key: "maraGeholfen", label: "Mara" },
  { key: "banditenGewarnt", label: "Gewarnt" },
];

function ladeDatei(datei: File): Promise<string> {
  return datei.text();
}

function speichere(name: string, inhalt: string) {
  const blob = new Blob([inhalt], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function EditorApp() {
  const [fach, setFach] = useState<Fach>("fluss");
  const [ort, setOrt] = useState("intro");
  const [pfad, setPfad] = useState<string[]>(["intro"]);
  const [held, setHeld] = useState(() => createHeld("Werkstatt", 10, 10, 10));
  const [probeLage, setProbeLage] = useState<"klar" | "nebel">("klar");
  const [probeAttribut, setProbeAttribut] = useState<"Stärke" | "Geschicklichkeit" | "Charisma">("Stärke");
  const [probeZiel, setProbeZiel] = useState(MITTEL);
  const [probeErgebnis, setProbeErgebnis] = useState<string | null>(null);
  const [questId, setQuestId] = useState(QUEST_PFADE[0]!.id);
  const [questBefund, setQuestBefund] = useState<ReturnType<typeof probePfad> | null>(null);
  const [assets, setAssets] = useState<AssetBefund[] | null>(null);
  const [importText, setImportText] = useState("");
  const [importHinweis, setImportHinweis] = useState<string | null>(null);
  const [smoke, setSmoke] = useState<string[] | null>(null);

  const szene = knoten(ort) ?? FLUSS[0]!;
  const wissen = useMemo(() => {
    const n = cloneHeld(held);
    synchronisiereLog(n, "werkstatt");
    return { keys: [...deriveKnowledge(n)], labels: knowledgeLabels(n), ruf: rufListe(n) };
  }, [held]);

  function gehe(id: string) {
    setOrt(id);
    setPfad((alt) => [...alt, id]);
  }

  function wuerfle() {
    const wert = probeAttribut === "Stärke" ? held.staerke : probeAttribut === "Geschicklichkeit" ? held.geschick : held.charisma;
    const ergebnis = probe(held, probeAttribut, wert, probeZiel, "Werkstatt", probeLage === "nebel" ? "nebel" : undefined);
    setProbeErgebnis(
      `${ergebnis.wurf} + ${ergebnis.attributWert} = ${ergebnis.summe} gegen ${ergebnis.schwierigkeit} — ${ergebnis.erfolg ? "Erfolg" : "Fehlschlag"}`,
    );
  }

  async function assetsPruefen() {
    setAssets(await pruefeAssets());
  }

  function smokePruefen() {
    const zeilen: string[] = [];
    const tot = toteFlussKnoten();
    const kanten = unbekannteKanten();
    zeilen.push(tot.length ? `Tote Knoten: ${tot.join(", ")}` : "Fluss: keine toten Knoten.");
    zeilen.push(kanten.length ? `Unbekannte Kanten: ${kanten.join(", ")}` : "Kanten: alle Ziele existieren.");
    zeilen.push(`Wissensschlüssel: ${Object.keys(KNOWLEDGE_META).length}`);
    zeilen.push(`Questpfade: ${QUEST_PFADE.length}`);
    const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
    zeilen.push(overflow ? "Layout: horizontaler Überlauf." : `Layout: ${window.innerWidth}px, kein Überlauf.`);
    setSmoke(zeilen);
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-border px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-fg">Werkstatt</p>
            <h1 className="font-display text-2xl font-semibold">Editor — ohne das Spiel zu starten</h1>
          </div>
          <a href="/" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm text-fg">
            <ArrowLeft className="size-4" aria-hidden />
            Zum Spiel
          </a>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[13rem_1fr]">
        <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {FAECHER.map((item) => {
            const Icon = item.icon;
            const an = fach === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFach(item.id)}
                className={`flex min-h-11 min-w-28 items-center gap-2 rounded-md px-3 text-left text-sm ${an ? "bg-surface-2 text-fg" : "text-muted-fg"}`}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {item.titel}
              </button>
            );
          })}
        </nav>

        <main className="min-w-0 rounded-lg border border-border bg-surface p-4 sm:p-5">
          {fach === "fluss" ? (
            <section>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-fg">Szenenfluss</p>
              <h2 className="mt-1 font-display text-3xl">{szene.titel}</h2>
              <div className="relative mt-3 h-36 overflow-hidden rounded-md">
                <img src={ART[szene.art]} alt="" className="size-full object-cover" />
              </div>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-fg/90">
                {szene.zeilen.map((zeile) => (
                  <p key={zeile}>{zeile}</p>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {szene.weiter.map((kante) => (
                  <Button key={kante.id} variant="secondary" onClick={() => gehe(kante.id)}>
                    {kante.label}
                  </Button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-fg">Weg: {pfad.join(" → ")}</p>
            </section>
          ) : null}

          {fach === "probe" ? (
            <section>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-fg">W10</p>
              <h2 className="mt-1 font-display text-3xl">Probe wie im Spiel</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {(["Stärke", "Geschicklichkeit", "Charisma"] as const).map((name) => (
                  <Button key={name} variant={probeAttribut === name ? "default" : "secondary"} onClick={() => setProbeAttribut(name)}>
                    {name}
                  </Button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {[LEICHT, MITTEL, SCHWER].map((n) => (
                  <Button key={n} variant={probeZiel === n ? "default" : "secondary"} onClick={() => setProbeZiel(n)}>
                    Ziel {n}
                  </Button>
                ))}
                <Button variant={probeLage === "nebel" ? "default" : "secondary"} onClick={() => setProbeLage((v) => (v === "nebel" ? "klar" : "nebel"))}>
                  {probeLage === "nebel" ? "Nebel −2" : "Ohne Nebel"}
                </Button>
                <Button
                  variant={held.effekte.includes("erschoepfung") ? "default" : "secondary"}
                  onClick={() => {
                    const n = cloneHeld(held);
                    setzeEffekt(n, "erschoepfung", !hatEffekt(held, "erschoepfung"));
                    setHeld(n);
                  }}
                >
                  Erschöpfung
                </Button>
              </div>
              <Button className="mt-4" onClick={wuerfle}>
                Würfeln
              </Button>
              {probeErgebnis ? <p className="mt-3 text-sm text-accent">{probeErgebnis}</p> : null}
            </section>
          ) : null}

          {fach === "wissen" ? (
            <section>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-fg">Journal</p>
              <h2 className="mt-1 font-display text-3xl">Wissen simulieren</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {FLAGGEN.map((flag) => (
                  <Button
                    key={flag.key}
                    variant={held[flag.key] ? "default" : "secondary"}
                    onClick={() => {
                      const n = cloneHeld(held);
                      (n[flag.key] as boolean) = !held[flag.key];
                      setHeld(n);
                    }}
                  >
                    {flag.label}
                  </Button>
                ))}
              </div>
              <ul className="mt-4 space-y-1 text-sm">
                {wissen.labels.sicher.map((z) => (
                  <li key={z} className="text-ok">
                    {z}
                  </li>
                ))}
                {wissen.labels.offen.map((z) => (
                  <li key={z} className="text-muted-fg">
                    {z}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-fg">
                Keys: {wissen.keys.map((k) => KNOWLEDGE_META[k as KnowledgeKey]?.label ?? k).join(" · ") || "—"}
              </p>
              {wissen.ruf.length ? (
                <p className="mt-2 text-xs text-muted-fg">
                  Ruf: {wissen.ruf.map((r) => `${r.ziel} ${r.wert > 0 ? "+" : ""}${r.wert}`).join(" · ")}
                </p>
              ) : null}
            </section>
          ) : null}

          {fach === "quest" ? (
            <section>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-fg">Quest-Pfadtester</p>
              <h2 className="mt-1 font-display text-3xl">Ausgang ohne Durchspielen</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUEST_PFADE.map((item) => (
                  <Button key={item.id} variant={questId === item.id ? "default" : "secondary"} onClick={() => setQuestId(item.id)}>
                    {item.titel}
                  </Button>
                ))}
              </div>
              <Button className="mt-4" onClick={() => setQuestBefund(probePfad(questId))}>
                Pfad legen
              </Button>
              {questBefund ? (
                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    Weg {questBefund.held.loesungsweg ?? "—"} / Mühle {questBefund.held.loesungswegMuehle ?? "—"} / Brunnen{" "}
                    {questBefund.held.loesungswegBrunnen ?? "—"} / Gasse {questBefund.held.loesungswegGasse ?? "—"}
                  </p>
                  {questBefund.sicher.map((z) => (
                    <p key={z} className="text-ok">
                      {z}
                    </p>
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          {fach === "netz" ? (
            <section>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-fg">Dead-Node-Finder</p>
              <h2 className="mt-1 font-display text-3xl">Unreachable</h2>
              <Button className="mt-3" onClick={smokePruefen}>
                <ScanSearch className="size-4" aria-hidden />
                Netz und Layout prüfen
              </Button>
              {smoke ? (
                <ul className="mt-4 space-y-1 text-sm">
                  {smoke.map((z) => (
                    <li key={z}>{z}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-fg">Prüft den Editor-Fluss, nicht Playwright. Die mobile Spielprüfung bleibt im Abenteuer.</p>
              )}
            </section>
          ) : null}

          {fach === "assets" ? (
            <section>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-fg">Bildschlüssel</p>
              <h2 className="mt-1 font-display text-3xl">Hintergründe und Porträts</h2>
              <Button className="mt-3" onClick={() => void assetsPruefen()}>
                Dateien prüfen
              </Button>
              {assets ? (
                <ul className="mt-4 grid gap-1 text-sm sm:grid-cols-2">
                  {assets.map((item) => (
                    <li key={item.src} className={item.ok ? "text-ok" : "text-hp"}>
                      {item.art} {item.schluessel} — {item.ok ? "da" : "fehlt"}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}

          {fach === "export" ? (
            <section>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-fg">JSON</p>
              <h2 className="mt-1 font-display text-3xl">Module holen und lesen</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    const datei = exportiereIntro();
                    speichere(datei.dateiname, datei.inhalt);
                  }}
                >
                  <Download className="size-4" aria-hidden />
                  Intro
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const datei = exportiereLager();
                    speichere(datei.dateiname, datei.inhalt);
                  }}
                >
                  Lager-Hub
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const datei = exportiereLagerWege();
                    speichere(datei.dateiname, datei.inhalt);
                  }}
                >
                  Lager-Wege
                </Button>
              </div>
              <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-2 text-sm text-muted-fg">
                <Upload className="size-4" aria-hidden />
                JSON lesen
                <input
                  type="file"
                  accept="application/json"
                  className="sr-only"
                  onChange={async (event) => {
                    const datei = event.target.files?.[0];
                    if (!datei) return;
                    const text = await ladeDatei(datei);
                    setImportText(text);
                    try {
                      JSON.parse(text);
                      setImportHinweis(`${datei.name} gelesen. Schema prüft der Export beim Speichern; hier nur Syntax.`);
                    } catch (fehler) {
                      setImportHinweis(fehler instanceof Error ? fehler.message : "Ungültig");
                    }
                  }}
                />
              </label>
              {importHinweis ? <p className="mt-2 text-sm text-accent">{importHinweis}</p> : null}
              {importText ? (
                <pre className="mt-3 max-h-64 overflow-auto rounded-md bg-ink p-3 text-xs text-fg/80">{importText.slice(0, 4000)}</pre>
              ) : null}
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
