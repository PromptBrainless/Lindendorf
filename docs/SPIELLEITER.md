# Spielleiter-Modus

Während des Spiels die **aktuelle Karte** anfassen, ohne Quest-Logik umzuschreiben.

## Öffnen

Knopf **Spielleiter** in der oberen Leiste, `Alt+S`, oder `?spielleiter=1`.

## Abschnitte (aufklappbar)

- Held: Gunst/Last sofort auf den Spieler
- Lage vorlegen: eine Herkunftsgeschichte, Spieler wählt
- Ereignis: **leer**, erst nach Auftrag (Wetter, Würfel, Gold/LP, Begegnung)
- Karte Bild/Portrait, Zustände festmachen/abnehmen, Text und Wahlen

Patch liegt im Browser unter `lindendorf.spielleiter.karten.v1`.

## Was nicht geht

Wahl-Anzahl ändern. Flags/Proben/Verzweigungen umbauen. Neue ArtKeys ohne Bildplan.
Automatisch Git. Entscheidungs-Log schreiben (kommt erst mit Block A, `docs/ERNEUERUNGSPLAN.md`).

Karten ohne feste IDs: Speicher am Text. Quelltext ändert sich → alter Patch tot.
Spätere Schicht: `id` an `present()`.
