# Questreihe — mehrere Türen, eine Schuld

Eine **Reihe** ist 3–5 Nebenquests unter einem gemeinsamen Druck, nicht fünf
unabhängige Fetch-Quests und nicht ein zweites Kapitel.

Goldmuster: Mühle + Brunnen. Beide betreffen dasselbe Dorf, beide sind
allein spielbar, beide hinterlassen Mehl oder Wasser im Epilog. Eine dritte
Quest derselben Reihe würde dieselbe Not vertiefen (Lieferung, Schuld, Rat,
Hunger), nicht ein neues Thema eröffnen.

## Reihe-Steckbrief (Phase 1, vor jeder Einzelspec)

```md
# Reihentitel

## Gemeinsame Schuld
Welcher Mangel oder welches Schweigen verbindet die Quests?
(Beispiel: Das Tal verliert, was es zum Leben braucht — Mehl, Wasser, …)

## Warum der Held nicht weiterziehen kann
Ein praktischer Grund, kein Schicksal.

## Quest-Karten (3–5)
| # | Titel | Ort | Konfliktperson | Was das Dorf verliert, wenn ungelöst | Abhängigkeit |
|---|---|---|---|---|---|
| 1 | | Dorf + 1 Randort | | | keine |
| 2 | | | | | unabhängig, darf 1 echoen |
| 3 | | | | | unabhängig |

## Geteilte Echo-Flags
Welche Ausgänge lesen andere Quests, ohne sie zu sperren?
(Beispiel: `loesungswegMuehle` ändert Maras Brot, sperrt aber den Brunnen nicht.)

## Reihenfolge
Empfohlen, nie erzwungen. Wer Quest 3 zuerst findet, muss sie verstehen können.

## Was diese Reihe nicht ist
Kein zweiter Wald, kein Magierturm, kein Endboss neben Kess.
```

## Pflichtregeln für die Serie

1. **Unabhängigkeit.** Jede Quest hat eigenen Einstieg, eigene Schleife, eigenen Konfliktort, eigenes `loesungsweg*`.
2. **Echo, kein Schloss.** Gelöste Quest A darf Text in Quest B färben. Sie darf B nicht unspielbar machen.
3. **Storylets spielen zusammen.** Fallen London / Emily Short: Qualities sind die *Schnittstelle zwischen* Geschichten. Vorhandene Flags der einen Quest müssen in der anderen gelesen werden (Methode und Ausgang). Ein gemeinsamer Journal-Faden (`versorgung_muster`) macht die Reihe sichtbar, ohne ein neues Kapitel zu sein.
4. **Delayed branching.** Choice of Games: früher Druck in Quest A verändert Probe oder Ton in Quest B, nicht den Zugang. Beide Zweige müssen gleich ernst geschrieben sein.
5. **Ein neuer Randort pro Quest.** Mühle → Lagerhaus am Fluss. Brunnen → Zisterne am Waldrand. Die dritte Quest braucht einen anderen Rand, nicht denselben Keller.
6. **Vier Ausgänge.** Stärke, Geschick, Charisma, plus ein teurer vierter (Verrat, Bestechung, Melden). Der vierte muss später wehtun.
7. **Drei Stationen im Ausgangsort.** Figur A (verschweigt), Figur B (könnte reden), Ort C (widerspricht A).
8. **Gemeinsame Schuld sichtbar machen**, ohne sie zu erklären. Mehlstaub, trüber Eimer, leeres Brotfach — nicht ein Tutor-Monolog.
9. **Eine Reihe, ein Ton.** Nicht Quest 1 karg und Quest 3 heldenhaft.

Referenz-Implementierung des Echos: `src/game/reihe-versorgung.ts`.

## Größenordnung einer einzelnen Quest

An Mühle/Brunnen messen, nicht an einem Roman:

- 1 Ankunftskarte
- 1 Hub-Schleife mit 4–5 Labels
- 3 Stationen, mehrfach besuchbar, zweite Begegnung ≠ erste
- 1 Prüfungsweg (Steg, Graben, Tür)
- 1 Konfliktort mit 3 Attributwegen + optionalem Rückzug
- 1 Nachspiel, wenn `loesungsweg*` gesetzt ist
- 4 Endkarten (eine pro Weg)
- 2–3 Rückbindungen außerhalb des Moduls

Wenn die Spec dicker wird als `quest-muehle.ts`, ist sie zu groß. Teilen.

## Abhängigkeiten, die erlaubt sind

| Erlaubt | Verboten |
|---|---|
| Anderer Text, wenn Flag gesetzt | Quest B erst nach Quest A sichtbar |
| Leichtere Probe nach erworbenem Wissen | Item aus A als hartes Tor für B |
| Holm erwähnt beide Ausgänge im Epilog | Eine Figur, die in allen Quests denselben Satz sagt |
| Mara backt wieder, wenn Mehl fließt | Neue Währung, neues Inventarfach |

## Dritte Quest derselben Reihe — Prüffragen

Bevor eine dritte (vierte, fünfte) Quest angelegt wird:

1. Welche konkrete Not ist **noch unerzählt** (Salz ist Glockenweg, Mehl ist Mühle, Wasser ist Brunnen)?
2. Welche bestehende Figur kann die Station tragen, ohne umbenannt zu werden?
3. Welches Bild existiert schon?
4. Welcher Randort ist noch frei (nicht Steg, nicht Zisterne, nicht Steinbruch)?
5. Welches Flag würde ein späterer Satz in Wald oder Epilog brauchen?

Keine Antwort → keine Quest. Erst die Lücke, dann der Name.

## Reihenfolge der Auslieferung

```text
Reihe-Steckbrief  →  Quest 1 Spec  →  Quest 1 Code+Draht+QA
                  →  Quest 2 Spec  →  Quest 2 Code+Draht+QA
                  →  Echo-Pass (gegenseitige Sätze)
                  →  Register
```

Nie Quest 2 implementieren, solange Quest 1 keinen `loesungsweg*` und keinen Epilog-Satz hat.
