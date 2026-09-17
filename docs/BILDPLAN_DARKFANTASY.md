# Bildplan für die ausführliche Dark-Fantasy-Fassung

## Entscheidung

Die bestehenden Hauptbilder bleiben erhalten. Sie definieren bereits eine konsistente Low-Fantasy-Ölmalerei mit nassem Stein, Rauch, Moos, Ocker und geringer Sättigung. Neue Bilder sollen keine bloßen Varianten derselben Landschaft sein. Sie sollen nur dort entstehen, wo der ausführliche Text inzwischen einen eigenen Ort oder eine tragende Figur beschreibt, die im aktuellen Bildbestand visuell nicht vorkommt.

Alle neuen Hintergründe verwenden 16:9 bei 1792 × 1008 Pixeln. Die wichtigsten Motive liegen im mittleren Drittel oder seitlich, weil HUD und Textkarte oben und unten Raum benötigen. Bilder enthalten keine Schrift. Neue Porträts orientieren sich am Hochformat und der malerischen Oberfläche der bestehenden Figurenbilder.

## Priorität A: Größter erzählerischer Gewinn

| Neuer Schlüssel | Motiv | Aktuelle Wiederverwendung | Erzählerischer Nutzen |
|---|---|---|---|
| `stranger` | Verletzter Fremder im Regen, silbernes Kirchenartefakt halb unter dem Mantel | `road` | Macht die erste Würfelentscheidung zu einer eigenen Schlüsselszene und zeigt das zentrale Relikt. |
| `chapel` | Verfallene Kapelle am Glockenweg, kleine Eisenglocke, rotes Wachs, Geröll | `road` / `ditch` | Verbindet Glocke, Siegel, Warnsystem und dunkle Religiosität in einem eindeutigen Ort. |
| `apothecary` | Witwe Kerns enge, rauchige Apotheke mit Kräutern, klemmender Schublade und wenig Licht | `village` | Gibt der medizinischen Nebenhandlung und späteren Verwundungsfolgen ein eigenes Bild. |
| `smithy` | Schwache Esse, stumpfe Hacke, leere Hufeisen und nasses Kohlelager | `village` | Zeigt die materielle Not des Dorfes und stärkt den Schmied sowie die Bettler-Rückkehr. |
| `mill` | Mühlenraum mit Mahlstein, falschem Mehlsack und schwarzer Naht | `well` | Macht die Versorgungsintrige um gestohlene und gefälschte Lieferungen sichtbar. |
| `evidence` | Tisch oder Kiste im Lager mit gefälschtem Brief, rotem Wachs und Glockenzeichen | `camp` | Gibt der zentralen Enthüllung ein eigenes Bild statt einer weiteren Lageransicht. |

## Priorität B: Figuren mit wiederkehrender Wirkung

| Neuer Porträtschlüssel | Figur | Nutzen |
|---|---|---|
| `kern` | Witwe Kern, ältere Heilerin mit hochgekrempelten Ärmeln und Brandnarben | Wiederkehr in Apotheke und verwundeten Enden; starke menschliche Konstante. |
| `smith` | Namenloser Schmied, erschöpft, rußig, zitternde linke Hand | Verbindet Werkzeugquest, Bettler-Rückkehr und frühere Geschichte des Steinbruchs. |
| `sanna` | Junge Botin mit nasser Ledertasche und beschädigter Schnalle | Macht den Glockenweg menschlich und den verlorenen Brief bedeutsamer. |
| `beggar` | Alter Mann mit geflicktem Mantel und schwarzem Groschen | Trägt die Geschichte des verlorenen Sohns und der alten Glocke. |

## Priorität C: Spätere Ergänzungen

Ein eigener Innenraum für die Mühle, eine Nachtansicht des verlassenen Steinbruchs nach der Lösung und alternative Endbilder für stillen Sieg, gekauften Frieden und verwundete Rückkehr wären atmosphärisch wirksam. Sie sollten jedoch erst nach der ersten Bildrunde entstehen. Zu viele Endbilder würden Entwicklungszeit binden und nur kurze Teile eines Durchlaufs betreffen.

## Nicht empfohlen

`title`, `village`, `forest`, `camp`, `combat`, `gate`, `death` und `return` sollten nicht ersetzt werden. Sie funktionieren als visuelle Hauptanker. Ebenfalls nicht sinnvoll sind Gegenstands-Icons, Karten mit lesbarer Schrift, leuchtende Magieeffekte, Monsterillustrationen und Heldenporträts. Der Spieler soll die eigene Figur nicht durch ein festes Gesicht verlieren.

## Technische Integration

Neue Hintergrundschlüssel werden in `ArtKey`, `src/game/art.ts` und `public/art/` ergänzt. Die betroffenen Szenen erhalten den neuen Schlüssel, ohne ihre Logik zu verändern. Porträts werden in `PortraitKey` und `PORTRAITS` ergänzt. Nach jeder Bildgruppe folgen Assetprüfung, Typecheck, Build und ein Desktop-/Mobil-Screenshot.

## Empfohlener Umfang

Die erste Bildrunde sollte aus sechs Hintergründen und vier Porträts bestehen. Wenn ein kompakterer Umfang gewünscht ist, sind `stranger`, `chapel`, `apothecary`, `smithy` sowie die Porträts von Kern und Sanna die wirksamsten sechs Motive.
