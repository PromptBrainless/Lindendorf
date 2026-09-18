# Spielleiter-Modus

Während des Spiels die **aktuelle Karte** anfassen, ohne Quest-Logik umzuschreiben.

## Öffnen

- Knopf **Spielleiter** in der Leiste
- Taste `Alt+S`
- oder URL `?spielleiter=1`

## Was geht jetzt

Auf der sichtbaren Karte: Titel, Absätze, Wahltexte, vorhandenes ArtKey/Portrait, optionale Bild-URL.
Sofort sichtbar. Liegt im Browser unter `lindendorf.spielleiter.karten.v1`.
**Patch kopieren** gibt JSON für die Quest-Datei.

## Was nicht geht (absichtlich)

- Anzahl der Wahlen ändern — der Lauf liest den Index, nicht den Text.
- Flags, Proben, Verzweigungen umbauen.
- Neue ArtKeys ohne Bildplan.
- Automatisch ins Git schreiben.

Karten haben noch keine festen IDs. Der Speicher erkennt eine Karte am Text. Ändert der Quelltext, gilt der alte Patch nicht mehr.

Nächste Schicht, falls nötig: `id` an `present()`, dann sitzt der Patch unabhängig vom Wortlaut.
