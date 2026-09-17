# Anweisungen für Manus — How to be a Hero (Lindendorf)

Du arbeitest an einem **illustrierten Textabenteuer**. Es ist bereits spielbar. Deine Aufgabe ist nicht ein neues Spiel, nicht ein neues Regelwerk und nicht ein UI-Redesign. Deine Aufgabe ist, den **bestehenden Vertical Slice mit liebevollem Inhalt auszuarbeiten**: mehr Seele, mehr Wiedererkennen, mehr Konsequenz — ohne die Kälte und Präzision der Stimme zu verraten.

Arbeite im bestehenden React/TypeScript-Projekt. Die Geschichte lebt in `src/game/script.ts`. Die Bilder liegen in `public/art/`. Die Regeln in `src/game/engine.ts`.

## Aktuelle Stilrevision — 17. September 2026

Die frühere Vorgabe, Texte grundsätzlich kurz zu halten, ist aufgehoben. Das gesamte Abenteuer wird zu einer ausführlichen, düsteren Dark-Fantasy-Mittelaltererzählung ausgebaut. Kernregeln, Figurenfundament und Grundfluss bleiben bestehen. Ausführliche Szenenkarten sind ausdrücklich erwünscht, wenn sie Handlung, Atmosphäre, Figurenentwicklung oder Konsequenzen tragen. Leere Ausschmückung, Wiederholung und Pathos bleiben verboten.

Die vollständige Ausbauplanung steht in `ERZAEHLREVISION_DARKFANTASY.md`. Dieses Dokument hat für die neue Erzählform Vorrang vor älteren Kurztext-Hinweisen in diesem Dokument.

---

## 1. Was das Spiel ist

Lindendorf, ein armes Tal. Banditen im alten Steinbruch. Der Held ist niemand Auserwähltes — jemand, der geht, wenn andere bleiben.

**Fluss (unantastbar):**

Heldenerstellung → Prolog/Fremder → Dorf (Schleife) → Glockenweg oder Wald → Banditenlager → Ende

**Regeln (unantastbar):**

- Drei Attribute 1–10: Stärke, Geschicklichkeit, Charisma. Kein Punktelimit.
- Probe: `W10 + Attribut ≥ Schwierigkeit` (leicht 8, mittel 12, schwer 15).
- 10 Lebenspunkte. Bei 0 tot.
- Inventar: nur `Heiltrank`, `Schlüssel`, `Gold` (Gold als Zahl).
- Flags steuern späteren Text: `banditenGewarnt`, `buergermeisterVertraut`, `verwundet`, `auftragErhalten`, `lagerGeloest`, `loesungsweg`, `beuteGerettet`.

Inspiriert von *How to be a Hero* (wenige Werte, W10, Konsequenzen). Es ist **kein** High-Fantasy-Epos, kein D&D-Klon, kein Scherz-RPG.

---

## 2. Was „liebevoll“ hier heißt

Liebevoll heißt **Sorgfalt**, nicht Süße.

Lindendorf bleibt nass, knapp, müde. Liebevoll ist:

- Figuren, die etwas **behalten**, nicht nur etwas **sagen**. Holm hat nasse-Kiesel-Augen und eine leere Kasse. Mara wischt dieselbe Stelle dreimal. Kess glaubt an Galgen, nicht an Helden. Das darfst du vertiefen — nicht ersetzen.
- Kleine menschliche Gesten, die **nichts kosten** und trotzdem etwas bedeuten: ein unbestelltes Bier, zwei abgewetzte Münzen, Witwe Kern die verbindet ohne zu fragen.
- **Callbacks.** Was im Dorf passiert, muss im Wald, im Lager und im Ende nachklingen. Wenn der Held in der Taverne prahlt, wissen die Banditen Bescheid. Wenn Holm vertraut, ändert sich der Preis bei Kess *und* der Abschied.
- Sensorik statt Adjektive: Gerste, nasses Tuch, Farn, Rost, Wachs, Rauch der senkrecht steigt.
- Namen die bleiben: Holm, Mara, Kess, Witwe Kern, die Müllerin. Neue Namen nur, wenn die Figur eine Funktion hat (nicht „Bauer 3“).

Liebevoll heißt **nicht**:

- Romantische Nebenplot, Heiratsantrag, „found family“-Kitsch.
- Comedy, Memes, moderne Anachronismen, KI-Floskeln („In einer Welt…“, „doch das Schicksal…“).
- Mehr Attribute, Skills, Level, Ausrüstungsslots, Crafting.
- Ein zweites Dorf, ein Drache, ein Magierturm.
- Umfang ohne Funktion: Mehr Text ist nur dann zulässig, wenn er Handlung, Atmosphäre, Figurenentwicklung oder Konsequenz vertieft.

**Test für jede neue Zeile:** Würde sie in der Originaldatei `attachments/how_to_be_a_hero_v01.py` nicht auffallen? Wenn sie weicher, heldenhafter oder witziger klingt als der Rest — weg.

---

## 3. Stimme (unbedingt nachahmen)

Deutsch. Du. Präsens. Direkte, konkrete Sprache. Sätze dürfen ausführlich werden, solange sie klar bleiben. Trockene Ironie. Kein leerer Pathos.

**So klingt das Spiel:**

> Rauch steigt senkrecht. Die Felder sind abgeerntet, die Scheunen zu leer.
> Holm nickt knapp. Mehr Wärme hat dieses Amt nicht übrig.
> Kess hat eine Stimme wie ein stumpfer Säbel.
> Das ist kein Frieden. Das ist eine Pause mit Preis.

**So klingt es falsch:**

> Das mutige Herz des Helden pochte, als die epische Quest begann.
> Mara lächelte warmherzig und bot dir ein Abenteuer der Freundschaft.
> Mit vereinten Kräften würdet ihr das Böse besiegen!

Dialog in deutschen Anführungszeichen: `„…“`

Wahltexte sind Taten, keine Witze. Beispiel gut: `Vertrauen gewinnen (Charisma, mittel)`. Beispiel schlecht: `Holm mit deinem Charme um den Finger wickeln 😉`

Kein Emoji. Keine Ausrufecluster. Held\*innen-Sprache nur, wo der Originaltext sie schon hat („Held oder Heldin“ in der Erstellung). Im Spieltext bleibt „du“.

---

## 4. Dateien — wo du schreiben darfst

| Datei | Rolle | Du |
|---|---|---|
| `src/game/script.ts` | Gesamte Geschichte, alle Szenen, alle Enden | **Hauptdatei.** Hier entsteht der liebevolle Inhalt. |
| `src/game/types.ts` | `Held`, `ArtKey`, `PortraitKey`, Flags | Neue Flags/Items nur wenn eine Szene sie wirklich braucht. |
| `src/game/engine.ts` | W10, Probe, Schaden, Heilen, Inventar | Nur anfassen, wenn ein neues Item/eine neue Probe-Hilfe nötig ist. Nicht „verbessern“. |
| `src/game/runtime.ts` | `rt.present(...)` | Nicht umbauen. |
| `src/game/art.ts` | Pfade zu Bildern | Nur wenn du ein neues Bild in `public/art/` legst. |
| `src/components/game/*` | UI: Titel, Erstellung, HUD, Bühne | Nur wenn ein neues Feld angezeigt werden muss (neuer Flag-Chip, neues Item-Icon). Sonst Finger weg. |
| `src/styles.css` | Palette, Schriften | Nicht umfärben. |
| `public/art/*.jpg` | Szenen- und Porträtbilder | Neue nur im selben Stil (dunkles Low-Fantasy-Ölgemälde, nasser Stein, Moos, Ruß, Ocker). |
| `attachments/how_to_be_a_hero_v01.py` | Kanonische Originalstimme | Lesen. Nicht portieren. Das Webspiel ist schon die Portierung. |

**Nicht anfassen:** Auth, Datenbank, `src/lib/**`, Router-Plugin, PWA, Branding-Karte.

---

## 5. Technische Schnittstelle (Szenen schreiben)

Jede Beat ist ein `await rt.present({...})`. Rückgabewert = Index der Wahl (0-basiert). Ohne `choices` erscheint „Weiter“.

```ts
const wahl = await rt.present({
  title: "Lindendorf",          // optional; bleibt sonst der letzte Titel
  art: "village",               // ArtKey; bleibt sonst das letzte Bild
  portrait: "holm",             // PortraitKey | null (null räumt das Porträt weg)
  held,                         // immer übergeben, damit die HUD aktualisiert
  probe: ergebnis,              // optional, Ergebnis von probe()
  log: [gold, item],            // optionale Systemzeilen (Gold, Beute)
  ending: "Schattenarbeit.",    // nur im Finale
  lines: [
    "Bürgermeister Holm hat Augen wie nasse Kiesel.",
    "„Sie kommen nachts.“",
  ],
  choices: [
    "Auftrag nüchtern annehmen",
    "Vertrauen gewinnen (Charisma, mittel)",
  ],
});
```

**Pflichtmuster, nicht brechen:**

1. `held` mutieren, dann `present({ held, ... })` — nie umgekehrt.
2. Nach Schaden: `if (tot(held)) return;`
3. Nach Wald-Abschnitten und Kampf: `await vielleichtHeiltrank(rt, held)`.
4. Proben so:

```ts
const ergebnis = probe(held, "Charisma", held.charisma, MITTEL, "Vertrauen des Bürgermeisters");
if (ergebnis.erfolg) { /* ... */ }
await rt.present({ held, probe: ergebnis, lines: [...] });
```

5. Neue Bilder: Datei nach `public/art/foo.jpg`, Key in `ArtKey` / `PortraitKey` und `src/game/art.ts` eintragen.
6. `lines` dürfen ausführlich sein. Eine Karte soll einen zusammenhängenden Erzählbeat tragen und auf Mobilgeräten scrollbar bleiben. Bei Ortswechsel, neuer Erkenntnis oder emotionaler Umkehr einen neuen `present`-Schritt verwenden, statt alles in eine einzige Wand zu legen.
7. Deutsch bleiben. Keine englischen Wahltexte, keine englischen Endtitel.

---

## 6. Was du ausarbeiten sollst (Priorität)

Arbeite in dieser Reihenfolge. Jede Stufe muss für sich spielbar bleiben.

### Stufe A — Dichte im bestehenden Dorf (zuerst)

Das Dorf ist eine Schleife. Das ist gut. Mach die **zweite Begegnung** anders als die erste.

- **Holm:** Wenn `auftragErhalten` und `buergermeisterVertraut`, redet er schon anders (steht im Code). Ergänze: wenn der Auftrag da ist, aber kein Vertrauen — kühler, knapper, ein Satz über die leere Kasse. Kein zweiter Tutorial-Monolog.
- **Mara:** Gerüchte nicht immer derselbe Text. Wenn `rumorenGehoert`, knüpft sie ans Brunnenwissen an (tut sie schon knapp). Ergänze eine zweite Gerüchte-Lage: Kess’ Narbe, der Graben, wer nachts nicht mehr schläft. Lautes Ankündigen bleibt gefährlich (`banditenGewarnt`).
- **Brunnen / Müllerin:** Erfolg und Misserfolg dürfen je einen Satz mehr Innenleben haben. Die zwei Münzen bleiben Almosen, kein Schatz.
- **Wiederkehr:** Wer Mara nach dem Prahlen nochmal besucht, spürt die Stille. Wer Holm nach dem Erpressen nochmal sieht, spürt die Rechnung.

Neue Dorfknoten sind nur zulässig, wenn sie eine eigene Figur, Entscheidung und spätere Rückwirkung tragen. Bestehende Knoten wie Apotheke, Schmiede, Mühle und Brunnen werden bevorzugt weiter vertieft, statt weitere austauschbare Orte anzuhängen.

### Stufe B — Wald, der sich erinnert

Der Wald hat Spuren und Graben. Liebevoll heißt: der Wald **reagiert**.

- Wenn `banditenGewarnt`, knackt es früher, der Pfiff ist näher, der Graben fühlt sich gestellt an.
- Wenn `spurenGefunden`, darf der Umweg den Schlüssel seltener „zufällig“ spawnen — er ist dann verdient, nicht lotteriert. (Logik darf leicht geschärft werden, nicht komplizierter.)
- Ein Satz über die gespaltene Eiche, wenn die Taverne sie erwähnt hat. Wer nicht hingehört hat, sieht nur Holz.
- Der Köhler bleibt einmalig, barsch, hilfreich. Kein Freundschaftsplot.

### Stufe C — Lager mit Gesicht

Kess ist der einzige Bandit mit Namen. Lass ihn eine Person sein, kein Boss-Icon.

- Wenn gewarnt: er kennt die Taverne, vielleicht Maras Namen, vielleicht den Satz den der Held laut gesagt hat. Ein Satz reicht.
- Wenn nicht gewarnt: Langeweile, Würfel, die Acht die nicht seine ist (steht schon da — schützen).
- Handel: der Preis (5 mit Vertrauen, sonst 8) bleibt. Die Begründung darf menschlicher werden: Kess verkauft Zeit, nicht Frieden.
- Kampf bleibt hässlich. Kein Duell, kein Ruhm im Moment. Ruhm nur im Ende „Der kurze Ruhm.“, und der ist kurz.

### Stufe D — Enden, die sich anfühlen als hätte man *dieses* Spiel gespielt

Die Endtitel bleiben:

- Der Wald behält dich.
- Unerledigt.
- Das Wort war die Waffe.
- Gekaufter Frieden.
- Schattenarbeit.
- Der kurze Ruhm.
- Teurer Sieg.
- Überlebt, nicht erledigt.
- Genug für ein Tal.

**Nicht umbenennen.** Jedes Ende darf ausführlich auf den tatsächlich gespielten Weg reagieren. Zusätzliche Epilog-Bits müssen an echte Flags gebunden sein und dürfen keine Entscheidungen behaupten, die nicht gefallen sind.

Beispielrichtung, nicht abschreiben:

- Vertrauen + Schleichen: Holm sagt den Satz über Boten ohne Lied — lass das Dorf *danach* leiser sein, nicht dankbarer.
- Kampf + verwundet: Witwe Kern verbindet. Gib ihr einen Satz Arbeit, keinen Heiligenschein.
- Tod: kein Moralpredigen. Der Wald nimmt das Geräusch.

### Stufe E — nur wenn A–D sitzen

- Ein weiterer benannter Dorfbewohner mit **einer** Funktion (Kind am Brunnen, Holzfäller in der Taverne — beide existieren schon als Stimme; sie dürfen ein Gesicht bekommen).
- Ein optionales Fundstück im Wald, das **kein neues System** ist: Brief, Anhänger, Kirchenstempel. Höchstens als Text + Flag fürs Ende.
- Neue Bilder nur für wiederkehrende Figuren, eigenständige Orte oder zentrale Enthüllungen. Stil: dunkles Low-Fantasy-Öl, keine Comic-Sprites, kein Photorealismus, kein Text im Bild. Vor neuen Motiven `BILDPLAN_DARKFANTASY.md` und `VISUELLE_STILANALYSE.md` lesen.

---

## 7. Figurenkarte (nicht überschreiben, nur füllen)

| Figur | Was feststeht | Was du füllen darfst |
|---|---|---|
| Held\*in | Name + ST/GE/CH, arm, staubige Stiefel | Innere Beobachtung in der 2. Person, keine Biografie |
| Holm | Bürgermeister, nasse Kiesel, leere Kasse, Siegel, Brief mit gebrochenem Wachs | Wie ein Amt ohne Wärme spricht, was er nicht sagen kann |
| Mara | Wirtin, wischt dieselbe Stelle, kennt Kess als Gast | Angst, die man wegzutrinken versucht; wer zuhört |
| Müllerin | Brunnen, Mehl, Posten auf dem Felsen, zwei Münzen | Vorsicht als Fürsorge, nicht als Questmarker |
| Kess | Narbe über der Lippe, stumpfer Säbel, würfelt, glaubt an Galgen | Intelligenz eines Mannes der zählen kann; keine Tragödie die ihn entschuldigt |
| Witwe Kern | Apotheke, Restbestand, verbindet am Ende | Hände, Geruch, kein Monolog |
| Köhler | Tritt aus Rauch, gibt Trank, barsch | Ein Auftritt. Nicht wiederkommen lassen, außer als Gerücht |

Keine Orks, Elfen, Göttererscheinungen, Prophezeiungen.

---

## 8. Qualität — wann du fertig bist

Bevor du aufhörst, prüfe:

1. Das Spiel ist in einem Durchlauf komplett spielbar: Erstellung → Dorf → Wald → Lager → eines der Enden.
2. Ein zweiter Durchlauf mit anderem Attribut-Schwerpunkt (nur Charisma vs. nur Stärke) fühlt sich **textlich** anders an, nicht nur in der Probe.
3. Jede neue Zeile klingt wie das Original, nicht wie Werbung.
4. Keine Wahl ohne Konsequenz. Keine Konsequenz ohne späteren Widerhall (Flag oder veränderter Satz).
5. HUD, Proben, Heiltrank, Schlüssel, Gold funktionieren noch.
6. Keine englischen Bruchstücke, kein Emoji, keine neuen Kernregeln.
7. Szenen-Karten bleiben lesbar: klare Absätze, vertikales Scrollen ohne horizontales Überlaufen, Bild noch erkennbar, Porträt nur wenn eine Figur die Szene trägt.

Wenn du unsicher bist zwischen „mehr Plot“ und „besserer Satz“: nimm den besseren Satz.

---

## 9. Arbeitsweise

1. Lies zuerst `attachments/how_to_be_a_hero_v01.py` (Stimme) und `src/game/script.ts` (was schon portiert ist).
2. Ändere eine Szene nach der anderen. Nicht das ganze Skript auf einmal umschreiben.
3. Bestehende Funktionssignaturen und Flag-Namen behalten (`banditenGewarnt`, nicht `banditsAlerted`).
4. Nach inhaltlichen Änderungen das Spiel von Hand durchklicken: Dorf-Schleife, eine Probe Erfolg, eine Probe Misserfolg, ein Ende.
5. Keine Refactors „zur Sauberkeit“. Keine neue Engine. Kein Save-System, außer der Auftraggeber fordert es extra.

---

## 10. Auftrag in einem Satz

**Mach aus dem Vertical Slice dasselbe Spiel, nur so, dass man Lindendorf hinterher noch riechen kann — und jede Entscheidung dort etwas hinterlässt.**
