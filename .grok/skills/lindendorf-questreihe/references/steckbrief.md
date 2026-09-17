# Steckbrief — eine Quest, bevor Code entsteht

Vorlage 1:1 an Mühle/Brunnen. Datei: `docs/quests/<slug>.md`.
Ohne ausgefüllte Matrizen kein `quest-*.ts`.

```md
# <Titel>

Eine vollständige Nebenquest für Lindendorf, spielbar in der Dorf-Schleife
und höchstens einem angrenzenden Ort. Kein neues Kapitel.

## Abenteuer-Steckbrief

**Arbeitstitel:**

**Grundspannung**
Was ist im Ort falsch? Sichtbar, nicht erklärt.

**Heldensituation**
Warum kann der Held nicht einfach in den Wald?

**Ausgangsort — drei Stationen**
- Figur A — Haltung:
- Figur B — Haltung:
- Ort C — was der Ausrede widerspricht:

**Prüfungsweg**
Welcher Weg prüft leise / kräftig / überzeugend — und ob der Held weiß, wohin?

**Konfliktort**
Wer sitzt dort, und was wird wirklich verhandelt (nicht: „der Bösewicht“)?

**Drei Lösungswege + vierter Preis**
- Stärke:
- Geschicklichkeit:
- Charisma (braucht erworbenes Wissen/Beweis):
- Teurer vierter (Verrat, Bestechung, Melden):

**Kosten**
Leben, Vertrauen, Gold, Zeit, Beute, eine Person.

**Endbilanz**
Welche sichtbare Lage bleibt im Dorf? Wer erinnert sich wie?

## Figurenmatrix

| Figur | Innerer Druck | Sichtbarer Anker | Was merkt sie sich? | Funktion |
|---|---|---|---|---|
| | | | | Auftrag / erste Info / Kosten konkret / Konfliktkern |

Kein Name ohne Funktion. Kein Anker, der in jeder Karte denselben Satz erzeugt.

## Flag-Matrix

| Flag | Wird gesetzt bei | Wird gelesen bei (mindestens zwei Stellen) |
|---|---|---|
| `loesungsweg<Name>` | Konflikt gelöst | Nachspiel, Hub-Label, Wald, Epilog |

Zähler (`besuche`) nur, wenn die zweite Begegnung sich ändern muss.

## Wissensmatrix

| Key | Erworben durch | Öffnet Option / Journal |
|---|---|---|
| | | |

Vier Fragen aus `docs/WISSEN_FREISCHALTUNGSPLAN.md` für jede neue Wahl.

## Konsequenzmatrix

| Entscheidung | Sofort | Später | Ende |
|---|---|---|---|
| Vertrauen | | | |
| Druck | | | |
| Schleichen | | | |
| Kampf | | | |
| Vierter Weg | | | |

## Kollisionscheck (vor dem Schreiben)

- [ ] Kein Name aus `docs/QUESTREGISTER.md`
- [ ] Spec-Name gegen Sanna/Kern/Lene/Holm/Mara gehalten
- [ ] Kein Flag-Name, der schon auf `Held` liegt
- [ ] Einstiegs-Label ist ein neuer String
- [ ] ArtKeys existieren
- [ ] Porträt nur für sprechende, schon porträtierte Figuren oder bewusst null

## Szenenentwurf

### 1. Ankunft
2–5 konkrete Sätze. Eine Bewegung im Hintergrund, die später Sinn ergibt.

### 2. Schleife
Labels. Zweite Begegnung ändert Ton oder Information.

### 3. Prüfungsweg
Eine Probe, deren Misserfolg warnt / schadet / den Konfliktort verändert.

### 4. Konfliktort
Wissensgate: Charisma-Weg erst nach Beweis. Schleich-Weg erst bei stiller Ankunft oder Spur.

### 5. Enden
Vier Titel, karg, konkret. Kein Moralurteil.

### 6. Nachspiel
Wenn der Held später denselben Ort betritt.
```

## Szenenstimmen-Test (jeder Satz)

Mindestens eine Aufgabe: Ort, Figur, Risiko, Entscheidung, Konsequenz, Rhythmus.
Sonst streichen.

Ausführlich ist erlaubt (`docs/ERZAEHLREVISION_DARKFANTASY.md`), leer ist es nicht.
Bei Ortswechsel, Erkenntnis oder emotionaler Umkehr: neuer `present`-Schritt.

## Wahltexte

Gut: `Vertrauen gewinnen (Charisma, mittel)`
Schlecht: `Holm um den Finger wickeln`, `Die epische Quest beginnen`, Emoji.

Attribut in Klammern nur wenn eine Probe folgt. Schwierigkeit im Label anpassen,
wenn `verwundet` oder Vorwarnung sie hebt (`schwer — du bist verwundet`).
