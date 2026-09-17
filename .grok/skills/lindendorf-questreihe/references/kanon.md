# Kanon — was bereits belegt ist

Vor jeder Namenswahl, jedem Flag und jedem Hub-Label diese Listen prüfen.
Lebende Fassung: `docs/QUESTREGISTER.md`. Bei Abweichung gewinnt der Code.

## Grundfluss (unantastbar)

Heldenerstellung → Prolog/Fremder → Dorf-Schleife → Glockenweg oder Wald → Banditenlager → eines der neun Haupt-Enden.

Nebenquests leben **in der Dorf-Schleife** (plus höchstens einem angrenzenden Ort).
Sie dürfen den Aufbruch in den Wald nicht ersetzen und den Auftrag nicht erzwingen.

## Belegte Eigennamen

| Name | Rolle | Nicht tun |
|---|---|---|
| Holm | Bürgermeister | nicht zum Questgeber einer Mühlen-/Brunnen-Kopie machen |
| Mara | Wirtin | nicht zur zweiten Informantin ohne eigenen Preis |
| Kess | Banditenführer | nicht in Dorf-Nebenquests auftreten lassen |
| Lene | Müllerin (Porträt `miller`) | Spec sagte „Senna“ — Name ist verbraucht durch **Sanna** |
| Bertok | Müller, kein Porträt | |
| Yorwin | Versteckter Schwager | |
| Rennik | Kornhändler am Ufer | |
| Witwe Kern | Apothekerin (Porträt `kern`) | Spec sagte „Mirl“ — Kern übernehmen, nicht ersetzen |
| Dennek | Ratsherr am Brunnen | |
| Grovin | Ehemaliger Brunnenbauer | |
| Sanna | Botin am Glockenweg (Porträt `sanna`) | nicht Senna, nicht Sana |
| Jorren | Salz am Glockenweg | |
| Köhler | einmaliger Waldauftritt | nicht zurückholen außer als Gerücht |
| Schmied | namenlos, Porträt `smith` | |
| Bettler | Porträt `beggar` | |
| Junge mit der roten Schnur | Dorfplatz | |
| Müllerin am Brunnen | dieselbe Lene, früherer Auftritt | nicht als zweite Frau schreiben |

Neue Namen: deutsch, karg, einmalig, mit Funktion. Kein „Bauer 3“, keine Elfen, keine Götter.

## Belegte Flags (nicht wiederverwenden, nicht umdeuten)

Hauptplot (Auszug): `banditenGewarnt`, `buergermeisterVertraut`, `verwundet`, `holmBesucht`, `auftragErhalten`, `lagerGeloest`, `loesungsweg`, `beuteGerettet`, `artefaktErhalten`, `artefaktVerloren`, `artefaktWeg`, `holmSiegelGefunden`, `holmSiegelVerschwiegen`, `glockeGestoppt`, `glockeGescheitert`, `sannaGeholfen`, `sannaAbgewiesen`, `salzGerettet`, `salzLiegenGelassen`, `mehlsackGefunden`, `mehlsackGemeldet`, `kernGeholfen`, `kernAbgewiesen`, `maraGeholfen`, `maraAbgewiesen`, `schmiedGeholfen`, `schmiedAbgewiesen`, `bettlerGeholfen`, `bettlerAbgewiesen`, `letzterGastGefunden`, `letzterGastAbgewiesen`, `schnurGeholfen`, `schnurAbgewiesen`.

Mühle: `muehleBesucht`, `spurenGefunden` (**generischer Name, belegt**), `muellerVertraut`, `bertokBedraengt`, `leneBedraengt`, `sennaBesuche` (Zähler, historischer Spec-Name), `fluechtlingeEntdeckt`, `renniksBeweis`, `rennikGewarnt`, `loesungswegMuehle`.

Brunnen: `truebungBestaetigt`, `spurAmBrunnen`, `dennekEntlarvt`, `grovinGenannt`, `grovinsGrund`, `grovinGeflohen`, `grovinVersprechen`, `loesungswegBrunnen`.

Tod: `todesort` (`"steg" | "rennik" | "zisterne" | null`) — neue Todesorte als Union-Glied, nicht als eigenes Flag.

Wald hat eine **lokale** Variable `spurenGefunden` in `szeneWald`. Held-Flag und lokale Variable sind verschiedene Dinge — neue Quests dürfen den Namen trotzdem nicht noch einmal auf `Held` legen.

## Belegte Hub-Labels (exakte Strings)

Dorf-Schleife in `szeneDorf`:

- `Mit dem Bürgermeister sprechen`
- `Die Taverne besuchen`
- `Brunnen und Dorfplatz`
- `Zur Mühle gehen` → `dorfMuehle`
- `Schmiede und Apotheke`
- `Nach dem roten Wachs fragen` (nur nach `holmBesucht`)
- `Zum alten Glockenweg aufsteigen` / `Den Weg zum Hang erkunden`
- `Richtung Wald aufbrechen`

Unter `Brunnen und Dorfplatz`:

- `Am Brunnen lauschen` (bestehende Müllerin/Gerücht)
- `Den trüben Eimer prüfen` / `Den Brunnen noch einmal ansehen` → `dorfTruebesWasser`
- `Dem Jungen mit der roten Schnur folgen`

Neue Einstiege: **neuer Label-String**, Dispatch per `gewaehlt === "…"`, nie per Index.

## Bilder — wiederverwenden, nicht erzeugen

Hintergründe: `title road stranger village townhall tavern well mill apothecary smithy forest ditch chapel camp evidence sneak combat gate death return`

Porträts: `holm mara kess miller kern sanna smith beggar`

| Szene | ArtKey |
|---|---|
| Dorf, Platz | `village` |
| Rathaus / Holm / Verrat | `townhall` + `holm` |
| Taverne | `tavern` + `mara` |
| Brunnen, Wasserquest | `well` |
| Mühle, Kornkammer | `mill` + `miller` für Lene |
| Apotheke / Kern | `apothecary` + `kern` |
| Ufer, Graben, Steg, Zisterne-Weg | `ditch` |
| Lagerhaus, Wächter, Zisterne-Konflikt | `camp` |
| Schuldschein, Beweis | `evidence` |
| Schleichen | `sneak` |
| Kampf | `combat` |
| Tod | `death` |

Neues Bild nur, wenn ein wiederkehrender Ort oder eine tragende Figur sonst leer wirkt. Dann `ArtKey`/`PortraitKey` + `art.ts` + Datei, Stil laut `docs/BILDPLAN_DARKFANTASY.md`.

## Pflicht-Rückbindungen (wo eine gelöste Quest nachklingen muss)

Mindestens **zwei** der folgenden Stellen, besser drei:

1. Dorfplatz-Ankunft (`szeneDorf` Eröffnung)
2. `Was du weißt` vor dem Wald
3. Taverne (Mara/Brot/Wasser)
4. Holm-Dialog
5. Wald-Ankunft (`szeneWald`)
6. `epilog(held)` — ein Satz pro Lösungsweg
7. Todeskarte, falls die Quest töten kann (`todesort`)

Mühle und Brunnen tun das bereits. Eine neue Quest ohne Epilog-Satz ist unfertig.

## Wissenskeys (belegt)

`dorf_ankunft artefakt_gesehen artefakt_erhalten holm_besucht auftrag_erhalten banditen_bekannt rotes_siegel_gesehen hang_hinweis glockenweg_bekannt glocke_vorteil banditen_gewarnt muehle_stillstand renniks_druck fluechtlinge_muehle wasser_truebung grovin_zisterne dennek_schuld`

Neue Keys: klein, deutsch, in `KnowledgeKey`, `deriveKnowledge`, `knowledgeLabels` (sicher **und** offen).
