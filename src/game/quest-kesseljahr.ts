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

async function gasseNachspiel(rt: Runtime, held: Held) {
  if (held.loesungswegGasse === "vernichtet") {
    await rt.present({
      title: "Gerbereigasse",
      art: "village",
      portrait: null,
      held,
      lines: [
        "Neue Bretter liegen harzig im Gras. Der erste Pfosten steht dort, wo der Ziehbrunnen zugewachsen war.",
        "Ein Kind fragt, wohin der Weg früher geführt hat. Die Mutter zieht es weiter, ohne zu antworten.",
      ],
    });
    await rt.present({
      art: "chapel",
      held,
      lines: [
        "Fenn sitzt an der Kirchmauer. Die Hand um das Zaunbrett ist still. Er sieht nicht zur Gasse.",
        "Die Gasse hat wieder einen Zweck. Den alten Namen wird bald niemand mehr kennen.",
      ],
    });
    return;
  }
  if (held.loesungswegGasse === "veroeffentlicht") {
    await rt.present({
      title: "Gerbereigasse",
      art: "village",
      portrait: null,
      held,
      lines: [
        "Die Gasse bleibt leer. Niemand bringt Bretter. An Vahls Fenster hängt ein Tuch.",
        held.greteBedraengt
          ? "Gretes Kate bleibt zu. Das Dorf kennt die Geschichte. Ihren Mund bekommt es nicht."
          : "Die Kratzspuren an der Hauswand sind noch da. Niemand macht sie weg.",
      ],
    });
    await rt.present({
      art: "chapel",
      held,
      lines: [
        "Die Leute grüßen Fenn, bevor sie vorbeigehen, nicht erst danach.",
        "Er hebt das Zaunbrett nicht mehr aus der Tasche. Eine Hand reicht, wenn man gesehen wird.",
      ],
    });
    return;
  }
  if (held.loesungswegGasse === "erpresst") {
    await rt.present({
      title: "Gerbereigasse",
      art: "village",
      portrait: null,
      held,
      lines: [
        "Die Gasse bleibt leer. Offiziell aus Gründen, die niemand vorliest.",
        "Zwei Männer stehen einen Morgen lang mit Brettern am Eingang und gehen wieder, ohne sie abzuladen.",
      ],
    });
    await rt.present({
      art: "townhall",
      held,
      lines: [
        "Vahl grüßt dich vom Rathausfenster, zu höflich für ein Amt. Der Siegelring bleibt diesmal still.",
        "Das Unkraut hat Zeit. Niemand nimmt sie ihm. Die Rechnung liegt zwischen euch, nicht im Gemeindebuch.",
      ],
    });
    return;
  }
  await rt.present({
    title: "Gerbereigasse",
    art: "village",
    portrait: null,
    held,
    lines: [
      "Die Gasse bleibt leer. Holm hat den Bauplatz ruhen lassen, ohne einen Namen zu nennen.",
      "Vahl weiß nicht genau, wer ihn stoppte, und fragt nicht. Die frische Tinte an der Karte ist matt geworden.",
    ],
  });
  await rt.present({
    art: "townhall",
    portrait: "holm",
    held,
    lines: [
      "Im Rathaus liegt unter der leeren Kasse etwas, das nicht in die Abgaben gehört.",
      "Holm sieht dich an und sieht sofort wieder auf das Siegel. Die Gasse bleibt eine leere Stelle auf der Karte.",
    ],
  });
}

async function gasseFenn(rt: Runtime, held: Held) {
  if (held.gasseGeschichteGehoert) {
    await rt.present({
      title: "Fenn",
      art: "chapel",
      portrait: null,
      held,
      lines: [
        "Fenn betastet das Zaunbrett in der Tasche, ohne es herauszuziehen. Die Kante hat sich seiner Hand angepasst.",
        held.fennGedraengt
          ? "„Du hast zuerst gedrängt. Ich habe trotzdem geredet. Mehr kann ich nicht tragen.“"
          : "„Du hast gehört. Mehr kann ich nicht tragen. Die Gasse trägt den Rest.“",
      ],
    });
    await rt.present({
      held,
      lines: [
        held.ilsesAufzeichnungenGefunden
          ? "Er sieht auf deine Brust, wo das Wachs durchschlägt. „Ilse hat geschrieben. Ich habe nur gewartet.“"
          : held.greteBedraengt
            ? "„Du hast Grete gedrängt. Sie redet nicht zweimal. Die Gasse trägt trotzdem den Rest.“"
            : "Er stellt keine zweite Frage. Eine hat gereicht.",
      ],
    });
    return;
  }

  const lines = [
    "Fenn sitzt so, dass die Kirchentür ihn nicht trifft, wenn sie aufgeht. Das hat Übung.",
    "Der Stein unter ihm ist abgewetzt. Wer hier sitzt, sitzt nicht zum ersten Winter.",
    "„Weißt du, warum dort niemand mehr geht?“ Er stellt die Frage, ohne eine Antwort zu erwarten.",
  ];
  if (held.fennGedraengt) {
    lines.push(
      "Beim letzten Mal hast du ihn unterbrochen. Die Hand um das Holz ist enger. Er gibt dir trotzdem eine zweite Chance.",
    );
  }

  const wahl = await rt.present({
    title: "Fenn an der Kirchmauer",
    art: "chapel",
    portrait: null,
    held,
    lines,
    choices: ["Warten und zuhören", "Ihn drängen", "Gehen"],
  });
  if (wahl === 2 || wahl == null) return;

  if (wahl === 1) {
    held.fennGedraengt = true;
    await rt.present({
      held,
      lines: [
        "Fenn schüttelt den Kopf, bevor der Satz zu Ende ist. In der Tasche knackt das Holz einmal.",
        "„Schlechte Ernte. Dann die Gasse zu. Mehr steht nicht im Mund eines Mannes, den niemand fragt.“",
      ],
    });
    await rt.present({
      held,
      lines: [
        "Er sieht zur Gerberei, nicht zu dir. „Wer drängt, bekommt das Jahr ohne Namen.“",
        "Die Hand bleibt im Taschenfutter. Das Wort Kesseljahr gibt er heute nicht her.",
      ],
    });
    return;
  }

  await rt.present({
    held,
    lines: [
      "Du bleibst. Der Schatten wandert über den Stein, bis er Fenns Knie erreicht.",
      "Das Betasten wird langsamer. Einmal bleibt die Hand ganz still.",
      "Von der Gasse her kommt kein Geräusch. Das ist das Lauteste an diesem Ort.",
    ],
  });

  held.gasseGeschichteGehoert = true;
  await rt.present({
    held,
    lines: [
      "„Kesseljahr“, sagt Fenn endlich. Das Wort fällt wie ein Stein in einen Brunnen.",
      "„Missernte. Dann schwarzer Pilz im Korn. Die Gasse wurde zugenagelt. Bretter vor jede Tür. Wache davor. Drei Männer aus dem Rat hielten den Schlüssel.“",
    ],
  });
  await rt.present({
    held,
    lines: [
      "„Das Korn kam nicht. Das Fieber kam. Als sie die Bretter wieder abrissen, war niemand mehr übrig, der sein Haus noch beanspruchte. Das Land wurde aufgeteilt, noch bevor die Toten kalt waren. Vahls Großvater hat zuerst gezeichnet.“",
      "Er sieht nicht dich an, sondern die Gasse. „Grete lebt noch. Am Rand. Sie sieht fast nichts. Aber sie hört, ob du mit Zeit kommst — oder nur mit einer Frage, die du schon beantwortet haben willst.“",
    ],
  });
}
