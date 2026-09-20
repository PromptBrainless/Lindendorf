# Kontextpflege für Lindendorf

## Zweck

`PROJEKTKONTEXT.md` ist der kompakte Übergabepunkt. Die technische Reihenfolge steht in `docs/ERNEUERUNGSPLAN.md`. Der Kontext ersetzt nicht das Register und enthält keine Gesprächsprotokolle.

## Aktualisierungspunkte

Der Kontext wird vor einer größeren Strukturänderung, nach jedem abgeschlossenen Arbeitsblock, vor einem bewusst erzeugten Zwischenstopp und vor einem Commit aktualisiert. Nach einer Fehlersuche wird nur die Ursache und die bestätigte Korrektur ergänzt. Routineänderungen ohne neue Entscheidung brauchen keinen langen Eintrag.

## Pflichtfelder

Jeder Snapshot enthält Datum und Uhrzeit, Entwicklungsstatus, Serverstatus, den letzten bestätigten Teststand, den letzten Commit, uncommittete Dateien, offene Risiken und den nächsten sicheren Arbeitsschritt.

## Schreibregeln

Der Text bleibt kurz und entscheidungsorientiert. Bereits stabile Regeln werden nicht erneut erklärt. Unbestätigte Architektur wird ausdrücklich als „pausiert“ oder „Experiment“ markiert. Vermutungen stehen nicht im Abschnitt „stabiler Stand“. Jede neue Datei wird nur genannt, wenn sie für die nächste Sitzung relevant ist.

## Sitzungsbeginn

Zu Beginn einer neuen Sitzung wird zuerst `PROJEKTKONTEXT.md` gelesen. Danach werden nur die dort genannten relevanten Dateien geprüft. Ein vollständiges erneutes Lesen des gesamten Skripts ist nicht nötig, solange der Snapshot aktuell ist.

## Sitzungsende

Vor dem Stoppen wird der Snapshot aktualisiert. Anschließend werden der Git-Status, die Existenz des Dokuments und — wenn ein Server verwendet wurde — der Serverstatus geprüft. Bei uncommitteten Experimenten muss klar bleiben, ob sie erhalten, getestet, zurückgebaut oder später separat committed werden sollen.

## Qualitätsgrenze

Kontextpflege darf keine ungetestete Funktion als fertig darstellen. Ein Typecheck allein bedeutet keine Browserabnahme. Ein Browser-Smoke-Test allein bedeutet keine vollständige Pfadabnahme. Der Snapshot trennt diese Aussagen ausdrücklich.
