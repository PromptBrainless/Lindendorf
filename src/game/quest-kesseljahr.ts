import { probe } from "./engine";
import type { Runtime } from "./runtime";
import { LEICHT, MITTEL, SCHWER, tot, type Held } from "./types";

export async function dorfGasse(rt: Runtime, held: Held) {
  if (held.loesungswegGasse) {
    await gasseNachspiel(rt, held);
    return;
  }

  if (!held.gasseBesucht) {
    held.gasseBesucht = true;
    await rt.present({
      title: "Vor der Kirche",
      art: "chapel",
      portrait: null,
      held,
      lines: [
        "Die Kirche steht einen Schritt tiefer als der Platz. An der Schwelle steht Regenwasser und läuft nicht ab.",
        "Fenn sitzt im Schatten der Kirchmauer, nackte Füße im kalten Wasser der Rinne. Er hebt den Blick, bevor du vorbeigehst. Zum ersten Mal, seit man sich erinnern kann.",
        "In der Tasche hält er ein morsches Stück Lattenzaun, glatt von zehn Wintern.",
      ],
    });
    await rt.present({
      held,
      lines: [
        held.loesungswegMuehle === "verraten"
          ? "„Die Wache holt Leute, wenn jemand redet. Trotzdem muss einer zuhören, bevor sie Bretter über die Gasse legen.“"
          : "„In einer Woche kommt die Baumannschaft. Vahl hat im Rat verkündet, hinter der Gerberei stehe ein Lagerhaus. Als wäre da nie etwas gewesen.“",
        "Er wartet nicht auf eine Antwort. Die Hand in der Tasche bleibt in Bewegung.",
      ],
    });
  }

  while (!tot(held) && !held.loesungswegGasse) {
    const items: { id: string; label: string }[] = [
      { id: "fenn", label: "Bei Fenn an der Kirchmauer bleiben" },
      { id: "vahl", label: "Ratsherr Vahl im Rathaus aufsuchen" },
      { id: "gasse", label: "Die Gasse hinter der Gerberei ansehen" },
    ];
    if (held.gasseGeschichteGehoert || held.gasseSpielzeugGefunden || held.gasseOrtGesehen || held.greteGespraech) {
      items.push({
        id: "grete",
        label: held.greteGespraech ? "Noch einmal zu Grete gehen" : "Die blinde Frau am Gassenrand aufsuchen",
      });
    }
    if (held.greteGespraech) {
      items.push({
        id: "gewoelbe",
        label: held.ilsesAufzeichnungenGefunden
          ? "Das Gewölbe unter der Kirche noch einmal betreten"
          : "Das Gewölbe unter der Kirche suchen",
      });
    }
    if (held.ilsesAufzeichnungenGefunden) {
      items.push({ id: "konflikt", label: "Vahl am Abend vor der Baufreigabe stellen" });
    }
    items.push({ id: "dorf", label: "Zurück zum Dorfplatz" });

    const wahl = await rt.present({
      title: "Die leere Gasse",
      art: "village",
      portrait: null,
      held,
      lines: hubZeilen(held),
      choices: items.map((item) => item.label),
    });
    const id = items[wahl]?.id;
    if (id === "fenn") await gasseFenn(rt, held);
    else if (id === "vahl") await gasseVahl(rt, held);
    else if (id === "gasse") await gasseOrt(rt, held);
    else if (id === "grete") await gasseGrete(rt, held);
    else if (id === "gewoelbe") await gasseGewoelbe(rt, held);
    else if (id === "konflikt") await gasseKonflikt(rt, held);
    else return;
  }
}

function hubZeilen(held: Held): string[] {
  const zeilen = [
    "Hinter der Gerberei liegt die Gasse, die niemand mehr betritt. Dabei wäre sie der kürzeste Weg zum Fluss.",
  ];
  if (held.gasseOrtGesehen) {
    zeilen.push(
      "Zwei frische Bretter lehnen an der Gerberei, noch ohne Nägel. Die Woche, die Fenn genannt hat, ist kürzer geworden.",
    );
  } else {
    zeilen.push("Unkraut reicht einem Kind bis zur Brust. An einer Hauswand laufen Striche in Reihen, zu gleichmäßig für Zufall.");
  }
  if (held.ilsesAufzeichnungenGefunden) {
    zeilen.push("Ilse Brandtners Liste liegt unter deinem Hemd. Das Wachs riecht, sobald du dich bückst. Heute Abend liegt Wachs auch auf Vahls Tisch.");
  } else if (held.gasseGeschichteGehoert) {
    zeilen.push("Fenn hat gefragt, warum dort niemand mehr geht. Die Hand in seiner Tasche hält still, solange du noch da bist.");
  } else {
    zeilen.push("Fenn wartet an der Kirchmauer. Im Rathaus redet Vahl von einem Lagerhaus.");
  }
  return zeilen;
}
