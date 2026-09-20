# Browserbefund der Dark-Fantasy-Langfassung

**Historisch:** 17. September 2026. Layout seit 20. September: Bildstreifen **über** dem Text, HUD oben aufklappbar, kein Verlauf über dem Bild. Neue Prüfung nötig, dieser Befund gilt nicht als aktuelle Abnahme.

---


**Prüfzeit:** 17. September 2026, 17:55 Uhr

Der neue Titeltext wird korrekt angezeigt und positioniert das Projekt als ausführliches Dark-Fantasy-Abenteuer. Heldenerstellung und Navigation bleiben unverändert funktionsfähig.

Die erste ausführliche Prologkarte zeigt sechs Absätze vollständig innerhalb der scrollbaren Szenenansicht. Überschrift, HUD und Weiter-Schaltfläche bleiben zugänglich. Die Textfläche besitzt ausreichenden Kontrast vor dem Hintergrundbild. Auf Desktop bleibt die Bildwirkung sichtbar, während die Erzählkarte den unteren Bereich belegt.

Die neue Fassung wurde bis zum Beginn des Prologs im echten Browser geprüft.

## Mobile Prüfung

Der automatisierte Test verwendet 390 × 844 Pixel. Die sechs Absätze der ersten Prologkarte, HUD und Weiter-Schaltfläche passen ohne horizontales Überlaufen in eine Bildschirmhöhe. Die Schrift bleibt gut lesbar; das Hintergrundbild ist weiterhin als Atmosphäre sichtbar.

Die Fremden-Szene mit vier ausführlichen Entscheidungen benötigt 930 Pixel Dokumenthöhe und scrollt vertikal korrekt. Alle vier Wahlflächen bleiben vollständig erreichbar, brechen lange Texte sauber um und erzeugen kein horizontales Überlaufen. Das neue Fremdenbild bleibt hinter der dunklen Textfläche erkennbar, ohne die Lesbarkeit zu beeinträchtigen.

Prüfwerte: Prolog `horizontalOverflow=false`, Entscheidung `horizontalOverflow=false`, vier Wahlmöglichkeiten erkannt. Die Screenshots liegen in `qa-screenshots/mobile-prolog.png` und `qa-screenshots/mobile-stranger.png`.
