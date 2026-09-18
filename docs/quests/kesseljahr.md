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
| `gasseGeschichteGehoert` | geduldiges Zuhören bei Fenn | schaltet die tiefere Frage bei Vahl frei, verändert Gretes Bereitschaft |
| `greteGespraech` | Besuch bei Grete | liefert den Hinweis auf das Kirchengewölbe |
| `ilsesAufzeichnungenGefunden` | erfolgreiche Suche im Gewölbe | schaltet die Lösungswege am Konfliktort frei |
| `vahlKonfrontiert` | direkte Anklage bei Vahl | bestimmt, ob Holm später von der Sache erfährt |
| `loesungswegGasse` | `veroeffentlicht` / `weitergegeben` / `erpresst` / `vernichtet` | Endtitel und Dorferinnerung |

Geduldiges Zuhören bei Grete nennt Stein und Lohe-Geruch (Suche mittel).
Drängen erschwert Pfarrer, Schleichen und Suche.
Lange Karten sind in zwei `present`-Schritte geteilt. Nachspiele unterscheiden alle vier Ausgänge.
