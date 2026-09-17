# Projektkontext — How to be a Hero: Lindendorf

**Snapshot:** 17. September 2026, 18:10 Uhr
**Status:** Ausführliche Dark-Fantasy-Fassung und vollständige Bildrunde umgesetzt; Server gestoppt

## Verbindliche Richtung

Lindendorf ist jetzt ausdrücklich ein ausführlich erzähltes, düsteres Dark-Fantasy-Mittelalterabenteuer. Die frühere Kurztext-Vorgabe ist aufgehoben. Der Grundfluss und die Regeln bleiben unverändert:

> Heldenerstellung → Dorf-Schleife → Glockenweg/Wald → Banditenlager → Ende

Das Spiel verwendet Stärke, Geschicklichkeit und Charisma, W10-Proben, zehn Lebenspunkte, Heiltrank, Schlüssel und Gold. Der Held bleibt ein gewöhnlicher Mensch. Das Übernatürliche bleibt selten, körperlich und mehrdeutig.

## Erzählstand

Prolog, Fremdenbegegnung, Dorf, Rathaus, Taverne, Brunnen, Mühle, Schmiede, Apotheke, Bettlerquest, Glockenweg, Wald, Banditenlager und sämtliche Enden wurden ausführlich neu erzählt. Die Handlung verbindet nun gefälschtes rotes Siegel, manipulierte Glockensignale, vorgetäuschte Abgaben, gestohlene Vorräte und das verdrehte Kirchenzeichen zu einer durchgehenden Intrige.

Die Geschichte ist direkter und umfangreicher, ohne Kernregeln oder Grundfluss zu verändern. Rückwirkungen aus Artefakt, Auftrag, Bettler, Sanna, Salz, Glocke, Siegel, Verletzung und Lagerlösung erscheinen in Enden und Epilog.

## Neue Bildrunde

Sechs Hintergründe wurden generiert, auf 1792 × 1008 Pixel aufbereitet und integriert:

- `stranger.jpg`: Fremder mit Kirchenartefakt;
- `chapel.jpg`: Kapelle und Glockenweg;
- `apothecary.jpg`: Witwe Kerns Apotheke;
- `smithy.jpg`: Schmiede;
- `mill.jpg`: Mühle und falscher Mehlsack;
- `evidence.jpg`: gefälschter Brief, Wachs und Glockensignale.

Vier Porträts wurden auf 896 × 1344 Pixel aufbereitet und integriert:

- `kern.jpg`;
- `sanna.jpg`;
- `smith.jpg`;
- `beggar.jpg`.

Alle Bilder folgen der bestehenden dunklen Low-Fantasy-Ölmalerei. Die bisherigen Hauptbilder bleiben erhalten.

## Struktur und Spielerführung

`src/game/content.ts` validiert die Fremden-Szene mit Zod. `src/game/knowledge.ts` leitet Wissenspunkte aus bestehenden Held-Zuständen ab. Das Wissenstagebuch zeigt sichere Fakten, offene Fragen und optional Debugzustände über `?debug`. `scripts/check-knowledge-gates.mjs` prüft zentrale Freischaltungen.

## Bestätigte Prüfungen

Erfolgreich waren:

- `npm run typecheck`;
- `npm run check:knowledge`;
- gezieltes ESLint;
- `npm run build:dev`;
- `qa_content.py` für Held-Felder, Artkeys, Portraitkeys, Assets und Quests;
- Stilscan auf englische Bruchstücke, Emojis und Werbefloskeln;
- Desktop-Browserprüfung von Titel und Langprolog;
- mobiler Chromium-Test bei 390 × 844 Pixeln.

Die mobile Prologkarte hat kein horizontales Überlaufen. Die Fremden-Szene scrollt vertikal, zeigt alle vier Entscheidungen und behält die neue Grafik sichtbar. Befunde stehen in `BROWSERBEFUND_DARKFANTASY.md`.

## Git und Übergabe

Das Zielrepository ist `https://github.com/PromptBrainless/Lindendorf`. Der vollständige Dark-Fantasy-, Grafik-, Dokumentations- und QA-Stand ist für `main` vorbereitet. Der ursprüngliche Remote-Initialcommit wird als zweiter Elternteil in die lokale Historie aufgenommen, sodass der Push ohne Überschreiben fremder Historie möglich ist.

Der Arbeitsbaum soll nach dem Push sauber sein. Es laufen keine Vorschau- oder Hintergrundprozesse.

## Nächster sicherer Schritt

Nach dem Push drei bis fünf vollständige Spielpfade bis zu ihren Enden testen, danach Schwierigkeit, Belohnungen und Textkartenteilung gezielt balancieren. Neue Inhalte zuerst gegen `WISSEN_FREISCHALTUNGSPLAN.md`, `BILDPLAN_DARKFANTASY.md` und das Autorenhandbuch prüfen.
