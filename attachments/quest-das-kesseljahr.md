# Das Kesseljahr

Eine dritte vollständige Nebenquest für **Lindendorf** — anders als die ersten beiden geht es hier nicht um ein akutes Dorfproblem, sondern darum, dass der Held etwas über das Dorf selbst erfährt, das die meisten lieber vergessen hätten. Schauplätze: die Gasse hinter der alten Gerberei, die Kirche, das Rathaus — alles bereits bekannter Boden, nur mit einer zweiten Bedeutung.

---

## Abenteuer-Steckbrief

**Arbeitstitel:** Das Kesseljahr

**Grundspannung**
Ratsherr Vahl will die Gasse hinter der Gerberei endlich „ordnen" — ein neues Lagerhaus, sagt er, das Dorf brauche den Platz. Die Gasse liegt seit zehn Jahren leer, niemand benutzt sie, obwohl sie der kürzeste Weg zum Fluss wäre. Der alte Bettler Fenn, der sonst nie mehr sagt als nötig, bittet den Held zum ersten Mal um etwas: dass er wartet, bevor er den Bauplatz freigibt.

**Heldensituation**
Der Held hat mit dem Bauvorhaben nichts zu tun — bis Fenn ihm eine Frage stellt, die man nicht unbeantwortet lassen kann: „Weißt du, warum dort niemand mehr geht?" Wer einmal zuhört, kann nicht mehr so tun, als hätte er nichts gehört, wenn die Baumannschaft in einer Woche anrückt.

**Ausgangsort — drei Stationen mit unterschiedlicher Haltung**
- **Fenn vor der Kirche** — zurückhaltend, spricht in Andeutungen, muss zum Reden nicht überredet, sondern ihm muss zugehört werden.
- **Ratsherr Vahl im Rathaus** — glatt, sachlich, wehrt jede Verbindung zur Vergangenheit routiniert ab.
- **Die Gasse selbst** — verlassen, aber nicht vergessen; die Umgebung widerspricht Vahls Version von „ungenutztem Land".

**Prüfungsweg**
Der Weg zu Ilse Brandtners verschollenen Aufzeichnungen — versteckt dort, wo eine Hebamme vor zehn Jahren zuletzt Zuflucht suchte: im Gewölbe unter der Kirche, das offiziell nur für die Toten offensteht.

**Konfliktort**
Das Rathaus, Vahls Büro, am Abend vor der Baufreigabe — nicht mit Waffen, sondern mit dem, was der Held inzwischen weiß.

**Drei Lösungswege**
- **Charisma:** Vahl öffentlich vor dem Rat mit der Wahrheit konfrontieren.
- **Geschicklichkeit:** die Aufzeichnungen heimlich an jemand Vertrauenswürdigen weitergeben, ohne Vahl direkt anzugreifen.
- **Stärke** (im übertragenen Sinn — kein Kampf): Vahl unter vier Augen zwingen, die Bauarbeiten selbst zu stoppen, ohne dass die Wahrheit je öffentlich wird.

**Kosten**
Kein Blut, aber Ruf, Besitzverhältnisse, und der Frieden von Leuten, die sich zehn Jahre lang eingeredet haben, es sei vorbei.

**Endbilanz**
Erfährt das Dorf die Wahrheit? Bleibt Vahl im Amt? Und was wird aus Fenn, wenn seine Geschichte endlich jemand geglaubt hat?

---

## Figurenmatrix

| Figur | Innerer Druck | Sichtbarer Anker | Was merkt sie sich? |
|---|---|---|---|
| **Fenn**, alter Bettler | will vor seinem Tod, dass jemand die Wahrheit kennt — fürchtet aber, dass sie mehr zerstört als heilt | betastet ständig ein morsches Stück Lattenzaun in seiner Tasche | ob der Held zugehört hat, ohne zu drängen |
| **Ratsherr Vahl** | fürchtet, dass die Schuld seines Großvaters seinen eigenen Namen und Besitz vernichtet | dreht den Siegelring seines Großvaters am Finger, wenn er lügt | ob der Held ihn öffentlich bloßgestellt oder unter vier Augen gestellt hat |
| **Grete**, letzte Überlebende der Gasse, heute fast blind | hat sich zehn Jahre lang eingeredet, es sei besser zu vergessen | hält ein Medaillon fest, das einem ihrer verstorbenen Kinder gehörte | ob der Held sie zum Reden gedrängt oder in Ruhe gelassen hat |

---

## Flag-Matrix

| Flag | Wird gesetzt bei | Verändert später |
|---|---|---|
| `gasseGeschichteGehoert` | geduldiges Zuhören bei Fenn (kein Zwang nötig, nur Zeit) | schaltet die tiefere Frage bei Vahl frei, verändert Gretes Bereitschaft zu reden |
| `greteGespraech` | Besuch bei Grete, ohne sie zu drängen | liefert den entscheidenden Hinweis auf das Kirchengewölbe |
| `ilsesAufzeichnungenGefunden` | erfolgreiche Suche im Gewölbe (Geschick, schwer) | schaltet den Charisma- und Geschick-Weg am Konfliktort frei, verändert alle Enden |
| `vahlKonfrontiert` | direkte Anklage bei Vahl, ob öffentlich oder unter vier Augen | bestimmt, ob Holm später von der Sache erfährt |
| `loesungswegGasse` | `"veroeffentlicht"` \| `"weitergegeben"` \| `"erpresst"` \| `"vernichtet"` \| `null` | Endtitel, wie sich das Dorf und Vahl danach verhalten |

---

## Konsequenzmatrix

| Entscheidung | Sofortige Folge | Spätere Erinnerung | Mögliches Ende |
|---|---|---|---|
| Zuhören (Fenn Zeit lassen) | `gasseGeschichteGehoert`, kein Widerstand | Fenn vertraut dem Held später ohne Umschweife | öffnet fast alle Enden |
| Drängen (Grete zum Reden zwingen) | schnellerer Hinweis, aber sie schließt sich danach ganz | keine weiteren Details von ihr | erschwert Prüfungsweg |
| Veröffentlichen (Vahl öffentlich stellen) | sofortiger Skandal, Ratssitz wackelt | Dorf spaltet sich in „das musste raus" und „wozu jetzt noch" | „Was ausgegraben bleibt" |
| Weitergeben (Beweise an eine vertrauenswürdige Stelle) | leise, aber wirksam — Vahl weiß nicht, wer ihn stoppte | die Wahrheit wirkt im Hintergrund weiter | „Ein Name unter vielen" |
| Erpressen (Vahl zwingen, ohne Öffentlichkeit) | Bauvorhaben stoppt sofort, keine Konsequenzen für Vahl selbst | Vahl bleibt im Amt, dem Held aber verpflichtet | „Stille Rechnung" |
| Vernichten (Aufzeichnungen für Fenn zerstören) | Fenn findet Frieden, die Wahrheit verschwindet endgültig | niemand außer dem Held weiß es je | „Ein zweites Schweigen" |

---

## Szenenentwurf

### 1. Ankunft — Eine Frage vor der Kirche

> Fenn sitzt an seinem üblichen Platz, aber er sieht auf, bevor der Held vorbeigeht — zum ersten Mal, seit man sich erinnern kann.

**Zeilen:**
- „In einer Woche kommt die Baumannschaft für die Gasse. Vahl hat es im Rat verkündet, als wäre da nie etwas gewesen."
- „Weißt du, warum dort niemand mehr geht?" Er stellt die Frage, ohne eine Antwort zu erwarten.

**Wahlmöglichkeiten:** Fenn zuhören / Zum Rathaus gehen, Vahl fragen / Die Gasse selbst ansehen / Weitergehen (Quest lässt sich verlassen, aber die Baumannschaft kommt in Spielzeit näher)

### 2. Schleife — Drei Stationen

**Fenn vor der Kirche** — erzählt in eigenem Tempo vom Kesseljahr: Missernte, Pilzbefall, die abgeriegelte Gasse, das ausbleibende Korn. Kein Probenwurf nötig — nur Geduld. Wer ihn unterbricht oder drängt, bekommt eine kürzere, vagere Version und `gasseGeschichteGehoert` erst beim zweiten Versuch.

**Ratsherr Vahl im Rathaus** — spricht routiniert über „notwendigen Baugrund" und „zehn Jahre brachliegendes Land". *Nach der Quarantäne fragen* (nur verfügbar mit `gasseGeschichteGehoert`, Charisma, mittel) — Erfolg: Vahl wird kurz starr, gibt zu, dass sein Großvater „damals Verantwortung trug", mehr nicht. Misserfolg: er verweist auf die Kirche, „falls es dort noch alte Bücher gibt" — ein Hinweis, den er selbst nicht als Hinweis erkennt.

**Die Gasse selbst** — verwitterte Bretter, ein zugewachsener Ziehbrunnen, an einer Hauswand Kratzspuren, zu regelmäßig für Zufall — als hätte jemand gezählt. Geschick-Probe (leicht): ein loser Stein an der Gerberei verbirgt ein verwittertes Kinderspielzeug. Kein Flag nötig, nur Atmosphäre — aber es macht das folgende Gespräch mit Grete leichter.

### 3. Prüfungsweg — Grete und das Gewölbe

Grete lebt am Rand der Gasse, fast blind, spricht nur mit denen, die sich Zeit nehmen. Mit `gasseGeschichteGehoert` erzählt sie von Ilse Brandtner, der Hebamme, die eine Liste der Toten anlegte, bevor sie „im Mühlbach ertrank, an einem trockenen Abend". Sie erinnert sich, dass Ilse ihre Aufzeichnungen „dorthin brachte, wo man niemanden begräbt, den man vergessen will" — das Gewölbe unter der Kirche.

- *Den Pfarrer um Zutritt bitten* (Charisma, mittel) — Erfolg: er lässt den Held allein hinunter, ohne Fragen zu stellen, die er selbst nicht beantworten will.
- *Sich nachts hineinschleichen* (Geschick, schwer) — Misserfolg: der Küster erwischt den Held, meldet es aber nicht — „Manche Türen soll man besser nicht bewachen."
- Im Gewölbe: Geschick-Probe (schwer), zwischen namenlosen Grabnischen ein loser Stein, dahinter Ilse Brandtners in Wachstuch gewickelte Liste — Namen, Daten, eine knappe Zeile über die drei Ratsherren und die Aufteilung des Landes. Erfolg setzt `ilsesAufzeichnungenGefunden = true`.

### 4. Konfliktort — Vahls Büro am Abend vor der Baufreigabe

Vahl sitzt allein, der Siegelring dreht sich am Finger, bevor der Held überhaupt spricht.

**Verfügbare Wege (alle benötigen `ilsesAufzeichnungenGefunden`):**
- **Veröffentlichen:** die Liste vor der nächsten Ratssitzung vorlesen (Charisma, schwer). Erfolg: `loesungswegGasse = "veroeffentlicht"`, `vahlKonfrontiert = true` — der Skandal ist öffentlich, unumkehrbar.
- **Weitergeben:** die Liste heimlich Holm zustecken, ohne Vahl direkt zu nennen (Geschick, mittel). Erfolg: `loesungswegGasse = "weitergegeben"` — Holm handelt im Hintergrund, Vahl erfährt nie genau, wer ihn stoppte.
- **Erpressen:** Vahl unter vier Augen mit der Liste konfrontieren und verlangen, das Bauvorhaben sofort zu beenden (Charisma, mittel). Erfolg: `loesungswegGasse = "erpresst"`, `vahlKonfrontiert = true` — leise, wirksam, aber der Held trägt die Schuld nun mit.
- **Vernichten:** die Liste für Fenn verbrennen, ohne sie je zu zeigen — keine Probe nötig, nur die Entscheidung. `loesungswegGasse = "vernichtet"`.

### 5. Enden

**„Was ausgegraben bleibt"** (`veroeffentlicht`)
> Der Rat tagt drei Nächte hintereinander. Vahl verliert seinen Sitz, nicht aber sein Land — das gehört inzwischen niemandem mehr, den man noch belangen könnte. Fenn sitzt weiter vor der Kirche, aber die Leute grüßen ihn jetzt, bevor sie vorbeigehen, nicht erst danach.

**„Ein Name unter vielen"** (`weitergegeben`)
> Holm lässt den Bauplatz „aus Denkmalgründen" ruhen, ohne einen Namen zu nennen. Die Gasse bleibt leer, aber niemand fragt mehr, warum. Ilse Brandtners Liste liegt jetzt in einer Schublade, die niemand außer Holm und dem Held kennt.

**„Stille Rechnung"** (`erpresst`)
> Die Baumannschaft wird abbestellt, offiziell wegen „neuer Bedenken". Vahl grüßt den Held seither mit einer Höflichkeit, die mehr Angst als Respekt ist. Die Wahrheit bleibt vergraben — aber jetzt weiß mindestens einer, wo genau.

**„Ein zweites Schweigen"** (`vernichtet`)
> Das Papier brennt schneller, als der Held erwartet hatte. Fenn sagt nichts, als er es erfährt, nur dass seine Hand um das alte Zaunbrett einen Moment lang ruhig wird. Die Gasse wird bebaut. In zehn Jahren wird niemand mehr wissen, wonach sie benannt war.

---

## Hinweis zur Umsetzung

Kein Kampf, kein Todpfad im klassischen Sinn — die Risiken dieser Quest sind sozial, nicht körperlich. Neue Schauplätze: das Kirchengewölbe (ein einziger zusätzlicher ArtKey, z. B. eine dunklere Variante der bestehenden Kirchen- oder Kelleroptik) und Gretes Haus (kann sich einen bestehenden „ärmliche Kate"-ArtKey teilen). Fünf neue Flags, jede mindestens zweifach gelesen. Die Quest lässt sich unabhängig von den beiden anderen einbauen, gewinnt aber deutlich an Gewicht, wenn `held.buergermeisterVertraut` oder `held.muellerVertraut` aus den anderen Quests mitgelesen werden — Bertoks Mühle etwa könnte, falls gewünscht, in einer späteren Ausbaustufe direkt auf Land aus der Kesseljahr-Teilung stehen.
