# Werkstatt — Editor-Prototyp

Erreichbar vom Titel (**Werkstatt**) oder `/editor`. Läuft **neben** dem Spiel, startet es nicht.

Kein neues State-Framework, kein Monaco. Dieselbe Engine wie das Abenteuer.

| Fach | Was |
|---|---|
| Fluss | Intro → Dorf → Hang → Wald → Lagerwege → Ende, mit echten Lager-/Intro-Sätzen |
| Probe | echtes `probe()`, Nebel, Erschöpfung |
| Wissen | Flags kippen, Journal und Ruf aus `deriveKnowledge` |
| Pfade | Mühle, Brunnen, Gasse, Lager — Journal ohne Durchspielen |
| Tote Knoten | Dead-Node-Finder + Layoutbreite |
| Bilder | HEAD auf ArtKeys und Porträts |
| Module | JSON-Export Intro/Lager, JSON lesen |

Playwright bleibt die mobile Prüfung **im Spiel**. Die Werkstatt prüft Fluss, Wissen und Assets im Browser.

Schritt 14 des Erneuerungsplans.
