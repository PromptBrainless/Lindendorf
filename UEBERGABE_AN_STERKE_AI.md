# Übergabe an eine weitere KI — Lindendorf

## Projekt

Lindendorf ist ein illustriertes deutsches Textabenteuer im bestehenden React-/TypeScript-Projekt. Der feste Fluss lautet: Heldenerstellung → Dorf-Schleife → Wald → Banditenlager → Ende.

## Verbindliche Regeln

Vor Änderungen zuerst `ANWEISUNGEN_MANUS.md` lesen. Die Geschichte bleibt knapp, konkret, deutsch, gegenwärtig und atmosphärisch zurückhaltend. Keine neue Engine, kein zweites Dorf, kein neues Regelwerk und keine Refactors nur zur Sauberkeit.

## Startpunkt

Der aktuelle stabile Ausgangspunkt ist der letzte Commit plus die uncommitteten Erweiterungen dieses Übergabestands. `PROJEKTKONTEXT.md` ist der maßgebliche Snapshot. `KONTEXTPFLEGE.md` beschreibt, wie dieser Snapshot vor größeren Änderungen und am Sitzungsende aktualisiert wird.

## Aktuelle Erweiterungen

Die erste Introstrecke „Der Fremde am Weg“ wird über `src/game/content.ts` mit Zod validiert. `src/game/knowledge.ts` leitet Wissenspunkte aus bestehenden Held-Zuständen ab. `KnowledgeJournal.tsx` zeigt sichere Fakten, offene Fragen und optional Debugzustände über `?debug`. `scripts/check-knowledge-gates.mjs` prüft zentrale Wissens- und Freischalthooks.

## Tests

Vor der Übergabe wurden TypeScript-Typecheck, der Freischaltprüfer, gezieltes ESLint, Entwicklungsbuild, Asset-/Questprüfung und ein Browser-Smoke-Test erfolgreich ausgeführt. Geprüft wurden Titel, Wissenstagebuch, Debugzustände, Introstrecke und eine Stärkeprobe mit sichtbarer Würfelrückmeldung.

## Befehle

```bash
npm install
npm run typecheck
npm run check:knowledge
npm run build:dev
npm run dev
```

Der Dev-Server nutzt Port 8080. Nach manuellen Tests den Prozess wieder stoppen. Ein neues Abenteuer erst nach Lesen von `AUTORENHANDBUCH_TEXTABENTEUER.md`, `VORPLANUNG_VIER_PHASEN.md` und `WISSEN_FREISCHALTUNGSPLAN.md` beginnen.

## Offener nächster Schritt

Den alternativen Pfad testen: Rathaus besuchen, Auftrag ablehnen, Wissenstagebuch prüfen und anschließend Glockenweg oder Wald selbstständig wählen. Danach die nächste kleine Contentstrecke aus der strukturierten Contentdatei entwickeln. Große Migrationen des alten Skripts sind nicht vorgesehen.
