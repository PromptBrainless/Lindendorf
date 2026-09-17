# Übergabe an eine weitere KI — Lindendorf

## Auftrag

Dieses Repository enthält ein spielbares, illustriertes React/TypeScript-Textabenteuer. Der bestehende Grundfluss und das Regelwerk sollen erhalten bleiben. Die nächste KI soll nicht neu anfangen, sondern die ausführliche Dark-Fantasy-Fassung prüfen, balancieren und gezielt erweitern.

## Verbindliche kreative Richtung

Die frühere Beschränkung auf sehr kurze Karten ist aufgehoben. Lindendorf wird ausführlich, düster und direkt erzählt. Die Sprache bleibt deutsch, im Präsens und in der Du-Form. Figuren handeln aus Hunger, Angst, Verantwortung, Schuld oder Selbsterhaltung. Das Übernatürliche bleibt selten und mehrdeutig. Keine Auserwählten-Rhetorik, keine High-Fantasy-Kräfte, kein modernes Verwaltungs- oder Therapievokabular.

## Stabiler Grundfluss

Heldenerstellung → Prolog und Fremdenprobe → Dorf-Schleife → Glockenweg/Wald → Banditenlager → eines von mehreren Enden.

Die drei Attribute sind Stärke, Geschicklichkeit und Charisma. Proben verwenden einen W10. Bestehende Held-Zustände, Wissensfreischaltungen, Gegenstände, Save-System und Endlogik dürfen nicht leichtfertig gebrochen werden.

## Aktueller Erzählbogen

Die überarbeitete Handlung verbindet folgende Spuren:

1. Ein verletzter Fremder trägt ein silbernes Kirchenartefakt.
2. Holms Siegel wurde kopiert und zum Fälschen von Abgaben benutzt.
3. Die Kapellenglocke dient als Warn- und Liefersignal.
4. Salz, Getreide, Verbandstoff und Werkzeuge gelangen über verdeckte Wege zum Steinbruch.
5. Im Lager wird sichtbar, dass die Banditen nicht nur rauben, sondern das Dorf mit seinen eigenen Zeichen und Ängsten organisieren.

Diese Intrige wird durch Nebenquests, Wissenstagebuch, Lagerfunde und Epilog rückgebunden.

## Neue Bildstruktur

Die vorhandenen Hauptbilder bleiben. Ergänzt wurden sechs Hintergründe und vier Porträts:

- Hintergründe: `stranger`, `chapel`, `apothecary`, `smithy`, `mill`, `evidence`;
- Porträts: `kern`, `sanna`, `smith`, `beggar`.

Die Dateien liegen unter `public/art/`, die Typen in `src/game/types.ts`, die Zuordnung in `src/game/art.ts`. Stil: dunkle Low-Fantasy-Ölmalerei, geringe Sättigung, realistische Materialien, keine Schrift im Bild, keine leuchtende Magie.

## Architektur

- `src/game/script.ts`: vollständiger Ablauf, Proben, Quests und Enden;
- `src/game/content.ts`: Zod-validierter Pilot für datengetriebenen Inhalt;
- `src/game/knowledge.ts`: Wissenstagebuch und abgeleitete Erkenntnisse;
- `src/game/types.ts`: Held-, Art- und Szenentypen;
- `src/game/runtime.ts`: Präsentationsvertrag;
- `src/game/save.ts`: lokaler Save-Payload;
- `src/components/game/`: Titel, Heldenerstellung, Szene, HUD und Wissenstagebuch;
- `scripts/check-knowledge-gates.mjs`: Freischaltprüfung;
- `scripts/check-darkfantasy-mobile.mjs`: mobiler Smoke-Test;
- `docs/PROJEKTKONTEXT.md`: maßgeblicher Snapshot.

## Bestätigte Qualität

Der Stand besteht Typecheck, Wissensprüfung, gezieltes ESLint, Build, Asset-/Quest-QA und einen mobilen Chromium-Test bei 390 × 844 Pixeln. Die ausführliche Fremden-Szene scrollt vertikal, alle vier Entscheidungen bleiben erreichbar, horizontales Überlaufen wurde nicht festgestellt.

## Nächste sinnvolle Arbeiten

1. Drei bis fünf vollständige Spielpfade automatisiert oder manuell bis zu ihren Enden prüfen.
2. Prüfen, ob die lange Erzählform an einzelnen Karten besser auf zwei `present`-Schritte verteilt werden sollte, ohne Inhalt zu kürzen.
3. Schwierigkeit und Belohnungen der vielen Nebenquests gegen die Hauptpfade balancieren.
4. Weitere Inhalte zuerst im vorhandenen Wissens- und Art-System planen.
5. `src/game/content.ts` nur schrittweise erweitern; keine Vollmigration in einem Zug.

## Verbote

- Kein Neustart des Projekts und kein Austausch des Frameworks.
- Keine Entfernung funktionierender Nebenquests zugunsten eines Minimalprototyps.
- Keine vorzeitige Anzeige von Informationen, die der Spieler noch nicht erworben hat.
- Keine Bilderzeugung ohne Abgleich mit der bestehenden Bildsprache.
- Keine erfundenen Tests oder behaupteten Browserprüfungen.

## Repository

Ziel: https://github.com/PromptBrainless/Lindendorf
