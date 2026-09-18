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
        held.loesungswegMuehle === "verraten"
          ? "„Die Wache holt Leute, wenn jemand redet. Trotzdem muss einer zuhören, bevor sie Bretter über die Gasse legen.“"
          : "„In einer Woche kommt die Baumannschaft. Vahl hat im Rat verkündet, hinter der Gerberei stehe ein Lagerhaus. Als wäre da nie etwas gewesen.“",
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
      lines: [
        "Hinter der Gerberei liegt die Gasse, die niemand mehr betritt. Dabei wäre sie der kürzeste Weg zum Fluss.",
        "Unkraut reicht einem Kind bis zur Brust. An einer Hauswand laufen Striche in Reihen, zu gleichmäßig für Zufall.",
        held.gasseGeschichteGehoert
          ? "Fenn hat gefragt, warum dort niemand mehr geht. Die Hand in seiner Tasche hält still, solange du noch da bist."
          : "Fenn wartet an der Kirchmauer. Im Rathaus redet Vahl von einem Lagerhaus.",
        held.ilsesAufzeichnungenGefunden
          ? "Ilse Brandtners Liste liegt unter deinem Hemd. Das Wachs riecht noch, sobald du dich bückst."
          : "In einer Woche rücken die Leute an, die Bretter bringen, nicht Fragen.",
      ],
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

async function gasseNachspiel(rt: Runtime, held: Held) {
  if (held.loesungswegGasse === "vernichtet") {
    await rt.present({
      title: "Gerbereigasse",
      art: "village",
      portrait: null,
      held,
      lines: [
        "Neue Bretter liegen harzig im Gras. Der erste Pfosten steht dort, wo der Ziehbrunnen zugewachsen war.",
        "Fenn sitzt an der Kirchmauer. Die Hand um das Zaunbrett ist still. Er sieht nicht zur Gasse.",
        "Ein Kind fragt, wohin der Weg früher geführt hat. Die Mutter zieht es weiter, ohne zu antworten.",
        "Die Gasse hat wieder einen Zweck. Den alten Namen wird bald niemand mehr kennen.",
      ],
    });
    return;
  }
  if (held.loesungswegGasse === "veroeffentlicht") {
    await rt.present({
      title: "Gerbereigasse",
      art: "chapel",
      portrait: null,
      held,
      lines: [
        "Die Gasse bleibt leer. Niemand bringt Bretter. An Vahls Fenster hängt ein Tuch.",
        "Die Leute grüßen Fenn, bevor sie vorbeigehen, nicht erst danach.",
        held.greteBedraengt
          ? "Gretes Kate bleibt zu. Das Dorf kennt die Geschichte. Ihren Mund bekommt es nicht."
          : "Die Kratzspuren an der Hauswand sind noch da. Niemand macht sie weg.",
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
      "Die Gasse bleibt leer. Offiziell aus Gründen, die niemand vorliest.",
      held.loesungswegGasse === "erpresst"
        ? "Vahl grüßt dich vom Rathausfenster, zu höflich für ein Amt. Der Siegelring bleibt diesmal still."
        : "Holm hat den Bauplatz ruhen lassen. Vahl weiß nicht genau, wer ihn stoppte, und fragt nicht.",
      "Das Unkraut hat Zeit. Niemand nimmt sie ihm.",
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
      "„Das Korn kam nicht. Das Fieber kam. Als sie die Bretter wieder abrissen, war niemand mehr übrig, der sein Haus noch beanspruchte. Das Land wurde aufgeteilt, noch bevor die Toten kalt waren. Vahls Großvater hat zuerst gezeichnet.“",
      "Er sieht nicht dich an, sondern die Gasse. „Grete lebt noch. Am Rand. Sie sieht fast nichts. Aber sie hört, ob du mit Zeit kommst — oder nur mit einer Frage, die du schon beantwortet haben willst.“",
    ],
  });
}

async function gasseVahl(rt: Runtime, held: Held) {
  if (held.vahlKonfrontiert) {
    await rt.present({
      title: "Vahls Stube",
      art: "townhall",
      portrait: null,
      held,
      lines: [
        "Vahl dreht den Siegelring, ohne ihn abzustreifen. Das Wappen darin ist älter als er.",
        "Die Baufreigabe liegt nicht mehr auf dem Tisch. Nur der Ring und ein Klecks Wachs, der nicht mehr weich ist.",
        "Er nickt dir zu und sagt nichts.",
      ],
    });
    return;
  }

  const lines = [
    "Ratsherr Vahl hat eine Stube hinter Holms Kammer. Der Tisch ist zu leer für ein Amt, das so viel Land kennt.",
    "An der Wand hängt eine Karte des Dorfs. Die Gerbereigasse ist mit frischer Tinte als Baugrund umrandet. Der Rest der Karte ist es nicht.",
    "Er dreht den Siegelring am Finger, bevor du sprichst. Das Wappen gehört einem Mann, der nicht mehr da ist.",
    "„Zehn Jahre brach. Das Dorf braucht ein Lagerhaus. Ordnung ist kein Verbrechen.“",
  ];
  if (held.gasseGeschichteGehoert) {
    lines.push("Du hast Fenns Jahr. Vahl sieht auf den Ring, nicht auf dich.");
  }

  const items: { id: string; label: string }[] = [
    { id: "baugrund", label: "Nach dem geplanten Lagerhaus fragen" },
  ];
  if (held.gasseGeschichteGehoert && !held.vahlGrossvater) {
    items.push({ id: "quarant", label: "Nach der geschlossenen Gasse fragen (Charisma, mittel)" });
  } else if (held.vahlGrossvater) {
    items.push({ id: "grossvater", label: "Noch einmal nach dem Großvater fragen" });
  }
  items.push({ id: "gehen", label: "Die Stube verlassen" });

  const wahl = await rt.present({
    title: "Ratsherr Vahl",
    art: "townhall",
    portrait: null,
    held,
    lines,
    choices: items.map((item) => item.label),
  });
  const id = items[wahl]?.id;
  if (id === "gehen" || id == null) return;

  if (id === "baugrund") {
    await rt.present({
      held,
      lines: [
        "Vahl schiebt die Karte näher, als gehörte die Gasse schon dem Amt.",
        "„Ungenutztes Land. Ein zugewachsener Brunnen, den niemand braucht. Die Gerberei ist tot. Ein Weg zum Fluss nützt niemandem, wenn ihn keiner geht.“",
        "„Das Lagerhaus steht in einer Woche. Wer dann noch fragt, warum die Gasse leer war, fragt zu spät.“",
        "Der Siegelring dreht sich weiter. Die Sätze hat er geübt.",
      ],
    });
    return;
  }

  if (id === "grossvater") {
    await rt.present({
      held,
      lines: [
        "„Mein Großvater hat Verantwortung getragen. Das Amt auch. Mehr steht nicht in diesem Zimmer.“",
        "Er legt die Hand flach auf die Umrandung. Die Tinte klebt nicht. Die Hand bleibt trotzdem liegen.",
        "Der Ring bleibt in Bewegung.",
      ],
    });
    return;
  }

  const ergebnis = probe(held, "Charisma", held.charisma, MITTEL, "Vahl nach der geschlossenen Gasse fragen");
  if (ergebnis.erfolg) {
    held.vahlGrossvater = true;
    await rt.present({
      held,
      probe: ergebnis,
      lines: [
        "Vahl wird kurz starr. Der Ring bleibt einmal liegen.",
        "„Mein Großvater hat damals Verantwortung getragen. Die Gasse war krank. Man hat sie geschlossen, damit das Fieber nicht den Platz holt.“",
        "„Das Land danach…“ Er bricht ab. Die Karte unter seiner Hand knittert leise.",
        "Mehr gibt er nicht. Den Satz über das Land hat er zu weit angefangen.",
      ],
    });
    return;
  }
  await rt.present({
    held,
    probe: ergebnis,
    lines: [
      "Vahl lächelt routiniert. Der Ring dreht sich ohne Pause.",
      "„Falls es dort noch alte Bücher gibt, liegt das bei der Kirche. Nicht bei mir. Ich verwalte Baugrund, keine Toten.“",
      "Er hält das für eine Abwehr. Es klingt nach einer Tür, die er selbst nicht bewachen will.",
    ],
  });
}

async function gasseOrt(rt: Runtime, held: Held) {
  held.gasseBesucht = true;
  held.gasseOrtGesehen = true;
  await rt.present({
    title: "Gerbereigasse",
    art: "village",
    portrait: null,
    held,
    lines: [
      "Die Gasse beginnt hinter der Gerberei. In den Balken hängt noch der Geruch alter Lohe, obwohl hier seit Jahren nichts mehr gegerbt wird.",
      "Verwitterte Bretter lehnen an den Türstöcken. In der Mitte steht ein zugewachsener Ziehbrunnen, der Kranz voller Disteln.",
      "An einer Hauswand laufen Kratzspuren in Reihen. Keine Krallen. Jemand hat gezählt.",
      held.gasseSpielzeugGefunden
        ? "Unter dem losen Stein an der Gerberei liegt das Holzspielzeug noch. Ein Pferd ohne Beine. Mehr gibt die Gasse nicht her."
        : "Am Rand steht eine Kate, deren Klinke blanker ist als der Rest. Dort wohnt jemand, der die Gasse nicht als Weg benutzt.",
    ],
  });

  if (held.gasseSpielzeugGefunden) return;

  const suche = await rt.present({
    held,
    lines: ["Ein Stein an der Gerberei sitzt lockerer als die anderen."],
    choices: ["Den losen Stein prüfen (Geschick, leicht)", "Die Gasse lassen"],
  });
  if (suche !== 0) return;

  const ergebnis = probe(held, "Geschicklichkeit", held.geschick, LEICHT, "unter dem Stein suchen");
  if (ergebnis.erfolg) {
    held.gasseSpielzeugGefunden = true;
    await rt.present({
      title: "Unter dem Stein",
      art: "ditch",
      portrait: null,
      held,
      probe: ergebnis,
      lines: [
        "Unter dem Stein liegt ein verwittertes Holzspielzeug. Ein Pferd ohne Beine, die Mähne nur noch Kerben.",
        "Die Kratzspuren an der Wand sind Striche in Fünfergruppen. Die letzte Reihe bricht ab, mitten im fünften Strich.",
        "Du legst das Pferd zurück. Es gehört hierher, auch wenn hier niemand mehr spielt.",
        "An der Kate glänzt die Klinke. Sie hat mehr Gebrauch als jede andere Tür in dieser Gasse.",
      ],
    });
    return;
  }
  await rt.present({
    held,
    probe: ergebnis,
    lines: [
      "Der Stein bleibt. Unter den Fingernägeln bleibt Erde, sonst nichts.",
      "Vahl nennt das ungenutztes Land. Das Unkraut steht in der Höhe eines Kindes.",
      "Die Striche an der Wand bleiben.",
    ],
  });
}

async function gasseGrete(rt: Runtime, held: Held) {
  if (held.greteBedraengt && held.greteGespraech) {
    await rt.present({
      title: "Gretes Kate",
      art: "village",
      portrait: null,
      held,
      lines: [
        "Grete hält das Medaillon fest, ohne es zu öffnen. Die Kette hat sich in die Haut gelegt.",
        "„Ich habe geredet. Mehr ist nicht in diesem Haus.“ Die Tür bleibt einen Spalt, nicht mehr.",
        "Sie findet deine Schritte, bevor du sie findest, und macht den Spalt kleiner.",
      ],
    });
    return;
  }

  if (held.greteGespraech) {
    await rt.present({
      title: "Gretes Kate",
      art: "village",
      portrait: null,
      held,
      lines: [
        "Grete sitzt am Herd, der nicht brennt. Die Asche ist alt genug, dass sie nicht mehr staubt.",
        "„Ilse hat die Liste dorthin gebracht, wo man niemanden begräbt, den man vergessen will. Unter der Kirche. Das Gewölbe, hinter den Steinen ohne Namen.“",
        "Sie dreht das Medaillon. Innen schlägt etwas Weiches gegen das Metall, zu klein für eine Münze.",
        "„Geh. Oder bleib still. Beides ist besser als drängen. Drängen habe ich schon gehabt, und danach war die Gasse leer.“",
      ],
    });
    return;
  }

  const lines = [
    "Die Kate ist niedriger als die Gerberei. Grete ist fast blind. Die Finger finden das Medaillon, bevor sie deine Schritte findet.",
    "Es riecht nach kaltem Rauch und altem Leder. An der Wand hängt ein Riemen, der zu einer Gerberei gehört hat.",
    "Auf dem Tisch liegt ein Teller mit nichts darauf. Der Rand ist abgewetzt, wo eine Hand jahrelang denselben Platz gesucht hat.",
  ];
  if (held.gasseSpielzeugGefunden) {
    lines.push("Du hast das Holzspielzeug gesehen. Gretes Mund wird enger.");
  }
  if (held.gasseGeschichteGehoert) {
    lines.push("Fenn hat ihren Namen genannt. Sie wartet, ob du Zeit mitbringst oder nur eine Frage.");
  } else if (held.gasseOrtGesehen) {
    lines.push("Du kommst von der Gasse. Sie hat deine Schritte gehört, bevor du geklopft hast.");
  }

  const items: { id: string; label: string }[] = [
    { id: "warten", label: "Warten und zuhören" },
    { id: "druck", label: "Sie zum Reden drängen" },
    { id: "gehen", label: "Die Kate verlassen" },
  ];

  const wahl = await rt.present({
    title: "Grete",
    art: "village",
    portrait: null,
    held,
    lines,
    choices: items.map((item) => item.label),
  });
  const id = items[wahl]?.id;
  if (id === "gehen" || id == null) return;

  if (id === "druck") {
    held.greteBedraengt = true;
    held.greteGespraech = true;
    await rt.present({
      held,
      lines: [
        "Grete weicht bis an die Herdwand zurück. Das Medaillon schlägt einmal gegen den Tisch.",
        "„Ilse Brandtner war die Hebamme. Sie hat geschrieben, wen man nicht begraben hat. Die Liste liegt unter der Kirche, wo die Steine keine Namen tragen.“",
        "Die Sätze kommen zu schnell, als müsste sie sie loswerden, bevor du noch eine stellst.",
        "Danach schließt sich die Hand um das Medaillon. Mehr gibt dieses Haus nicht, auch wenn du bleibst.",
      ],
    });
    return;
  }

  if (!held.gasseGeschichteGehoert && !held.gasseSpielzeugGefunden) {
    await rt.present({
      held,
      lines: [
        "Grete hört dich atmen. Sie redet nicht. Die Finger bleiben am Medaillon.",
        "„Wer die Gasse nicht kennt, soll sie nicht aus meinem Mund lernen. Fenn sitzt an der Kirche. Frag ihn, oder geh.“",
      ],
    });
    return;
  }

  await rt.present({
    held,
    lines: [
      "Du bleibst. Der Teller auf dem Tisch rührt sich nicht.",
      "Irgendwann wird das Medaillon ruhiger. Grete atmet, als zähle sie die Atemzüge, die du ihr lässt.",
    ],
  });

  held.greteGespraech = true;
  await rt.present({
    held,
    lines: [
      "„Ilse Brandtner war Hebamme. Sie hat die Toten aufgeschrieben, bevor man sie im Mühlbach fand. An einem trockenen Abend. Das Wasser stand niedrig. Ilse stand trotzdem darin.“",
      "„Die Liste hat sie dorthin gebracht, wo man niemanden begräbt, den man vergessen will. Das Gewölbe unter der Kirche, hinter einem Stein, der lockerer sitzt als die anderen.“",
      "Grete öffnet das Medaillon nicht. Innen liegt, so viel merkst du am Klang, ein Haar.",
      "„Drei Namen vom Rat. Und wie das Land danach aufgeteilt wurde. Ilse wollte, dass es bleibt, auch wenn wir nicht bleiben. Geh, solange du noch jemand bist, der geht und nicht nur fragt.“",
    ],
  });
}

async function gasseGewoelbe(rt: Runtime, held: Held) {
  if (held.ilsesAufzeichnungenGefunden) {
    await rt.present({
      title: "Kirchengewölbe",
      art: "chapel",
      portrait: null,
      held,
      lines: [
        "Die Treppe ist dir bekannt. Unten bleibt die Kälte liegen.",
        "Die Nische ist leer. Ilse Brandtners Wachstuch liegt unter deinem Hemd.",
        "Die Steine ohne Namen sagen nichts.",
      ],
    });
    return;
  }

  const sneakSchwer = held.kuesterGewarnt ? SCHWER : MITTEL;
  const priesterLeicht = held.artefaktErhalten;
  const items: { id: string; label: string }[] = [
    {
      id: "pfarrer",
      label: priesterLeicht
        ? "Den Pfarrer um Zutritt bitten (Charisma, leicht)"
        : "Den Pfarrer um Zutritt bitten (Charisma, mittel)",
    },
    {
      id: "schleich",
      label: held.kuesterGewarnt
        ? "Nachts hineinschleichen (Geschick, schwer — der Küster achtet)"
        : "Nachts hineinschleichen (Geschick, mittel)",
    },
    { id: "gehen", label: "Die Kirche lassen" },
  ];

  const wahl = await rt.present({
    title: "Unter der Kirche",
    art: "chapel",
    portrait: null,
    held,
    lines: [
      "Die Kirche steht kälter als der Platz. Kerzenwachs ist an den Bänken heruntergelaufen und wieder hart geworden.",
      "Die Treppe zum Gewölbe liegt hinter einem Vorhang, den niemand zur Seite schiebt. Der Stoff ist dunkel genug, dass man ihn für eine Wand halten kann.",
      held.kuesterGewarnt
        ? "Der Küster hat dich einmal gesehen. Die Tür quietscht, und der Riegel sitzt einen Fingerbreit fester."
        : "Unten liegen die, die man ohne Namen begräbt. Oben redet niemand davon.",
      held.artefaktErhalten
        ? "Der Pfarrer hat das Silber gesehen, das du trägst. Er sieht dich anders an als die, die nur fragen."
        : "Der Pfarrer steht am Altar und tut, als gehörte die Treppe nicht zu seiner Kirche.",
    ],
    choices: items.map((item) => item.label),
  });
  const id = items[wahl]?.id;
  if (id === "gehen" || id == null) return;

  let drin = false;
  if (id === "pfarrer") {
    const ergebnis = probe(
      held,
      "Charisma",
      held.charisma,
      priesterLeicht ? LEICHT : MITTEL,
      "den Pfarrer um das Gewölbe bitten",
    );
    if (ergebnis.erfolg) {
      drin = true;
      await rt.present({
        held,
        probe: ergebnis,
        lines: [
          "Der Pfarrer sieht an dir vorbei, zur Stelle an der Wand, wo eine Glocke hängen könnte und nicht hängt.",
          "„Geh allein hinunter. Frag mich hinterher nichts, das ich selbst nicht beantworten will.“",
          "Er schiebt den Vorhang nicht zur Seite. Er dreht sich nur so, dass er nicht sehen muss, wie du es tust.",
        ],
      });
    } else {
      await rt.present({
        held,
        probe: ergebnis,
        lines: [
          "Der Pfarrer schüttelt den Kopf. Die Hand am Vorhang bleibt liegen.",
          "„Das Gewölbe ist für die Toten. Nicht für Fragen, die oben bleiben sollen.“",
          "Die Tür bleibt zu. Nachts ist sie nur ein Riegel.",
        ],
      });
    }
  } else {
    const ergebnis = probe(held, "Geschicklichkeit", held.geschick, sneakSchwer, "ins Gewölbe schleichen");
    if (ergebnis.erfolg) {
      drin = true;
      await rt.present({
        art: "sneak",
        held,
        probe: ergebnis,
        lines: [
          "Der Vorhang gibt nach, wo das Holz nicht knarrt. Du gehst seitlich, nicht geradeaus.",
          "Unten riecht es nach Kalk und nassem Tuch. Niemand folgt.",
        ],
      });
    } else {
      held.kuesterGewarnt = true;
      await rt.present({
        held,
        probe: ergebnis,
        lines: [
          "Der Küster erwischt dich an der obersten Stufe. Die Laterne trifft dein Gesicht, nicht den Vorhang.",
          "„Manche Türen soll man besser nicht bewachen“, sagt er und sieht weg. Er meldet es nicht. Er merkt es sich.",
          "Beim nächsten Mal wird der Riegel enger sitzen.",
        ],
      });
    }
  }

  if (!drin) return;

  await rt.present({
    title: "Im Gewölbe",
    art: "chapel",
    portrait: null,
    held,
    lines: [
      "Die Nischen tragen keine Namen. Ein Stein sitzt lockerer, als das Gewicht es erklärt.",
      "Wasser steht in einer Rinne entlang der Wand. Wenn der Wind falsch steht, schmeckt es ein wenig nach dem Brunnen oben.",
      "Ilse hat geschrieben, man begrabe hier niemanden, den man vergessen will. Die Steine widersprechen ihr nicht.",
    ],
  });

  const suche = probe(held, "Geschicklichkeit", held.geschick, SCHWER, "Ilse Brandtners Liste finden");
  if (suche.erfolg) {
    held.ilsesAufzeichnungenGefunden = true;
    await rt.present({
      title: "Hinter dem Stein",
      art: "evidence",
      portrait: null,
      held,
      probe: suche,
      lines: [
        "Der lockere Stein gibt nach. Dahinter liegt Wachstuch, trocken gegen die Feuchte, festgewickelt.",
        "Ilse Brandtners Hand: Namen, Daten, drei Ratsherren, die Aufteilung des Landes. Die Schrift ist klein und gleichmäßig, als hätte das Papier nicht reichen sollen.",
        "Vahls Großvater steht zuerst. Daneben Stücke, die heute zur Mühle, zum Rathausplatz und zur Gerberei gehören. Die Häuser der Gasse stehen nur noch als Fläche da.",
        "Die letzte Zeile ist kurz: „Wer das liest, soll nicht so tun, als wäre niemand gezählt worden.“",
      ],
    });
    return;
  }
  await rt.present({
    held,
    probe: suche,
    lines: [
      "Die Steine sind alle gleich tot. Deine Finger finden Fugen, keinen Hohlraum. Der Kalk bröckelt.",
      "Ilse hat besser versteckt, als ein erster Gang verdient. Du kannst wiederkommen.",
    ],
  });
}

async function gasseKonflikt(rt: Runtime, held: Held) {
  await rt.present({
    title: "Vahls Stube, Abend",
    art: "townhall",
    portrait: null,
    held,
    lines: [
      "Vahl sitzt allein. Die Karte an der Wand wirft einen schmalen Schatten über die Umrandung der Gasse.",
      "Der Siegelring dreht sich, bevor du sprichst. Auf dem Tisch die Baufreigabe. Wachs, noch weich. Die Feder daneben unbenutzt.",
      "Draußen im Flur geht eine Magd vorbei und bleibt nicht stehen.",
      held.vahlGrossvater
        ? "Er hat den Großvater schon einmal genannt. Heute liegt Papier auf dem Tisch, das mehr wiegt als der Ring."
        : "Er sieht dich an wie eine Lieferung, die zu spät kommt.",
    ],
  });

  const items: { id: string; label: string }[] = [
    { id: "rat", label: "Die Liste vor dem Rat lesen (Charisma, schwer)" },
    { id: "holm", label: "Die Liste Holm zustecken (Geschick, mittel)" },
    { id: "zwang", label: "Vahl unter vier Augen zwingen (Stärke, mittel)" },
    { id: "brand", label: "Die Liste für Fenn verbrennen" },
    { id: "gehen", label: "Mit der Liste gehen" },
  ];

  const wahl = await rt.present({
    title: "Was die Liste wiegt",
    art: "evidence",
    portrait: null,
    held,
    lines: [
      "Ilse Brandtners Wachstuch liegt zwischen euch, auch wenn es noch unter dem Hemd ist. Das Wachs hat deine Haut angenommen.",
      "Vahl wartet. Der Ring auch.",
    ],
    choices: items.map((item) => item.label),
  });
  const id = items[wahl]?.id;
  if (id === "gehen" || id == null) return;

  if (id === "brand") {
    held.loesungswegGasse = "vernichtet";
    await rt.present({
      title: "Ein zweites Schweigen",
      art: "chapel",
      portrait: null,
      held,
      lines: [
        "Du gehst mit der Liste zur Kirchmauer. Fenn sieht das Wachstuch und wendet den Blick nicht ab.",
        "Das Papier brennt schneller, als du erwartet hast. Die Namen werden zuerst schwarz, dann Asche. Der Rauch bleibt in der Rinne, wo Fenns nackte Füße stehen.",
        "Fenn sagt nichts. Die Hand um das Zaunbrett wird einen Moment lang ruhig.",
        "Die Gasse wird bebaut. In zehn Jahren wird niemand mehr wissen, wonach sie benannt war. Du weißt es. Fenn auch.",
      ],
    });
    return;
  }

  if (id === "holm") {
    const ergebnis = probe(held, "Geschicklichkeit", held.geschick, MITTEL, "die Liste Holm zustecken");
    if (ergebnis.erfolg) {
      held.loesungswegGasse = "weitergegeben";
      await rt.present({
        art: "sneak",
        portrait: "holm",
        held,
        probe: ergebnis,
        lines: [
          "Holms Tür steht einen Spalt. Die Magd im Flur sieht das Wachstuch und sieht sofort wieder weg.",
          "Holm nimmt das Tuch, ohne den Namen auf dem Siegelring zu lesen. Die Hand ist trocken. Die Kasse darunter auch.",
          "„Ich handle. Du warst nicht hier.“ Er schiebt es unter die leere Kasse.",
        ],
      });
      await gasseEnde(rt, held);
      return;
    }
    await rt.present({
      held,
      probe: ergebnis,
      lines: [
        "Holms Tür ist bewacht. Die Magd hebt den Blick rechtzeitig, um das Wachstuch zu sehen, und senkt ihn nicht schnell genug.",
        "Zustecken ist vorbei für heute. Die Liste bleibt bei dir. Vahl im Nebenzimmer hat nichts gehört. Noch nicht.",
      ],
    });
    return;
  }

  if (id === "zwang") {
    const ergebnis = probe(held, "Stärke", held.staerke, MITTEL, "Vahl unter vier Augen festlegen");
    if (ergebnis.erfolg) {
      held.loesungswegGasse = "erpresst";
      held.vahlKonfrontiert = true;
      await rt.present({
        held,
        probe: ergebnis,
        lines: [
          "Du legst die Liste auf die Baufreigabe. Das weiche Wachs nimmt die Kante des Wachstuchs an.",
          "Vahl hört auf, den Ring zu drehen. Die Hand bleibt in der Luft, ohne Arbeit.",
          "„Die Baumannschaft wird abbestellt. Offiziell: neue Bedenken.“ Er sagt es leise genug, dass der Flur es nicht verdient.",
          "Er sieht dich an, als hättest du etwas unterschrieben, das nicht auf Papier steht. Die Wahrheit bleibt vergraben. Jetzt weißt du, wo.",
        ],
      });
      await gasseEnde(rt, held);
      return;
    }
    await rt.present({
      held,
      probe: ergebnis,
      lines: [
        "Vahl steht auf. Der Stuhl schabt über Stein. Im Flur bleibt eine Magd stehen und sieht sofort wieder weg.",
        "„Du kommst in meine Stube und zählst meine Toten?“ Der Ring dreht sich wieder, schneller als zuvor.",
        "Heute nicht. Die Liste bleibt bei dir. Die Baufreigabe bei ihm.",
      ],
    });
    return;
  }

  const ergebnis = probe(held, "Charisma", held.charisma, SCHWER, "Vahl vor dem Rat stellen");
  if (ergebnis.erfolg) {
    held.loesungswegGasse = "veroeffentlicht";
    held.vahlKonfrontiert = true;
    await rt.present({
      held,
      probe: ergebnis,
      lines: [
        "Du liest hier, laut genug, dass der Flur und die Kammer daneben mithören müssen.",
        "Die Namen kommen, wie Ilse sie geschrieben hat. Der Rat hört sie, weil niemand rechtzeitig die Tür schließt.",
        "Vahl verliert die Farbe unter dem Siegelring. Die Baufreigabe bleibt liegen.",
        "Draußen bleibt Fenn sitzen. Er hat die Stimmen gehört. Mehr braucht er nicht.",
      ],
    });
    await gasseEnde(rt, held);
    return;
  }
  await rt.present({
    held,
    probe: ergebnis,
    lines: [
      "Vahl lacht einmal, kurz und trocken.",
      "„Eine Hebamme. Ein Wachstuch. Der Rat hat wichtigere Listen, und ich habe ein Lagerhaus, das in einer Woche steht.“",
      "Die Magd im Flur hat trotzdem den ersten Namen gehört. Reden allein reicht heute nicht. Die Liste bleibt bei dir.",
    ],
  });
}

async function gasseEnde(rt: Runtime, held: Held) {
  if (held.loesungswegGasse === "veroeffentlicht") {
    await rt.present({
      title: "Was ausgegraben bleibt",
      art: "townhall",
      portrait: "holm",
      held,
      lines: [
        "Der Rat tagt drei Nächte hintereinander. Man hört die Stimmen bis auf den Platz, auch wenn niemand die Fenster öffnet.",
        "Vahl verliert seinen Sitz, nicht sein Land — das gehört inzwischen niemandem mehr, den man noch belangen könnte. Der Siegelring bleibt an seinem Finger. Das Amt nicht.",
        "Fenn sitzt weiter vor der Kirche, aber die Leute grüßen ihn jetzt, bevor sie vorbeigehen.",
        "Holm schreibt etwas in das Gemeindebuch, auf eine Seite, die man sonst für Abgaben behält. Er liest es dir nicht vor.",
      ],
    });
    return;
  }
  if (held.loesungswegGasse === "weitergegeben") {
    await rt.present({
      title: "Ein Name unter vielen",
      art: "townhall",
      portrait: "holm",
      held,
      lines: [
        "Holm lässt den Bauplatz ruhen, ohne einen Namen zu nennen. Im Rat klingt das nach Ordnung. In der Gasse klingt es nach nichts.",
        "Die Gasse bleibt leer, aber niemand fragt mehr, warum.",
        "Ilse Brandtners Liste liegt in einer Schublade, die niemand außer Holm und dir kennt. Das Wachs daran wird hart und bleibt hart.",
      ],
    });
    return;
  }
  await rt.present({
    title: "Stille Rechnung",
    art: "townhall",
    portrait: null,
    held,
    lines: [
      "Die Baumannschaft wird abbestellt, offiziell wegen neuer Bedenken. Zwei Männer stehen einen Morgen lang mit Brettern am Eingang und gehen wieder, ohne sie abzuladen.",
      "Vahl grüßt dich seither mit einer Höflichkeit, die mehr Angst als Respekt ist. Der Ring dreht sich nur, wenn du nicht hinsiehst.",
      "Die Wahrheit bleibt vergraben. Mindestens einer weiß, wo. Das reicht, damit die Gasse leer bleibt.",
    ],
  });
}
