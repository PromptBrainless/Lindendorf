# Lindendorf – Technischer Erweiterungsplan (Rohfassung)

**Nicht mehr führen.** Gültige Reihenfolge, Ist-Stand und nächster Schritt:
`docs/ERNEUERUNGSPLAN.md`.

Diese Datei bleibt als Quelle der Schemas und der 15-Schritte-Liste.
Bekannte Abweichung: Mühle, Brunnen und Kesseljahr sind bereits Module
(`quest-*.ts`), nicht mehr nur `script.ts`.

---


Repo: `PromptBrainless/SpielVersion1.0` (React/TypeScript, Vite, Tailwind, Zod)

**Leitprinzip dieser Version:** Jeder Schritt muss für sich allein sicher und spielbar bleiben. Reihenfolge ist danach sortiert, was am wenigsten riskiert, das Bestehende zu brechen — nicht danach, was am spannendsten ist.

---

## 0. Analyse des bestehenden Projekts (unverändert gültig)

| Datei | Reales Muster |
|---|---|
| `src/game/types.ts` | Flaches `Held`-Objekt, Zustände als Boolean-Flags/Enums direkt am Held |
| `src/game/knowledge.ts` | `KnowledgeKey`-Union + `deriveKnowledge(held)` berechnet Wissen rein aus Held-Flags |
| `src/game/save.ts` | localStorage, `loadGame()` merged mit `createHeld()`-Defaults — neue Felder werden automatisch aufgefüllt |
| `src/game/content.ts` | Nur der Intro-Teil ist Zod-Schema-basiert; Dorf/Mühle/Brunnen/Lager stecken noch als Code in `script.ts` |
| `src/game/script.ts` | Szenenfluss als verkettete `async function`, Proben über `probe()` mit `LEICHT/MITTEL/SCHWER` |

---

## 1. Gesamt-Roadmap mit Risiko-Bewertung

Alles, was wir bisher besprochen haben, in eine Reihenfolge gebracht. Spalte "Risiko" = Wahrscheinlichkeit, etwas Bestehendes zu brechen. Spalte "Relevanz" = wie sehr hängt Späteres davon ab.

| # | Schritt | Risiko | Relevanz | Abhängigkeit |
|---|---|---|---|---|
| 1 | `HeldSchema` (Zod) für Save-Validierung | niedrig | hoch (Sicherheitsnetz für alles Folgende) | keine |
| 2 | Entscheidungs-Log (`entscheidungen: Entscheidung[]` am Held) | niedrig | hoch (Fundament für Ruf + Erinnerung) | 1 |
| 3 | Wissens-Metadaten (`KNOWLEDGE_META`) | sehr niedrig | mittel (nur Editor-Anzeige, kein Gameplay) | keine |
| 4 | Situationsmodifikatoren bei Proben (Nebel/Erschöpfung) | niedrig | mittel | keine |
| 5 | Ruf als abgeleitete Funktion (`rufAus()`) über das Log | niedrig | hoch | 2 |
| 6 | Erinnerungsmarken als gefilterte Log-Einträge | niedrig | hoch | 2 |
| 7 | Minimaler Dead-Node-Finder + Pfad-Simulation | niedrig | hoch **ab hier**, da Schritt 8 ihn braucht | keine, aber zeitlich vor 8 |
| 8 | Banditenlager-Content nach `content.ts`-Muster extrahieren | **mittel-hoch** | hoch (Voraussetzung für sauberes Wegesystem + Editor) | 7 als Regressionsschutz |
| 9 | Wegesystem-Erweiterung (Hybrid/Wissens/moralische Wege) | niedrig, wenn nach 8 | mittel | 8 (sauber) oder als Minimalvariante direkt am Enum ohne 8 (unsauber, aber schnell) |
| 10 | Content-Export/Import pro Modul | niedrig | mittel (Tooling-Komfort, kein Gameplay) | 8 (nur für bereits extrahierte Module sinnvoll) |
| 11 | Orts-Module (Tageszeit, NPC-Präsenz, Ressourcenstatus, Trigger) | niedrig | mittel | keine — kann jederzeit parallel laufen |
| 12 | Quest-Module extrahieren (quest-muehle.ts etc., wie Schritt 8) | mittel-hoch je Modul | hoch für Quest-Editor | 7 |
| 13 | Neue Quest-Typen (Sammel/Sozial/Erkundung/moralisch) | niedrig | mittel | 12 pro Modul |
| 14 | Editor-Module (Wissen, Proben, Ruf zuerst; Content/Quest erst nach 8/12) | niedrig, wenn Daten schon da | hoch für Produktivität, aber kein Gameplay-Risiko | 2, 3, 5, 6 für die ersten; 8, 12 für die späteren |
| 15 | Epilog-System (Module als Abfragen auf das Log) | mittel | hoch, aber erst sinnvoll wenn 2, 5, 6, 9 stehen | 2, 5, 6, 9 |

**Wichtigste Verschiebung gegenüber den vorherigen Versionen:** Ruf/Erinnerung stehen jetzt VOR dem riskanten Content-Refactor (Schritt 8), nicht danach — sie sind reine Log-Erweiterungen und brauchen den Refactor nicht. Das Wegesystem und der Editor mussten dagegen nach hinten, weil sie auf sauberen Daten aufbauen, die erst mit Schritt 8 entstehen.

---

## 2. Fundament: HeldSchema + Entscheidungs-Log

```typescript
// heldSchema.ts — bestehenden isHeld()-Guard schrittweise ablösen
import { z } from "zod";

export const EntscheidungSchema = z.object({
  szeneId: z.string(),
  timestamp: z.number(),
  typ: z.enum(["ruf", "wissen", "npc", "weg"]),
  ziel: z.string(),
  wert: z.union([z.number(), z.string(), z.boolean()]),
});
export type Entscheidung = z.infer<typeof EntscheidungSchema>;

// Nur die neuen/kritischen Felder streng geprüft; bestehende bleiben lose,
// bis sie schrittweise migriert werden — kein Big-Bang-Umbau von types.ts
export const HeldPartialSchema = z.object({
  name: z.string(),
  staerke: z.number(),
  geschick: z.number(),
  charisma: z.number(),
  lp: z.number(),
  entscheidungen: z.array(EntscheidungSchema).default([]),
});

export function validiereHeldStreng(value: unknown): boolean {
  return HeldPartialSchema.safeParse(value).success;
}
```

```typescript
// types.ts — additive Ergänzung am Held
export type Held = {
  // ...bestehende Felder unverändert...
  entscheidungen: Entscheidung[];
};

// createHeld() — Default ergänzen, greift automatisch beim Laden alter Spielstände
entscheidungen: [],
```

```typescript
// decisions.ts
export function protokolliere(held: Held, e: Omit<Entscheidung, "timestamp">): void {
  held.entscheidungen.push({ ...e, timestamp: Date.now() });
}
```

**Warum zuerst dieser Schritt:** Alles andere (Ruf, Erinnerung, später Epilog) baut darauf auf. Wird er zuerst gemacht, muss später nichts umgebaut werden. Wird er übersprungen und Ruf erst direkt am Held gespeichert (wie im vorletzten Plan), müsste dieser Code später wieder umgeschrieben werden.

---

## 3. Ruf & Erinnerung als abgeleitete Views (statt direkter Mutation)

```typescript
// reputation.ts
export function rufAus(held: Held, ziel: string): number {
  const clamp = (n: number) => Math.max(-100, Math.min(100, n));
  return clamp(
    held.entscheidungen
      .filter((e) => e.typ === "ruf" && e.ziel === ziel)
      .reduce((sum, e) => sum + (typeof e.wert === "number" ? e.wert : 0), 0)
  );
}

// Ruf ändern = Entscheidung protokollieren, kein direkter Feldzugriff mehr
export function aendereRuf(held: Held, szeneId: string, ziel: string, delta: number): void {
  protokolliere(held, { szeneId, typ: "ruf", ziel, wert: delta });
}
// Kein Decay (Entscheidung bereits getroffen): Werte bleiben, bis eine Szene explizit protokolliert.
```

```typescript
// memory.ts
export function merkeDir(held: Held, szeneId: string, npcId: string, flagId: string): void {
  protokolliere(held, { szeneId, typ: "npc", ziel: npcId, wert: flagId });
}

export function erinnertSich(held: Held, npcId: string, flagId: string): boolean {
  return held.entscheidungen.some((e) => e.typ === "npc" && e.ziel === npcId && e.wert === flagId);
}
```

---

## 4. Wissens-Metadaten (unverändert, rein additiv)

```typescript
// knowledge.ts — Ergänzung, deriveKnowledge() bleibt unangetastet
export type WissensTyp = "material" | "sozial" | "ort" | "übernatürlich";

export const KNOWLEDGE_META: Record<KnowledgeKey, { typ: WissensTyp; label: string }> = {
  dorf_ankunft: { typ: "ort", label: "Du bist in Lindendorf angekommen." },
  banditen_bekannt: { typ: "ort", label: "Banditen sitzen im Steinbruch." },
  // ... restliche Keys analog, siehe vorherige Version
};
```

---

## 5. Situationsmodifikatoren bei Proben

```typescript
function situationsModifikator(held: Held, bedingung: "nebel" | "erschoepfung"): number {
  if (bedingung === "nebel") return -2;
  if (bedingung === "erschoepfung" && held.effekte.includes("erschoepfung")) return -3;
  return 0;
}
// Immer VOR dem probe()-Aufruf in den Zielwert einrechnen, nie danach —
// sonst driftet die Schwierigkeit zwischen Szenen unbemerkt auseinander.
```

---

## 6. Sicherheitsnetz vor dem Content-Refactor (Schritt 7 der Roadmap)

Bevor Banditenlager-Content umgebaut wird, minimal testbar machen:

```typescript
// testTools.ts — bewusst klein gehalten, kein Vollausbau
export function findDeadNodes(alleSzenenIds: Set<string>, referenzierteIds: Set<string>): string[] {
  return [...alleSzenenIds].filter((id) => !referenzierteIds.has(id));
}

// Manuelles Durchspielen aller 4 bestehenden Lager-Wege VOR dem Refactor
// als Checkliste dokumentieren (kein Code, aber im Repo als docs/regression-checklist.md):
// [ ] Kampf führt zu erwartetem Szenen-Ende
// [ ] Schleichen führt zu erwartetem Szenen-Ende
// [ ] Verhandlung führt zu erwartetem Szenen-Ende
// [ ] Seitentor führt zu erwartetem Szenen-Ende
```

---

## 7. Banditenlager-Content extrahieren (höchstes Risiko im Plan)

Nach `content.ts`-Muster, ein Zod-Schema für den Lager-Ablauf. Dieser Schritt ist bewusst nicht mit Code vorweggenommen, weil er den bestehenden `script.ts`-Code liest und strukturiert überführt — sollte inkrementell (ein Weg nach dem anderen) gemacht werden, mit der Checkliste aus Abschnitt 6 nach jedem Teilschritt.

Danach, nicht davor:

```typescript
// types.ts
export type Loesungsweg =
  | "kampf" | "schleich" | "ueberreden" | "seitentor"
  | "schleich_ablenkung" | "wissen_anfuehrer" | "banditen_geholfen"
  | null;
```

---

## 8. Content-Export (erst für bereits extrahierte Module)

```typescript
export function exportiereModul(dateiname: string, schema: z.ZodTypeAny, daten: unknown): { dateiname: string; inhalt: string } {
  schema.parse(daten); // Validierung vor Export, nicht erst beim Import
  return { dateiname, inhalt: JSON.stringify(daten, null, 2) };
}
```

---

## 9. Bekannte Fehlerquellen (aktualisiert)

- **Log wächst unbegrenzt**: Bei sehr langer Spielzeit theoretisch viele Einträge — für ein Textabenteuer mit endlicher Szenenzahl unkritisch, aber nicht "for free". Kein Handlungsbedarf jetzt, im Auge behalten.
- **Zwei Muster für Zustand parallel**: Alte Felder (`sannaGeholfen`) bleiben Boolean, neue laufen über das Log. Muss in `AGENTS.project.md` dokumentiert werden, sonst entsteht Verwirrung, welches Muster wann gilt.
- **Schritt 7 ohne Testnetz ist der riskanteste Punkt im ganzen Plan** — deshalb Schritt 6 zwingend davor, nicht optional.
- **`isHeld()` bleibt grob für Alt-Felder**: Nur neue/kritische Felder werden streng mit Zod geprüft (siehe `HeldPartialSchema`), ein kompletter Umbau von `types.ts` auf Zod wäre ein eigenes, größeres Projekt.
- **Content-Export vor Extraktion ergibt nur Rohcode**: Reihenfolge in der Roadmap zwingend einhalten (8 nach 7).

---

## 10. Getroffene Entscheidungen

- **Wissen**: an `held.name` gebunden, kein Kapitel-Reset.
- **Ruf**: kein Decay, jetzt als abgeleitete Funktion über das Entscheidungs-Log statt direkter Mutation.
- **Content-Export**: pro Modul einzelne JSON-Datei, erst nach Zod-Extraktion des jeweiligen Moduls.

---

## 11. Konkreter erster Schritt

**Schritt 1 + 2 der Roadmap** (HeldSchema + Entscheidungs-Log). Beide sind rein additiv, brechen nichts Bestehendes, und alles Weitere (Ruf, Erinnerung, später Epilog) baut direkt darauf auf. Erst danach Schritt 7 (Testnetz) vorbereiten, bevor überhaupt an den riskanten Content-Refactor (Schritt 8) gegangen wird.
