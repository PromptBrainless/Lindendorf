# Questregister — belegte Namen, Flags, Einstiege

Vor jeder neuen Quest lesen. Nach jeder gelandeten Quest **in derselben Sitzung**
ergänzen. Der Code in `src/game/types.ts` und `src/game/script.ts` gewinnt bei Streit.

## Reihen

| Reihe | Schuld | Quests | Status |
|---|---|---|---|
| Versorgung des Tals | Das Dorf verliert, was es zum Leben braucht | Die Schuld der Mühle; Das trübe Wasser | zwei von drei bis fünf |

Nächste sinnvolle Lücke in dieser Reihe: ein dritter Mangel, der **nicht** Mehl,
Wasser, Salz (Glockenweg) oder Kirchensilber (Hauptplot) ist. Erst Lücke, dann Name.

## Quests

| Titel | Modul | Einstiegs-Label | Lösungsweg-Flag | Randort | Art |
|---|---|---|---|---|---|
| Die Schuld der Mühle | `quest-muehle.ts` `dorfMuehle` | `Zur Mühle gehen` | `loesungswegMuehle` | Lagerhaus am Fluss | mill, ditch, camp, evidence, sneak, combat, townhall |
| Das trübe Wasser | `quest-brunnen.ts` `dorfTruebesWasser` | `Den trüben Eimer prüfen` (unter Brunnen und Dorfplatz) | `loesungswegBrunnen` | Zisterne am Waldrand | well, apothecary, ditch, evidence, camp |

## Eigennamen

Holm, Mara, Kess, Lene (Müllerin, Porträt miller), Bertok, Yorwin, Rennik,
Witwe Kern (nicht Mirl), Dennek, Grovin, Sanna (nicht Senna), Jorren, Köhler,
Schmied (namenlos), Bettler, Junge mit der roten Schnur.

Historische Spec-Fallen: **Senna** → Lene, weil Sanna existiert. **Mirl** → Kern.

## Held-Flags der Nebenreihen

Mühle: `muehleBesucht`, `spurenGefunden`, `muellerVertraut`, `bertokBedraengt`,
`leneBedraengt`, `sennaBesuche`, `fluechtlingeEntdeckt`, `renniksBeweis`,
`rennikGewarnt`, `loesungswegMuehle`.

Brunnen: `truebungBestaetigt`, `spurAmBrunnen`, `dennekEntlarvt`, `grovinGenannt`,
`grovinsGrund`, `grovinGeflohen`, `grovinVersprechen`, `loesungswegBrunnen`.

Tod: `todesort` = `steg | rennik | zisterne | null`.

`spurenGefunden` ist vergeben (Mühle). Wald benutzt denselben Bezeichner nur lokal.

Schnittstelle der Reihe: `src/game/reihe-versorgung.ts`. Methode und Ausgang
einer Quest färben die andere, ohne sie zu sperren. Journal-Key `versorgung_muster`.

## Hub-Labels (nicht umbenennen)

`Mit dem Bürgermeister sprechen`, `Die Taverne besuchen`, `Brunnen und Dorfplatz`,
`Zur Mühle gehen`, `Schmiede und Apotheke`, `Nach dem roten Wachs fragen`,
`Zum alten Glockenweg aufsteigen`, `Den Weg zum Hang erkunden`,
`Richtung Wald aufbrechen`, `Am Brunnen lauschen`, `Den trüben Eimer prüfen`,
`Den Brunnen noch einmal ansehen`, `Dem Jungen mit der roten Schnur folgen`.

## Wissenskeys der Nebenreihen

`muehle_stillstand`, `renniks_druck`, `fluechtlinge_muehle`, `wasser_truebung`,
`grovin_zisterne`, `dennek_schuld`, `versorgung_muster`.

## Rückbindungen (bereits verdrahtet)

Mühle: Dorfplatz, Holm, Mara/Brot, Was-du-weißt, Wald, Epilog, Tod Steg/Rennik.
Brunnen: Dorfplatz, Platz-Label, Kern, Was-du-weißt, Wald, Epilog, Tod Zisterne.

## Freie Randorte (Vorschlag, nicht reserviert)

Noch ungenutzt als Quest-Konfliktort: Kapelle ist Glockenweg (nicht anfassen),
Schmiede-Innenraum ist Kleinquest, Apotheke ist Kern, Steinbruch ist Hauptplot.
Eine dritte Versorgungsquest braucht einen **anderen** Dorfrand als Flusssteg
und Zisterne.
