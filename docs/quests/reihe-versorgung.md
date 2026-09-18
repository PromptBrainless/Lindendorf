# Reihe: Versorgung des Tals

Goldbeispiel einer Lindendorf-Questreihe. Dritte Quest erst anlegen, wenn eine
echte Lücke bleibt — nicht weil „drei“ eine runde Zahl ist.

## Gemeinsame Schuld

Lindendorf verliert, was es zum Leben braucht, an Leute, die mit dem Mangel
rechnen. Die Banditen im Steinbruch sind der laute Diebstahl. Die Reihe
betrifft den leisen: Mehl, das nicht gemahlen wird, Wasser, das nicht allen
gehört.

## Warum der Held nicht weiterziehen kann

Ohne Mehl kein Brot, ohne Wasser Krankheit. Mara, Holm und Kern werden
knapp, bevor der Wald beginnt. Der Held trinkt und isst im selben Tal.

## Quest-Karten

| # | Titel | Ort | Konfliktperson | Ungelöst | Abhängigkeit |
|---|---|---|---|---|---|
| 1 | Die Schuld der Mühle | Mühle + Lagerhaus am Fluss | Rennik | kein Mehl, eine versteckte Familie | keine |
| 2 | Das trübe Wasser | Brunnen + Zisterne am Waldrand | Grovin | krankes Wasser | unabhängig; Echo möglich |
| 3 | Das Kesseljahr | Gerbereigasse + Kirchengewölbe | Vahl | eine vergessene Quarantäne | unabhängig; Echo auf Verrat/Holm |

## Geteilte Echo-Flags

Schnittstelle: `src/game/reihe-versorgung.ts` (Storylets spielen zusammen).

- `loesungswegMuehle` färbt Brunnen, Dennek, Grovin, Mara, Holm, Platz, Epilog.
- `loesungswegBrunnen` färbt Mühle, Bertok, Mara, Holm, Platz, Epilog.
- `bertokBedraengt` / Verrat färben Denneks Ton und Charisma-Schwierigkeit.
- `dennekEntlarvt` färbt Bertoks Ton.
- Journal: `versorgung_muster`, sobald beide Fäden bekannt sind.

## Reihenfolge

Empfohlen: Mühle vor Wasser, weil Brot sichtbarer ist als ein metallischer
Geschmack. Nie erzwungen.

## Was diese Reihe nicht ist

Kein zweiter Wald, kein Ersatz für Kess, keine neue Währung.
