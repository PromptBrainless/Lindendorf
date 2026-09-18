# Das Kesseljahr

Eine dritte vollständige Nebenquest für **Lindendorf** — anders als die ersten beiden geht es hier nicht um ein akutes Dorfproblem, sondern darum, dass der Held etwas über das Dorf selbst erfährt, das die meisten lieber vergessen hätten. Schauplätze: die Gasse hinter der alten Gerberei, die Kirche, das Rathaus — alles bereits bekannter Boden, nur mit einer zweiten Bedeutung.

---

## Umsetzung (Code)

Modul: `src/game/quest-kesseljahr.ts` (`dorfGasse`).
Einstieg: Dorf → *Zur Gerbereigasse gehen*.

Kollisionen:
- **Fenn** sitzt an der Kirche, Porträt `null`. Der namenlose Brunnenbettler (`beggar`) bleibt unangetastet.
- **Vahl** ist ein zweiter Ratsherr neben Dennek, nicht Holm.
- Stärke-Weg am Konfliktort ist eine echte Stärke-Probe unter vier Augen (`erpresst`), nicht Charisma.
- Kein Todpfad. ArtKeys: chapel, village, townhall, ditch, evidence, sneak.

Ausformulierung (18.9.2026): lange Karten in zwei `present`-Schritte geteilt.
Geduldiges Zuhören bei Grete nennt Stein und Lohe-Geruch (Suche mittel).
Drängen erschwert Pfarrer, Schleichen und Suche. Hub zeigt frische Bretter
nach dem ersten Gang in die Gasse. Nachspiele und Taverne unterscheiden
alle vier Ausgänge.
