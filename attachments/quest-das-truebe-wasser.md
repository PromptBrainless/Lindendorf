# Das trübe Wasser

Eine zweite vollständige Nebenquest für **Lindendorf**, ebenfalls innerhalb der bestehenden Dorf-Umgebung (Brunnen, Apotheke, Ratsweg, ein neuer kleiner Schauplatz am Dorfrand: die alte Zisterne). Unabhängig von „Die Schuld der Mühle" spielbar, kann aber denselben Held betreffen.

---

## Abenteuer-Steckbrief

**Arbeitstitel:** Das trübe Wasser

**Grundspannung**
Der Dorfbrunnen liefert seit einigen Tagen trübes, leicht bitteres Wasser. Erste Kinder und Alte sind krank geworden. Die Apothekerin Mirl hat kaum noch Mittel dagegen, und niemand im Rat will offen sagen, woran es liegt.

**Heldensituation**
Der Held trinkt selbst aus demselben Brunnen wie alle anderen. Ohne sauberes Wasser wird jeder Tag im Dorf riskanter — für ihn und für die Leute, auf die er angewiesen ist.

**Ausgangsort — drei Stationen mit unterschiedlicher Haltung**
- **Mirl in der Apotheke** — besorgt, offen, nennt Symptome und Verdacht direkt.
- **Ratsherr Dennek am Brunnenrand** — ausweichend, spielt die Lage herunter, verweist auf „trockenes Jahr".
- **Der Brunnen selbst** — physische Spur, die Denneks Erklärung widerspricht.

**Prüfungsweg**
Ein alter Ablaufgraben führt vom Brunnenschacht aus dem Dorf hinaus zu einer verfallenen Zisterne am Waldrand — der Weg prüft, ob der Held vorsichtig, kräftig oder überzeugend genug ist, dort ungestört anzukommen.

**Konfliktort**
Die Zisterne, bewohnt von Grovin, einem ehemaligen Brunnenbauer, der das Dorfwasser heimlich umgeleitet hat.

**Drei Lösungswege**
- **Stärke:** die Umleitung gewaltsam zerstören, Grovin vertreiben.
- **Geschicklichkeit:** die Sperre nachts unbemerkt öffnen, ohne Grovin zu wecken.
- **Charisma:** Grovin mit dem Rat konfrontieren oder ihn zu einem ehrlichen Handel bewegen.

**Kosten**
Zeit, in der weiter Menschen krank werden; möglicherweise Gold, falls verhandelt wird; Ruf, falls bestochen statt gelöst wird.

**Endbilanz**
Fließt wieder sauberes Wasser? Weiß das Dorf, wer schuld war? Und was hat der Held aus der Sache für sich selbst gemacht?

---

## Figurenmatrix

| Figur | Innerer Druck | Sichtbarer Anker | Was merkt sie sich? |
|---|---|---|---|
| **Mirl**, Apothekerin | hat kaum noch Mittel, sieht Kinder kränker werden | wiegt dieselbe Kräutermischung immer neu ab, weil sie nie reicht | ob der Held zuerst nach Kranken oder nach Belohnung fragt |
| **Dennek**, Ratsherr | fürchtet, für einen alten Fehler beim Brunnenbau verantwortlich gemacht zu werden | trommelt mit den Fingern auf die Brunnenmauer, wenn er lügt | ob der Held ihn bloßgestellt oder gedeckt hat |
| **Grovin**, ehemaliger Brunnenbauer | glaubt, dem Dorf stehe eine Entschädigung zu, die man ihm nie zahlte | prüft ständig den Wasserstand seiner eigenen Zisterne mit der flachen Hand | ob der Held ihn verstanden, bekämpft oder bestochen hat |

---

## Flag-Matrix

| Flag | Wird gesetzt bei | Verändert später |
|---|---|---|
| `truebungBestaetigt` | Gespräch mit Mirl über die Krankheitsfälle | schaltet dringlichere Dialogoptionen bei Dennek frei |
| `spurAmBrunnen` | erfolgreiche Geschick-Probe (leicht) am Brunnenrand: frische Grabspuren im Mörtel | verkürzt und erleichtert den Prüfungsweg |
| `dennekEntlarvt` | erfolgreiche Charisma- oder Stärke-Probe gegen Denneks Ausflüchte | Preis und Haltung Denneks in der Endbilanz |
| `grovinsGrund` | Gespräch mit Grovin über die nie gezahlte Entschädigung | schaltet den Verhandeln-Weg am Konfliktort frei |
| `loesungswegBrunnen` | `"zerstoert"` \| `"geoeffnet"` \| `"verhandelt"` \| `"bestochen"` \| `null` | Endtitel, Epilogtext, Denneks spätere Haltung |

---

## Konsequenzmatrix

| Entscheidung | Sofortige Folge | Spätere Erinnerung | Mögliches Ende |
|---|---|---|---|
| Zuhören (Mirl ernst nehmen) | `truebungBestaetigt` sicher, aber kein Vorschuss | Mirl hilft später kostenlos mit einem Heiltrank | begünstigt „Klares Wasser" |
| Druck (Dennek bloßstellen) | schnelle Wahrheit, aber Dennek wird feindselig | Dennek meidet den Held danach im Rat | erschwert Rückkehr-Dialoge |
| Zerstören (Sperre gewaltsam brechen) | sofortige Lösung, aber Grovin kann fliehen und später wiederkommen | offener Faden für spätere Inhalte | „Wasser mit einem Riss" |
| Öffnen (nachts, unbemerkt) | leise Lösung, kein Konflikt sichtbar | niemand im Dorf erfährt die Wahrheit | „Klares Wasser, stille Frage" |
| Bestechen (Grovin sein Schweigegeld zahlen, Wasser bleibt geteilt) | teuer, aber sofort ruhig | Grovin behält seine Zisterne, Wasser bleibt knapp verteilt | „Zwei Brunnen, ein Dorf" |

---

## Szenenentwurf

### 1. Ankunft — Der bittere Krug

> Der Wassereimer am Dorfbrunnen steht halb voll, niemand hat ihn heute Morgen geleert. Ein Kind hustet vor der Apotheke, die Mutter hält es fester, als das Husten es verlangt.

**Zeilen:**
- Mirl steht in ihrer Tür, die Ärmel hochgekrempelt, und ruft niemanden Bestimmten.
- Am Brunnenrand steht Dennek und rührt mit einem Stock im Eimer, als könnte er das Wasser so klären.

**Wahlmöglichkeiten:** Mit Mirl sprechen / Mit Dennek sprechen / Den Brunnen selbst untersuchen / Weitergehen

### 2. Schleife — Drei Stationen

**Mirl in der Apotheke** — nennt offen Symptome (Bauchschmerzen, Fieber, ein metallischer Geschmack) und ihre Vermutung, dass etwas Fremdes ins Wasser gelangt. Setzt bei ehrlichem Zuhören `truebungBestaetigt = true`, ohne Probe nötig.

**Dennek am Brunnenrand** — schiebt es zunächst auf ein „trockenes Jahr". *Bloßstellen* (Charisma oder Stärke, mittel) — bei Erfolg gibt er zu, dass der alte Brunnenbauer Grovin vor Jahren nie bezahlt wurde und seither verschwunden ist. Setzt `dennekEntlarvt = true`. Bei Misserfolg bleibt er stur, verrät aber unbewusst den Namen „Grovin", wenn man genau zuhört.

**Der Brunnen selbst** — Geschick-Probe (leicht): frischer Mörtel an einer Steinfuge, ein schmaler, kaum sichtbarer Abflussgraben Richtung Wald. Erfolg setzt `spurAmBrunnen = true`.

### 3. Prüfungsweg — Der Ablaufgraben

Ohne `spurAmBrunnen` muss der Held den Graben erst mühsam suchen (zusätzliche Geschick-Probe, mittel, vorher). Der Weg endet an einer halb überwucherten, aber sorgfältig instand gehaltenen Zisterne.

- *Sich durch dorniges Gestrüpp zwängen* (Stärke, leicht) — Misserfolg bedeutet einen kleinen Schaden und zerrissene Kleidung, aber kein Alarm.
- *Sich unbemerkt nähern* (Geschick, mittel) — Misserfolg bedeutet, Grovin erwartet den Held bereits bewaffnet mit einer Grabegabel.

### 4. Konfliktort — Grovins Zisterne

Grovin sitzt an seinem eigenen, klaren Wasserbecken und prüft den Stand mit der flachen Hand, als der Held ankommt. Er verteidigt sich zuerst mit ruhiger Stimme, nicht mit Gewalt.

**Verfügbare Wege:**
- **Zerstören:** die Umleitungssperre gewaltsam aufbrechen (Stärke, mittel). Erfolg: `loesungswegBrunnen = "zerstoert"`, Grovin flieht, das Dorfwasser fließt sofort wieder klar, aber Grovin bleibt als offener Faden.
- **Öffnen:** die Sperre nachts leise umlegen (Geschick, schwer, erleichtert bei `spurAmBrunnen`). Erfolg: `loesungswegBrunnen = "geoeffnet"`, niemand im Dorf erfährt je, was wirklich geschah.
- **Verhandeln:** nur wählbar mit `grovinsGrund` — Grovin anbieten, seine alte Entschädigung beim Rat einzufordern, wenn er die Sperre selbst öffnet (Charisma, mittel). Erfolg: `loesungswegBrunnen = "verhandelt"`, Grovin öffnet freiwillig, verlangt aber ein Versprechen.
- **Bestechen:** dem Held steht offen, Grovin stattdessen Gold zu zahlen, damit er weiter heimlich Wasser abzweigt, während der Hauptteil zurückfließt. `loesungswegBrunnen = "bestochen"` — eine bequeme, aber unehrliche Lösung.

### 5. Enden

**„Klares Wasser"** (`zerstoert` oder `geoeffnet`, `truebungBestaetigt`)
> Am nächsten Morgen ist der Eimer am Brunnen wieder klar bis auf den Grund. Mirl braut zum ersten Mal seit Tagen wieder etwas anderes als Fiebermittel. Niemand im Dorf fragt, warum — nur Dennek vermeidet für eine Weile den Brunnenrand.

**„Wasser mit einem Riss"** (`zerstoert`, ohne `dennekEntlarvt`)
> Das Wasser fließt wieder, aber Grovin ist verschwunden, nicht verschwunden genug. Manche Nächte hört man Schritte am Waldrand, die niemand dem Dorf zuordnen will.

**„Zwei Brunnen, ein Dorf"** (`bestochen`)
> Das Wasser wird klarer, aber nie wirklich genug für alle. Mirl braut weiter dieselbe Mischung ab, nur seltener. Der Held trägt das Wissen allein.

**Todpfad** (Sturz in die Zisterne ohne Heilung, oder verlorener Kampf gegen Grovins Grabegabel)
> Die Zisterne bleibt klar und still. Das Dorf wartet weiter auf einen Boten, der nicht zurückkommt.

---

## Hinweis zur Umsetzung

Neuer Schauplatz: die Zisterne am Waldrand (ein einziger zusätzlicher ArtKey, z. B. eine Variante des bestehenden Wald- oder Steinbruch-Bildes würde genügen). Fünf neue Flags, jede mindestens zweifach gelesen. Kein neuer Gegenstand nötig. Die Quest lässt sich unabhängig von „Die Schuld der Mühle" einbauen, könnte aber bei Bedarf denselben `buergermeisterVertraut`-Wert aus der Haupthandlung mitlesen, um Denneks Reaktion auf einen bereits angesehenen Helden leicht abzumildern.
