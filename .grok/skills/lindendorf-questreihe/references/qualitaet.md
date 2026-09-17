# Qualität — Stimme, Gates, Durchlauf

Die Quest ist ein Lindendorf-Text, kein generisches Fantasy-RPG. Wenn zwischen
mehr Plot und einem besseren Satz gewählt wird, gewinnt der Satz.

## Stimme

Deutsch. Du. Präsens. Trocken. Körperlich.

Erlaubt: kurze und ausführliche Sätze, konkrete Stoffe (Mehl, Rost, nasses Tuch,
Wachs, Rauch), knappe Dialoge, Unbehagen, Figuren die etwas nicht sagen.

Verboten: Pathos, Heldensprache, Memes, Comedy, Romantik-Nebenplot, moderne
Verwaltung/Therapie, „In einer Welt“, „das Schicksal“, Emoji, englische
Wahltexte, KI-Floskeln, Auserwählten-Rhetorik.

Test: Würde die Zeile in `attachments/how_to_be_a_hero_v01.py` auffallen?
Wenn sie weicher, größer, lustiger oder heldenhafter klingt — neu schreiben.

Anker wiederholen sich, **verändern** sich aber (Mara wischt, dann nicht mehr).

## Wissensgates

Vor jeder neuen Option:

1. Welche Information hat der Spieler jetzt?
2. Woher?
3. Warum ist die Option die verständliche Folge?
4. Was ändert sich, wenn er sie lässt?

Unverständliche Option: verbergen oder allgemeiner formulieren
(`Dem Uferweg flussabwärts folgen` statt `Zum Lagerhaus des Kornhändlers`).
Das Label darf nach erworbenem Wissen schärfer werden.

## Proben

- Probe nur, wenn Scheitern den Weg ändert (Schaden, Vorwarnung, geschlossener
  Weg, schwerere Folgeprobe, verlorenes Vertrauen).
- Misserfolg wirft niemanden grundlos aus dem Abenteuer.
- Tod nur aus erkennbarem Risiko (Steg, Knüppel, Kampf).
- Erfolg darf kosten (Gold, Zeit, Beute, eine Beziehung).

## Automatische Prüfer (immer, in dieser Reihenfolge)

```text
npm run typecheck
npm run check:knowledge
npm run check:questreihe
```

`check:questreihe` verlangt unter anderem:

- jedes `src/game/quest-*.ts` wird in `script.ts` importiert;
- jedes `held.<flag> =` existiert auf `Held` und in `createHeld`;
- jedes `art:` / `portrait:` ist ein gültiger Key;
- `loesungsweg*` kommt in `epilog(` vor;
- keine Emojis, keine englischen Wahltext-Fragmente, keine Schicksals-Floskeln;
- Einstiegs-Label-String kommt in `script.ts` vor.

Rot = nicht fertig. Nicht „später“.

## Hand-Durchlauf (Minimum pro Quest)

Mit einem frischen Held:

1. Dorf betreten, Einstiegs-Label finden, Ankunft lesen.
2. Alle drei Stationen einmal, eine Station ein zweites Mal (Text muss kippen).
3. Eine Probe gewinnen, eine verlieren.
4. Prüfungsweg mit und ohne Spur-Flag (Label oder Schwierigkeit muss sich unterscheiden).
5. Konflikt: Rückzug möglich, ohne die Quest zu zerstören.
6. Einen Attributweg zu Ende, Nachspiel am selben Ort.
7. Zweiten Held: anderen Attributweg. Textlich anders, nicht nur Würfel.
8. Teuren vierten Weg, wenn spezifiziert.
9. Tod am Prüfungsweg oder Konflikt, falls Schaden ≥ erkennbarem Risiko.
10. Nach Lösung: Wald-Ankunft und ein Haupt-Ende — Epilog-Satz sichtbar.

Browser: Karten scrollbar, keine abgeschnittenen Choices, Porträt nur bei Sprecher.

## Textprüfung (Häkchen)

- [ ] Jede Wahl ist eine Handlung
- [ ] Jede wichtige Handlung hat späteren Widerhall
- [ ] Keine Karte wiederholt nur die vorige
- [ ] Figuren behalten ihren Anker
- [ ] Keine neuen Namen ohne Funktion
- [ ] 2–5 wirksame Sätze bzw. ein Beat pro Karte, dann neuer `present`
- [ ] `held` vor `present` mutiert
- [ ] `tot` nach jedem Schaden
- [ ] Save-Merge: frisches Flag fehlt in altem Save, Default greift

## Fertig-Satz gegenüber dem Nutzer

Produkt, nicht Pfade: wo man die Quest findet, was sie kostet, dass der
Hauptplot unberührt bleibt. Keine Container, keine Ports, keine Dateilisten
als Erfolgsmeldung.
