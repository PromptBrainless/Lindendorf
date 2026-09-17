# Die Schuld der Mühle

Eine vollständige Nebenquest für **Lindendorf**, spielbar innerhalb der bestehenden Dorf-Schleife und ihrer unmittelbaren Umgebung (Mühle, Uferpfad, verlassenes Lagerhaus am Fluss). Kein neuer Wald, kein neues Kapitel — nur ein zweiter Grund, warum der Held nicht einfach weiterziehen kann.

---

## Abenteuer-Steckbrief

**Arbeitstitel:** Die Schuld der Mühle

**Grundspannung**
Seit zwei Wochen liefert die Mühle kein Mehl mehr. Die Vorratskammer der Taverne ist leer, Holm bekommt im Rathaus keine ruhigen Antworten, und der Müller Bertok lässt niemanden mehr über die Türschwelle.

**Heldensituation**
Ohne Mehl kein Brot, ohne Brot kein Vorschuss von der Wirtin, kein Proviant für den Weg. Der Held braucht die Mühle wieder in Gang — und der Bürgermeister bittet ausdrücklich darum, bevor das Gerücht lauter wird als die Wahrheit.

**Ausgangsort — drei Stationen mit unterschiedlicher Haltung**
- **Bertok am Mahlwerk** — verteidigt, verschweigt, lenkt ab.
- **Senna in der Kornkammer** — ängstlich, zählt, könnte reden, wenn man ihr Zeit lässt.
- **Das Wasserrad und der Uferweg** — die Umgebung widerspricht dem, was Bertok sagt.

**Prüfungsweg**
Der Uferpfad flussabwärts zu einem verlassen wirkenden Lagerhaus prüft, ob der Held leise, kräftig oder überzeugend vorgegangen ist — und ob er überhaupt weiß, wohin er geht.

**Konfliktort**
Renniks Kontor im Lagerhaus. Verhandelt wird Getreide, Schweigen und die Frage, wer hier wen wirklich in der Hand hat.

**Drei Lösungswege**
- **Stärke:** Rennik und seinen Wächter aus dem Lagerhaus treiben.
- **Geschicklichkeit:** sich am Wächter vorbeischleichen und den Schuldschein stehlen.
- **Charisma:** Rennik mit seinem eigenen Diebstahl konfrontieren und zum Rückzug zwingen.

**Kosten**
Zeit, Vertrauen, möglicherweise Blut — und, falls verraten wird, eine Familie.

**Endbilanz**
Fließt wieder Mehl? Weiß das Dorf, warum? Und wer erinnert sich später daran, wie der Held vorgegangen ist?

---

## Figurenmatrix

| Figur | Innerer Druck | Sichtbarer Anker | Was merkt sie sich? |
|---|---|---|---|
| **Bertok**, Müller | will weder die versteckte Familie noch sich selbst vor Rennik preisgeben | prüft immer wieder das längst justierte Mahlwerk | ob der Held gedroht oder abgewartet hat |
| **Senna**, seine Frau | Angst um ihre Schwester und deren Kinder in der Kornkammer | zählt dieselben Mehlsäcke immer wieder nach | ob der Held sie bedrängt oder ihr Zeit gelassen hat |
| **Yorwin**, versteckter Schwager | will nur, dass die Kinder ruhig bleiben | hält ein zerbrochenes Werkzeug aus dem alten Hof fest | ob der Held sie entdeckt und geschont oder verraten hat |
| **Rennik**, Kornhändler | presst Bertok, weil er selbst einem größeren Gläubiger im Nachbarort etwas schuldet | wiegt fremdes Getreide auf einer kleinen Waage ab, die ihm nicht gehört | ob der Held ihn bloßgestellt, bezahlt oder bekämpft hat |

Vier Figuren, jede mit eigener Funktion: Bertok liefert den Auftrag, Senna die erste echte Information, Yorwin macht die Kosten des Verrats konkret, Rennik ist der Konfliktkern. Kein Name ohne Aufgabe.

---

## Flag-Matrix

| Flag | Wird gesetzt bei | Verändert später |
|---|---|---|
| `spurenGefunden` | erfolgreicher Beobachtung am Wasserrad (Geschick, leicht) | Dialogoption bei Senna, Schwierigkeit des Prüfungswegs |
| `muellerVertraut` | erfolgreicher Charisma-Probe mit Bertok statt Drohung | Preis am Ende, ob Bertok vor dem Wächter warnt |
| `fluechtlingeEntdeckt` | Fund der Kornkammer-Nische oder Gespräch mit Yorwin | Optionen am Konfliktort, Text des Endes |
| `renniksBeweis` | gefundener Schuldschein bei Bertok oder im Lagerhaus | schaltet den Verhandeln-Weg frei, verändert Renniks Schicksal im Epilog |
| `loesungswegMuehle` | `"kampf"` \| `"schleich"` \| `"verhandelt"` \| `"verraten"` \| `null` | Endtitel, Epilogtext, spätere Erwähnung durch Holm |

Kein Flag wird nur einmal gelesen. `renniksBeweis` etwa entscheidet sowohl über die verfügbare Wahl am Konfliktort als auch über Renniks Verbleib danach.

---

## Konsequenzmatrix

| Entscheidung | Sofortige Folge | Spätere Erinnerung | Mögliches Ende |
|---|---|---|---|
| Vertrauen (Senna Zeit lassen) | langsamer, aber `spurenGefunden` leichter zu bestätigen | Senna redet beim zweiten Besuch von selbst | begünstigt „Stilles Mehl" |
| Druck (Bertok/Senna bedrängen) | schnellere Antwort, aber Misstrauen | Bertok wird einsilbig, warnt nicht vor dem Wächter | erschwert Konfliktort |
| Schleichen (Steg, Wächter) | leise, aber zeitaufwendig | Rennik ahnt nichts, Überraschung möglich | begünstigt „Der Beweis verschwindet still" |
| Kampf (Lagerhaus) | schnell, riskiert Schaden | das Dorf hört von Gewalt | „Mehl mit rauen Händen" |
| Verrat (bei Holm melden) | Mühle bekommt offiziellen Schutz | Bertok vertraut dem Held danach nicht mehr | „Sicheres Mehl, leere Blicke" |

---

## Szenenentwurf

### 1. Ankunft — Die stumme Mühle

> Kein Mehlstaub in der Luft, obwohl das Rad sich dreht. Vor der Tür lehnt ein leerer Karren, dessen Deichsel schon Moos angesetzt hat. Bertok steht im Eingang, bevor der Held überhaupt klopfen kann.

**Zeilen:**
- „Kein Mehl heute. Kein Mehl seit zwei Wochen." Bertok sagt es, bevor jemand fragt.
- Hinter ihm bewegt sich etwas zwischen den Säcken — zu schnell für eine Ratte.

**Wahlmöglichkeiten:**
- Mit Bertok sprechen
- Zu Senna in die Kornkammer gehen
- Das Wasserrad und den Uferweg ansehen
- Die Mühle verlassen

Der Held kann diese Schleife beliebig oft durchlaufen, bis er geht. Jede Station lässt sich mehrfach besuchen, ändert aber ihre Antwort je nach vorherigem Verhalten.

### 2. Schleife — Drei Stationen

**Bertok am Mahlwerk**
Erste Karte: er behauptet, das Wasser stehe zu niedrig, das Korn sei schlecht, es gebe „Ärger mit der Lieferung", ohne Namen zu nennen. Zwei Zugänge:

- *Vertrauen gewinnen* (Charisma, mittel) — bei Erfolg: `muellerVertraut = true`, Bertok erwähnt „einen Mann, der zu oft am Ufer steht". Bei Misserfolg: er wiederholt seine Ausrede, lässt aber die Hand auf dem Mahlstein zittern.
- *Druck machen* — sofortiger Fortschritt, aber Senna hört das Gespräch aus der Kammer und wird beim nächsten Besuch stiller.

**Senna in der Kornkammer**
Sie zählt Säcke, die längst gezählt sind. Bei geduldigem Vorgehen (kein `muellerVertraut`-Zwang nötig) erwähnt sie beim zweiten Besuch beiläufig „die Schuld, die Bertok drückt" — genug, um `fluechtlingeEntdeckt` vorzubereiten, ohne die Familie sofort preiszugeben.

**Das Wasserrad und der Uferweg**
Eine Geschick-Probe (leicht) auf Spurenlesen: nasse Schleifspuren, die vom Mühlkeller Richtung Fluss führen, keine Tierspur, sondern die eines gezogenen Sacks — und eines Kinderschuhs. Erfolg setzt `spurenGefunden = true`. Bei Misserfolg bleibt der Weg vage, der Held muss später blinder ins Lagerhaus.

### 3. Prüfungsweg — Der Uferpfad

Ohne `spurenGefunden` ist die Strecke länger und die folgende Probe erschwert. Der Pfad endet an einem morschen Steg vor einem Lagerhaus mit halb verhängten Fenstern.

- *Den Steg überqueren* (Stärke, mittel, `SCHWER` falls `verwundet`) — Misserfolg bedeutet Sturz ins kalte Wasser, Schaden und ein lauteres Ankommen (Wächter ist vorgewarnt).
- *Am Wächter vorbeikommen* — je nach vorherigem Weg zwei Varianten: *sich vorbeischleichen* (Geschick, mittel) oder, falls `muellerVertraut`, *sich auf Bertoks Namen berufen* (Charisma, leicht — Bertok hat vorgewarnt, dass „jemand kommt, der Fragen stellt").

### 4. Konfliktort — Renniks Kontor

Rennik sitzt an einem Kontortisch, wiegt Getreide ab, das nicht ihm gehört. Neben ihm ein Wächter, an der Wand ein Bündel Schuldscheine.

**Verfügbare Wege:**
- **Kampf:** direkte Auseinandersetzung mit dem Wächter. Schaden möglich, danach `tot(held)` prüfen. Erfolg: `loesungswegMuehle = "kampf"`, Rennik flieht, Beweise bleiben zurück (setzt `renniksBeweis`, falls noch nicht gesetzt).
- **Schleichen:** bei `spurenGefunden` und erfolgreicher Geschick-Probe (mittel) den Schuldschein stehlen, ohne dass Rennik es merkt. `loesungswegMuehle = "schleich"`, `renniksBeweis = true`.
- **Verhandeln:** nur wählbar, wenn `renniksBeweis` bereits aus einem früheren Fund vorliegt (etwa bei Bertok, wenn `muellerVertraut`). Charisma-Probe (mittel): Rennik wird mit seinem eigenen Diebstahl an einem größeren Gläubiger konfrontiert. Erfolg: `loesungswegMuehle = "verhandelt"`, Rennik zieht ab, ohne Gewalt.
- **Verraten:** die Alternative außerhalb des Lagerhauses — zurück zu Holm gehen und die versteckte Familie melden, um offiziellen Schutz für die Mühle zu erwirken. `loesungswegMuehle = "verraten"`, `fluechtlingeEntdeckt` wird dabei vorausgesetzt.

Jeder erfolgreiche Weg außer „verraten" setzt zusätzlich `fluechtlingeEntdeckt`, falls noch nicht geschehen — Rennik erwähnt sie ohnehin als Druckmittel.

### 5. Enden

**„Stilles Mehl"** (`schleich` oder `verhandelt`, `fluechtlingeEntdeckt`, kein Verrat)
> Am nächsten Morgen dreht sich das Rad lauter als sonst. Bertok reicht dem Held einen vollen Sack, ohne ein Wort über die Nacht zu verlieren. Aus der Kornkammer ist nichts mehr zu hören. Manche Schulden werden nicht bezahlt, nur nicht mehr eingetrieben.

**„Mehl mit rauen Händen"** (`kampf`)
> Das Mehl fließt wieder, aber im Dorf redet man über die Männer, die man am Steg gesehen hat, mit blutiger Nase. Bertok bedankt sich knapp und schließt die Tür einen Spalt früher als nötig.

**„Sicheres Mehl, leere Blicke"** (`verraten`)
> Die Wache holt die Familie noch vor Mittag. Die Mühle bekommt ihren Schutzbrief, das Mehl kommt pünktlich. Bertok grüßt den Held künftig mit dem Kopf, nicht mit der Hand.

**Todpfad** (Sturz vom Steg ohne Heilung, oder verlorener Kampf im Lagerhaus)
> Der Fluss nimmt, was er bekommt. In der Mühle dreht sich das Rad weiter, für niemanden im Besonderen.

---

## Hinweis zur Umsetzung

Alle Orte liegen innerhalb der bestehenden Dorf-Umgebung (Mühle, Uferweg, ein neues, kleines Lagerhaus als einziger zusätzlicher Schauplatz — kein neuer Bildschlüssel zwingend nötig, ein bestehendes „Lager"- oder „Schuppen"-Art könnte genügen). Neue Flags sind fünf, jede mindestens zweifach gelesen. Ein neuer Gegenstand ist nicht zwingend nötig; `renniksBeweis` funktioniert als reines Flag, kann aber bei Bedarf als `Schuldschein`-Item ins Inventar wandern, falls ein greifbarer Gegenstand gewünscht ist.
