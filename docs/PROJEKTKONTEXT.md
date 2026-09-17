# Projektkontext — How to be a Hero: Lindendorf

**Snapshot:** 17. September 2026, 17:37 Uhr  
**Status:** Vierphasen-Pilot umgesetzt und browserseitig abgenommen; Server gestoppt

## Projektziel

Lindendorf ist ein illustriertes deutsches Textabenteuer mit drei Attributen, W10-Proben, wenigen Gegenständen und sichtbaren Konsequenzen. Der feste Spielfluss lautet:

> Heldenerstellung → Dorf-Schleife → Wald → Banditenlager → Ende

Das Projekt soll den bestehenden Vertical Slice vertiefen. Es soll kein neues Regelwerk, kein zweites Dorf und kein umfassender UI-Neubau entstehen.

## Verbindliche Leitplanken

Die maßgebliche Projektdatei ist `ANWEISUNGEN_MANUS.md`. Sie verlangt kurze deutsche Präsenssätze, konkrete Sensorik, trockene Zurückhaltung und Rückwirkungen zwischen Dorf, Wald, Lager und Ende.

Unverändert bleiben:

- Stärke, Geschicklichkeit und Charisma;
- W10 plus Attribut gegen Schwierigkeit;
- leichte, mittlere und schwere Proben bei 8, 12 und 15;
- zehn Lebenspunkte;
- Heiltrank, Schlüssel und Gold;
- der bestehende Szenenfluss;
- die vorhandene Bildsprache und Farbwelt.

Neue Flags oder Systeme sind nur zulässig, wenn eine konkrete Szene sie braucht und eine spätere Rückwirkung existiert.

## Inhaltlicher Stand

Bereits vorhanden sind:

- bebilderter Prolog;
- Dorf mit Rathaus, Taverne, Brunnen, Schmiede, Apotheke und Hangzugang;
- Bettler-, Taverne-, Schmiede-, Mühlen-, Siegel- und Glockenweg-Inhalte;
- Wald, Banditenlager und mehrere Enden;
- Speicher- und Ladefunktion über `localStorage`;
- mobile Lesbarkeitsverbesserungen;
- verständlichere Dorfankunft, dynamischere Optionen und Aufbruchskarte „Was du weißt“;
- Intro-Hindernis mit drei Würfelwegen: Stärke, Geschicklichkeit und Charisma.

## Letzter stabiler technischer Stand

Der letzte bestätigte Build vor der pausierten Strukturarbeit bestand aus:

- TypeScript-Typecheck erfolgreich;
- ESLint der geänderten Spiel- und UI-Dateien erfolgreich;
- Entwicklungsbuild erfolgreich;
- Asset-, Portrait- und Questprüfung erfolgreich;
- Browserprüfung von Intro, Dorfmenü, Save-Bestätigung und Aufbruch erfolgreich.

Der Vorschauprozess wurde nach der Browserabnahme beendet. Port 8080 ist frei.

## Pausierte Strukturarbeit

Die Vierphasenarbeit wurde als schlanker, rückwärtskompatibler Pilot umgesetzt. Eine vollständige Migration des alten Skripts ist ausdrücklich nicht erfolgt.

### Bereits angelegt

- `src/game/knowledge.ts`: ableitbare Wissenspunkte und Wissenslabels;
- `src/game/content.ts`: mit Zod validierte Content-Struktur für „Der Fremde am Weg“;
- `src/components/game/KnowledgeJournal.tsx`: Wissenstagebuch und optionaler Debugzustand;
- `VORPLANUNG_VIER_PHASEN.md`: Plan für Qualitätssicherung, Autorenschema, Spielerführung und Accessibility;
- `WISSEN_FREISCHALTUNGSPLAN.md`: Wissens- und Freischaltmatrix.

### Wichtige Einschränkung

Diese Dateien sind uncommitted. Sie bleiben als kleine, rückwärtskompatible Hilfsschicht bestehen. Die Projektanweisungen warnen weiterhin vor Refactors zur Sauberkeit, einer neuen Engine und unnötigen UI-Umbauten; eine vollständige Migration ist daher nicht geplant.

Typecheck, Freischaltprüfer, gezielter ESLint, Entwicklungsbuild und Contentreferenzprüfung waren erfolgreich. Browserseitig wurden Titel, Wissenstagebuch, Debugzustände, Content-Schema-Intro, erste Würfelprobe und Würfelrückmeldung geprüft.

## Aktueller Git-Zustand

Der letzte Commit vor der pausierten Strukturarbeit lautet:

`3d22d6367327ddad8bc32c86eba0562c0d282fdd — feat: expand Lindendorf adventure and improve clarity`

Nach diesem Commit wurden unter anderem folgende Dateien verändert oder neu angelegt:

- `src/components/game/GameApp.tsx`;
- `src/components/game/Hud.tsx`;
- `src/components/game/RulesScreen.tsx`;
- `src/components/game/SceneStage.tsx`;
- `src/components/game/TitleScreen.tsx`;
- `src/game/script.ts`;
- `src/game/types.ts`;
- `src/game/knowledge.ts`;
- `src/game/content.ts`;
- `src/components/game/KnowledgeJournal.tsx`.

Vor einem neuen Commit muss zwischen stabiler Produktänderung und pausiertem Experiment unterschieden werden.

## Abgeschlossene Pilotprüfungen

`npm run typecheck`, `npm run check:knowledge`, gezieltes ESLint, `npm run build:dev` und `qa_content.py` waren erfolgreich. Die erste Contentstrecke „Der Fremde am Weg“ wird aus `src/game/content.ts` geladen und per Zod validiert. Das Wissenstagebuch ist über das HUD erreichbar; `?debug` zeigt zusätzlich die abgeleiteten Wissenspunkte.

## Nächster sicherer Schritt

Nicht sofort alle vier Phasen umsetzen. Zuerst eine Entscheidung treffen:

1. **Minimaler Weg:** Nur Kontextpflege und bestehende Spielqualität weiterführen. Die neue Wissens- und Content-Schicht wird zurückgebaut oder separat archiviert.
2. **Pilotweg:** Eine einzige kleine Wissensfunktion behalten, sie vollständig testen und erst danach über weitere Struktur nachdenken.
3. **Vollständiger Strukturweg:** Nur nach ausdrücklicher Freigabe der Abweichung von `ANWEISUNGEN_MANUS.md` weiterführen.

Der nächste sichere Schritt ist ein vollständiger alternativer Pfadtest mit Auftrag abgelehnt und anschließend die nächste kleine Contentstrecke aus `src/game/content.ts`. Dafür muss der Vorschauprozess gezielt neu gestartet und danach wieder beendet werden.

## Kommunikationsregel für künftige Sitzungen

Vor jeder größeren Änderung muss dieser Snapshot aktualisiert werden. Nach jeder abgeschlossenen Phase muss dokumentiert werden:

- was geändert wurde;
- welche Tests erfolgreich waren;
- welche Dateien uncommitted sind;
- welcher Serverstatus gilt;
- was als nächstes ohne neue Architekturentscheidung möglich ist.
