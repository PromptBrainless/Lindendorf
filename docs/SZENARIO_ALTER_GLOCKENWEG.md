# Der alte Glockenweg

Inhaltsspec. **Nicht** vor Block A des `docs/ERNEUERUNGSPLAN.md` ausbauen.
Technische Reihenfolge: Schema und Log zuerst.

## Grundidee


Oberhalb von Lindendorf führt ein alter Versorgungsweg zu einer verlassenen Kapelle. Früher kamen dort Salz, Mehl und Nachrichten über den Pass. Seit die Straße aufgegeben wurde, hängt in der Kapelle noch eine kleine Signalglocke.

Die Banditen nutzen den Weg nicht als festen Stützpunkt, sondern als **Auge und Ohr**: Ein Läuten warnt sie vor Reisenden. Ein Teil der gestohlenen Vorräte wird über den alten Weg bewegt. Dadurch bekommt die Bedrohung um den Steinbruch eine Umgebung, ohne dass ein zweites Dorf oder ein neues Hauptkapitel nötig wird.

Der Glockenweg ist eine **optionale Dorf- und Vorbereitungszone**. Der Hauptfluss bleibt:

**Heldenerstellung → Dorf → Wald → Banditenlager → Ende**

Der Glockenweg gehört als freiwilliger Seitenknoten in die Dorfschleife. Seine Folgen werden im Wald und am Lager sichtbar.

## Ton und Bildsprache

Der Ort ist nicht mystisch. Die Kapelle ist alt, feucht und praktisch geworden. Das Glockenseil riecht nach Moder. Salz liegt in einer Ritze. Der Wind bewegt die Glocke manchmal, aber nicht genug, um sich selbst die Schuld zu geben.

Vorhandene ArtKeys werden wiederverwendet:

- `road` für den Aufstieg;
- `forest` für die Böschung und den Weg;
- `ditch` für den eingestürzten Versorgungspfad;
- `camp` nur als Übergang zum Banditenlager.

Neue Bilder sind für diesen Vertical Slice nicht nötig.

## Personen

### Sanna — die Botin

Sanna trägt einen nassen Mantel und eine Ledertasche ohne Brief. Sie wollte eine Nachricht nach Lindendorf bringen, hat sie aber im Geröll verloren. Sie vertraut dem Weg mehr als den Menschen, was kein besonders guter Ruf für den Weg ist.

- **Druck:** Sie darf nicht mit leeren Händen zurückkehren.
- **Anker:** Sie zählt die Schnallen ihrer Tasche.
- **Funktion:** Sie kennt die Signale der Banditen und kann erklären, warum das Läuten gefährlich ist.
- **Quest:** Der verlorene Brief.

### Jorren — der Salzträger

Jorren ist kein Händler, sondern ein Mann, der einen Sack trägt, weil sonst niemand da ist. Ein Teil seiner Ladung ist im Geröll verschwunden. Er will sie bergen, bevor der Regen sie auflöst.

- **Druck:** Er haftet für Ware, die ihm nicht gehört.
- **Anker:** Er leckt über den Daumen, bevor er einen Knoten prüft.
- **Funktion:** Er macht die Versorgung der Banditen konkret und gibt dem Helden eine kleine, praktische Belohnung.
- **Quest:** Der Sack im Geröll.

### Die Kapelle und ihre Glocke

Die Kapelle braucht keinen Geist und keinen Priester. Die Glocke ist ein Werkzeug. Wer sie stoppt, nimmt den Banditen einen Teil ihrer Vorbereitung.

- **Druck:** Das morsche Seil kann jederzeit reißen.
- **Anker:** Jeder Windstoß bringt ein kurzes Metallgeräusch.
- **Funktion:** Eine Geschicklichkeitsaufgabe mit direkter Wirkung auf die Wachsamkeit des Lagers.
- **Quest:** Die Glocke zum Schweigen bringen.

## Unterquests

### 1. Der verlorene Brief

Sanna hat die Nachricht verloren. Der Held kann:

- die Spur im Geröll mit Geschicklichkeit lesen;
- Sanna mit Charisma beruhigen und den Inhalt rekonstruieren;
- die Sache ablehnen.

Bei Erfolg wird `sannaGeholfen` gesetzt. Im Wald kennt der Held danach eine sichere Abzweigung. Die Quest gibt keinen magischen Lohn und keine neue Ausrüstung.

### 2. Der Sack im Geröll

Jorren bittet um Hilfe. Der Held kann:

- den Stein mit Stärke bewegen;
- die Last mit Geschicklichkeit sichern;
- den Sack liegen lassen.

Bei Erfolg wird `salzGerettet` gesetzt und der Held erhält eine kleine Goldzahlung. Im Wald steht später ein konkreter Satz über den Salzstaub am Weg. Die Beute bleibt klein.

### 3. Die Glocke zum Schweigen bringen

Der Held kann das morsche Seil prüfen und die Glocke sichern. Bei Erfolg wird `glockeGestoppt` gesetzt. Bei Misserfolg wird `banditenGewarnt` gesetzt, weil das Metall über den Hang trägt.

Die Glocke zu stoppen ist kein „guter“ Weg, sondern Vorbereitung. Der Spieler nimmt den Banditen ein Werkzeug, aber er muss dafür näher an die Kapelle.

## Spätere Wirkungen

- `sannaGeholfen`: Der Wald beschreibt eine sichere Abzweigung. Die Umgebung fühlt sich informiert statt zufällig an.
- `salzGerettet`: Der Held bekommt eine kleine Belohnung und erkennt im Wald Salzspuren, die den Transportweg bestätigen.
- `glockeGestoppt`: Das Banditenlager ist bei der Ankunft weniger vorbereitet.
- Misserfolg an der Glocke: `banditenGewarnt` wird gesetzt. Das Lager weiß, dass jemand am Glockenweg war.

## Qualitätsgrenze

Der Glockenweg liefert **keine neue Hauptfraktion, keine Magie, keine neuen Attribute und kein neues Inventarsystem**. Er erweitert die Entscheidungsmöglichkeiten des Spielers, aber nicht die Grundregeln.

Der Ort soll nach einem Durchlauf als nasser Aufstieg, rostiges Metall, Salzstaub und ein Mann mit einer Tasche ohne Brief in Erinnerung bleiben.
