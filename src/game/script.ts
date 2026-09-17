import {
  canOfferHeal,
  chance,
  goldPlus,
  hat,
  heilen,
  nimm,
  pick,
  probe,
  schaden,
} from "./engine";
import type { Runtime } from "./runtime";
import { INTRO_ARTIFACT_CONTENT } from "./content";
import {
  HEILTRANK,
  LEICHT,
  MAX_LP,
  MITTEL,
  SCHLUESSEL,
  SCHWER,
  tot,
  type Held,
} from "./types";

const GOLD = "Gold";

async function vielleichtHeiltrank(rt: Runtime, held: Held) {
  if (!canOfferHeal(held)) return;
  const wahl = await rt.present({
    held,
    lines: [`Du hast einen ${HEILTRANK} und ${held.lp}/${MAX_LP} LP.`],
    choices: [`${HEILTRANK} trinken`, "Aufheben für später"],
  });
  if (wahl === 0) {
    held.inventar = held.inventar.filter((item) => item !== HEILTRANK);
    const text = heilen(held, 6);
    await rt.present({
      held,
      lines: [text, "Die bittere Flüssigkeit wärmt dich von innen."],
    });
  }
}

export async function spielen(rt: Runtime, held: Held, resume = false) {
  if (!resume) await szeneIntro(rt, held);
  await szeneDorf(rt, held);
  if (!tot(held)) await szeneWald(rt, held);
  if (!tot(held)) await szeneLager(rt, held);
  await szeneEnde(rt, held);
}

async function szeneIntro(rt: Runtime, held: Held) {
  await rt.present({
    title: "Der Weg nach Lindendorf",
    art: "road",
    portrait: null,
    held,
    lines: [
      "Der Weg ins Tal ist schmal genug, dass zwei Wagen sich nicht ausweichen können.",
      "Du gehst allein. Deine Stiefel sind nass vom letzten Regen, und der Regen hat nicht vor, damit aufzuhören.",
      "Hinter dir liegt kein Auftrag. Vor dir liegt ein Dorf, das auf der Karte kleiner aussieht als in der Dämmerung.",
    ],
  });

  await introArtefakt(rt, held);

  await rt.present({
    title: "Das Tal",
    art: "forest",
    portrait: null,
    held,
    lines: [
      "Der Wald steht dicht an den Hängen. Zwischen den Stämmen hängen Fetzen von Nebel.",
      "Weiter unten siehst du Rauch, der senkrecht steigt. Kein Wind. Kein gutes Zeichen, wenn Rauch so gerade steht.",
      "Jemand hat die Felder abgeerntet. Jemand anderes hat vergessen, die Zäune zu reparieren.",
    ],
  });

  await rt.present({
    title: "Am Hang",
    art: "ditch",
    portrait: null,
    held,
    lines: [
      "Oberhalb des Dorfes schneidet ein alter Weg den Hang. Dort steht eine Kapelle, deren Dach dunkler ist als der Himmel.",
      "Eine kleine Glocke bewegt sich einmal über dem Geröll.",
      "Du kennst den Weg noch nicht. Du merkst dir nur den Ton.",
    ],
  });

  await rt.present({
    title: "Lindendorf",
    art: "village",
    portrait: null,
    held,
    lines: [
      "Häuser drücken sich aneinander, als könnten sie so wärmer bleiben.",
      "Am Brunnen stehen Frauen mit verschränkten Armen. In der Taverne löscht jemand eine Lampe, obwohl es noch nicht ganz dunkel ist.",
      "Das Rathaus hat eine Tür, die zu oft geflickt wurde. Über dem Türsturz klebt altes rotes Wachs.",
    ],
  });

  await rt.present({
    title: "Ankunft",
    art: "village",
    portrait: null,
    held,
    lines: [
      "Du bleibst am Rand des Platzes stehen. Niemand fragt, wer du bist.",
      "Das ist zunächst höflich. Dann merkst du, dass es Vorsicht ist.",
      "Du könntest weitergehen. Aber der Weg nach Osten führt am Steinbruch vorbei, und aus dem Steinbruch steigt Rauch.",
      "In Lindendorf wartet niemand auf einen Helden. Trotzdem beginnt hier dein Weg.",
    ],
  });
}

async function introArtefakt(rt: Runtime, held: Held) {
  const wahl = await rt.present({
    title: INTRO_ARTIFACT_CONTENT.title,
    art: INTRO_ARTIFACT_CONTENT.art,
    portrait: null,
    held,
    lines: INTRO_ARTIFACT_CONTENT.lines,
    choices: INTRO_ARTIFACT_CONTENT.choices.map((choice) => choice.label),
  });

  if (wahl === 3) {
    held.artefaktVerloren = true;
    await rt.present({
      held,
      lines: INTRO_ARTIFACT_CONTENT.passLines,
    });
    return;
  }

  const contentChoice = INTRO_ARTIFACT_CONTENT.choices[wahl];
  const wege: Array<"kampf" | "schleich" | "ueberreden"> = ["kampf", "schleich", "ueberreden"];
  const attribut = contentChoice.attribute ?? "Stärke";
  const wert = [held.staerke, held.geschick, held.charisma][wahl] ?? held.staerke;
  const schwierigkeit = contentChoice.difficulty ?? MITTEL;
  const ergebnis = probe(held, attribut, wert, schwierigkeit, "das silberne Artefakt");
  held.artefaktWeg = wege[wahl] ?? "kampf";

  if (ergebnis.erfolg) {
    held.artefaktErhalten = true;
    await rt.present({
      held,
      probe: ergebnis,
      lines: [
        INTRO_ARTIFACT_CONTENT.successLines[wahl],
        "Das Silber ist kalt. In Lindendorf wird jemand wissen, woher es stammt.",
      ],
    });
  } else {
    held.artefaktVerloren = true;
    await rt.present({
      held,
      probe: ergebnis,
        lines: INTRO_ARTIFACT_CONTENT.failureLines,
    });
  }
}

async function szeneDorf(rt: Runtime, held: Held) {
  await rt.present({
    title: "Dorfplatz",
    art: "village",
    portrait: null,
    held,
    lines: [
      "Du stehst jetzt mitten in Lindendorf. Der Platz ist klein genug, dass jedes Gespräch einen Zeugen findet.",
      "Vor dir liegen Rathaus, Taverne, Brunnen und der Weg zum Hang.",
      "Aus dem Osten steigt Rauch. Dort liegt der alte Steinbruch.",
      "Noch weißt du nicht, wem du glauben kannst. Du weißt nur, wo du anfangen kannst.",
    ],
  });

  let rumorenGehoert = false;
  let lautAngekundigt = false;
  let bettlerRueckkehrGesehen = false;

  while (!tot(held)) {
    const glockenwegLabel = held.sannaGeholfen || held.holmSiegelGefunden || held.mehlsackGefunden || held.artefaktErhalten
      ? "Zum alten Glockenweg aufsteigen"
      : "Den Weg zum Hang erkunden";
    const dorfChoices = [
      "Mit dem Bürgermeister sprechen",
      "Die Taverne besuchen",
      "Brunnen und Dorfplatz",
      "Schmiede und Apotheke",
      ...(held.holmBesucht ? ["Nach dem roten Wachs fragen"] : []),
      glockenwegLabel,
      "Richtung Wald aufbrechen",
    ];
    const glockenwegIndex = dorfChoices.indexOf(glockenwegLabel);
    const wahl = await rt.present({
      title: "Lindendorf",
      art: "village",
      portrait: null,
      held,
      lines: ["Was tust du?"],
      choices: dorfChoices,
    });

    if (wahl === 0) {
      await dorfBuergermeister(rt, held);
    } else if (wahl === 1) {
      lautAngekundigt =
        (await dorfTaverne(rt, held, rumorenGehoert, lautAngekundigt)) || lautAngekundigt;
    } else if (wahl === 2) {
      rumorenGehoert = (await dorfPlatz(rt, held, rumorenGehoert)) || rumorenGehoert;
    } else if (wahl === 3) {
      await dorfSchmiedeApotheke(rt, held);
    } else if (held.holmBesucht && wahl === 4) {
      await dorfHolmSiegel(rt, held);
    } else if (wahl === glockenwegIndex) {
      await szeneGlockenweg(rt, held);
    } else {
      if (!held.holmBesucht) {
        const go = await rt.present({
          art: "village",
          held,
          lines: [
            "Du hast noch mit niemandem im Rathaus gesprochen.",
            "In den Wald zu gehen ist möglich. Du kennst dann aber weder den Auftrag noch die Gründe der Banditen.",
          ],
          choices: ["Trotzdem in den Wald gehen", "Noch im Dorf bleiben"],
        });
        if (go === 1) continue;
      }
      if (!bettlerRueckkehrGesehen && (held.bettlerGeholfen || held.bettlerAbgewiesen)) {
        await dorfBettlerRueckkehr(rt, held);
        bettlerRueckkehrGesehen = true;
      }
      if (held.holmBesucht) {
        const wissen = [
          held.auftragErhalten
            ? "Du weißt jetzt: Die Banditen sitzen im alten Steinbruch und haben Kirchensilber genommen."
            : "Du weißt jetzt: Banditen sitzen im alten Steinbruch und haben das Dorf bestohlen. Du hast Holms Auftrag nicht angenommen.",
          "Der Wald führt dorthin. Der Hauptweg ist nicht der einzige Weg.",
          ...(held.artefaktErhalten ? ["Das silberne Artefakt gehört zur Kirche. Holm wird wissen, warum es im Tal unterwegs war."] : []),
          ...(held.glockeGestoppt ? ["Die Glocke am Hang bleibt still."] : []),
          ...(held.banditenGewarnt ? ["Die Banditen wissen bereits, dass jemand kommt."] : []),
        ];
        const aufbruch = await rt.present({
          title: "Was du weißt",
          art: "road",
          portrait: null,
          held,
          lines: wissen,
          choices: ["In den Wald gehen", "Noch im Dorf bleiben"],
        });
        if (aufbruch === 1) continue;
      }
      await rt.present({
        art: "road",
        held,
        lines: [
          "Du lässt Lindendorf hinter dir.",
          "Der Weg wird zum Pfad, der Pfad zur Spur zwischen Farnen.",
        ],
      });
      return;
    }
  }
}

async function dorfBuergermeister(rt: Runtime, held: Held) {
  held.holmBesucht = true;
  await rt.present({
    title: "Rathaus",
    art: "townhall",
    portrait: "holm",
    held,
    lines: [
      "Bürgermeister Holm hat Augen wie nasse Kiesel.",
      "Auf dem Tisch: eine leere Kasse, ein Siegel, ein Brief mit gebrochenem Wachs.",
      "„Banditen kommen nachts. Drei Mal schon. Getreide, zwei Ziegen, das Silbergerät der Kirche.“",
      "„Ich brauche jemanden, der zum alten Steinbruch geht. Dort lagern sie.“",
      ...(held.artefaktErhalten
        ? ["Als Holm das silberne Artefakt sieht, verliert sein Gesicht für einen Moment jede Farbe. Es gehört zur Kirche."]
        : []),
    ],
  });

  if (held.auftragErhalten && held.buergermeisterVertraut) {
    await rt.present({
      held,
      lines: [
        "„Du hast mein Wort und meinen Vorschuss. Geh, bevor sie merken,",
        "dass Lindendorf diesmal nicht nur jammert.“",
      ],
    });
    return;
  }

  if (held.auftragErhalten) {
    await rt.present({
      held,
      lines: [
        "Holm sieht zuerst auf das Siegel, dann auf dich.",
        "„Der Auftrag steht. Die Kasse ist trotzdem leer.“",
        "Er sagt nicht, dass er dir vertraut. Dafür hat er beim ersten Mal schon zu viel gesagt.",
      ],
    });
  }

  const wahl = await rt.present({
    held,
    lines: [
      held.auftragErhalten
        ? "Der Auftrag steht. Du kannst jetzt noch entscheiden, wie du ihn trägst."
        : "Du kannst den Auftrag einfach annehmen — oder ihn dir verdienen.",
    ],
    choices: [
      held.auftragErhalten ? "Beim Auftrag bleiben" : "Auftrag nüchtern annehmen",
      "Vertrauen gewinnen (Charisma, mittel)",
      "Druck machen und Gold fordern (Charisma, schwer)",
      "Wieder gehen",
    ],
  });

  if (wahl === 0) {
    held.auftragErhalten = true;
    await rt.present({
      held,
      lines: [
        "„Gut. Bring zurück, was sie genommen haben. Oder sorge, dass sie nicht wiederkommen.“",
        "Holm nickt knapp. Mehr Wärme hat dieses Amt nicht übrig.",
      ],
    });
  } else if (wahl === 1) {
    const ergebnis = probe(held, "Charisma", held.charisma, MITTEL, "Vertrauen des Bürgermeisters");
    if (ergebnis.erfolg) {
      held.auftragErhalten = true;
      held.buergermeisterVertraut = true;
      const gold = goldPlus(held, 5, "Vorschuss");
      const item = nimm(held, HEILTRANK);
      await rt.present({
        held,
        probe: ergebnis,
        log: [gold, item],
        lines: [
          "„Nimm das. Aus der Apotheke der Witwe Kern. Und fünf Taler, mehr ist nicht da.“",
          "Holm sieht dich an, als hättest du etwas unterschrieben, das nicht auf Papier steht.",
        ],
      });
    } else {
      held.auftragErhalten = true;
      await rt.present({
        held,
        probe: ergebnis,
        lines: [
          "Holm bleibt kühl.",
          "„Worte habe ich genug gehört. Tu die Arbeit. Belohnung nach Ergebnis.“",
        ],
      });
    }
  } else if (wahl === 2) {
    const ergebnis = probe(held, "Charisma", held.charisma, SCHWER, "Gold erpressen");
    if (ergebnis.erfolg) {
      held.auftragErhalten = true;
      const gold = goldPlus(held, 8, "erpresster Vorschuss");
      await rt.present({
        held,
        probe: ergebnis,
        log: [gold],
        lines: [
          "Holm zahlt, aber sein Blick sagt: Das vergisst ein Dorf nicht so schnell.",
          "Vertrauen ist das nicht. Nur Notwendigkeit.",
        ],
      });
    } else {
      held.auftragErhalten = true;
      await rt.present({
        held,
        probe: ergebnis,
        lines: [
          "„Du kommst in mein Haus und zählst meine Münzen?“",
          "Holm steht auf. Der Auftrag steht. Freundschaft nicht.",
        ],
      });
    }
  } else {
    await rt.present({
      held,
      lines: ["Du lässt Holm mit seiner leeren Kasse."],
    });
  }
}

async function dorfTaverne(
  rt: Runtime,
  held: Held,
  rumorenGehoert: boolean,
  lautAngekundigt: boolean,
): Promise<boolean> {
  await rt.present({
    title: "Zum letzten Fass",
    art: "tavern",
    portrait: "mara",
    held,
    lines: [
      "In der Taverne riecht es nach Gerste, nassem Tuch und Angst, die man wegzutrinken versucht.",
      "Wirtin Mara wischt dieselbe Stelle auf der Theke zum dritten Mal.",
      ...(lautAngekundigt
        ? ["Als du eintrittst, wird an einem Tisch ein Satz nicht zu Ende gesprochen."]
        : []),
    ],
  });

  const wahl = await rt.present({
    held,
    lines: ["Was tust du?"],
    choices: [
      "Gerüchte hören",
      "Laut ankündigen, dass du die Banditen jagst",
      held.gold >= 5 ? "Heiltrank kaufen (5 Gold)" : "Heiltrank kaufen — zu wenig Gold",
      "Mara nach der Hintertür fragen",
      "Nach Maras letztem Gast fragen",
      "Wieder hinaus",
    ],
  });

  if (wahl === 0) {
    const lines = [
      "Ein Holzfäller murmelt:",
      "„Die nehmen nicht den Hauptweg. Östlicher Wildpfad, wo die alte Eiche vom Blitz gespalten ist.“",
      "Mara ergänzt leise: „Einer von ihnen trinkt hier manchmal. Nennt sich Kess. Hört gerne zu.“",
    ];
    if (rumorenGehoert) {
      lines.push(
        "Mara nickt zum Brunnen hinüber. „Die Müllerin hat mehr gesehen, als sie sagen will.“",
        "Seit drei Nächten schläft dort keiner durch. Nicht wegen der Trommeln.",
      );
    }
    if (lautAngekundigt) {
      lines.push(
        "Mara hört bis zum Ende zu. Dann stellt sie das Tuch beiseite.",
        "„Kess hört gerne zu. Heute vielleicht genauer als sonst.“",
      );
    }
    await rt.present({ held, lines });
  } else if (wahl === 1) {
    const ergebnis = probe(held, "Charisma", held.charisma, MITTEL, "den Raum für dich gewinnen");
    if (ergebnis.erfolg) {
      const gold = goldPlus(held, 1, "Biergeld eines Betrunkenen, der an dich glaubt");
      await rt.present({
        held,
        probe: ergebnis,
        log: [gold],
        lines: [
          "Du stellst dich hin und sagst den Raum, was du vorhast.",
          "Zwei Gäste klatschen unsicher. Ein Dritter steht auf und geht, ohne zu zahlen.",
          "Mara stellt dir ein Bier hin, das niemand bestellt hat.",
          "„Pass auf Kess auf. Und auf den Graben vor dem Lager. Den haben sie neu gezogen.“",
        ],
      });
    } else {
      held.banditenGewarnt = true;
      await rt.present({
        held,
        probe: ergebnis,
        lines: [
          "Du stellst dich hin und sagst den Raum, was du vorhast.",
          "Zu viele Ohren. Zu viele offene Münder.",
          "Mara hört auf zu wischen. Irgendwo zwischen Theke und Tür ist dein Plan schon weitergereist.",
          "Die Banditen werden wissen, dass jemand kommt.",
        ],
      });
    }
  } else if (wahl === 2) {
    if (held.gold >= 5) {
      if (hat(held, HEILTRANK)) {
        await rt.present({
          held,
          lines: ["Mara zuckt mit den Schultern. „Einen zweiten habe ich nicht.“"],
        });
      } else {
        held.gold -= 5;
        const item = nimm(held, HEILTRANK);
        await rt.present({
          held,
          log: [item],
          lines: ["Mara schiebt dir ein kleines Fläschchen zu. „Witwe Kerns Restbestand.“"],
        });
      }
    } else {
      await rt.present({
        held,
        lines: ["Fünf Gold. Du hast weniger. Mara hebt nicht einmal den Deckel."],
      });
    }
  } else if (wahl === 3) {
    await dorfMaraHintertuer(rt, held);
  } else if (wahl === 4) {
    await dorfMarasLetzterGast(rt, held);
  } else {
    await rt.present({
      held,
      lines: ["Die Tür fällt ins Schloss. Draußen ist die Luft ehrlicher."],
    });
  }

  return wahl === 1;
}

async function dorfMarasLetzterGast(rt: Runtime, held: Held) {
  if (held.letzterGastGefunden || held.letzterGastAbgewiesen) {
    await rt.present({
      held,
      lines: ["Mara schiebt das leere Glas beiseite. „Über den letzten Gast ist alles gesagt.“"],
    });
    return;
  }

  const wahl = await rt.present({
    title: "Zum letzten Fass",
    art: "tavern",
    portrait: "mara",
    held,
    lines: [
      "Mara stellt ein leeres Glas unter die Theke.",
      "„Der Mann, der gestern hier saß, hat nicht bezahlt. Er hat nur einen Satz dagelassen.“",
      "Sie sagt den Satz nicht sofort. Das ist der Preis fürs Fragen.",
    ],
    choices: [
      "Mara zum Reden bringen (Charisma, mittel)",
      "Das Glas und den Tisch untersuchen (Geschick, leicht)",
      "Die Schuld nicht zu deiner machen",
    ],
  });

  if (wahl === 0) {
    const ergebnis = probe(held, "Charisma", held.charisma, MITTEL, "Maras letzten Gast verstehen");
    if (ergebnis.erfolg) {
      held.letzterGastGefunden = true;
      await rt.present({
        title: "Zum letzten Fass",
        art: "tavern",
        portrait: "mara",
        held,
        probe: ergebnis,
        lines: [
          "Mara sagt den Satz leise: „Kess würfelt nur, wenn er glaubt, Zeit zu haben.“",
          "Der letzte Gast hat ihn in der Tür gehört. Danach ging er nach Osten.",
          "Mara wischt den Rand des Glases. „Sag nicht, dass du das von mir hast.“",
        ],
      });
    } else {
      held.letzterGastAbgewiesen = true;
      await rt.present({
        title: "Zum letzten Fass",
        art: "tavern",
        portrait: "mara",
        held,
        probe: ergebnis,
        lines: [
          "Mara hält deinen Blick aus. Dann nimmt sie das Glas wieder an sich.",
          "„Nicht jeder, der schweigt, hat etwas zu verkaufen.“",
        ],
      });
    }
  } else if (wahl === 1) {
    const ergebnis = probe(held, "Geschicklichkeit", held.geschick, LEICHT, "den letzten Gast zurückverfolgen");
    if (ergebnis.erfolg) {
      held.letzterGastGefunden = true;
      await rt.present({
        title: "Zum letzten Fass",
        art: "tavern",
        portrait: null,
        held,
        probe: ergebnis,
        lines: [
          "Unter dem Glas klebt ein Streifen Papier. Darauf steht nur: Osten. Keine Unterschrift.",
          "Mara sieht das Papier an. „Dann ist er nicht zum Hauptweg gegangen.“",
          "Mehr gibt es nicht. Aber weniger ist es auch nicht.",
        ],
      });
    } else {
      held.letzterGastAbgewiesen = true;
      await rt.present({
        title: "Zum letzten Fass",
        art: "tavern",
        portrait: null,
        held,
        probe: ergebnis,
        lines: ["Das Glas kippt. Das Papier darunter ist nur altes Fettpapier.", "Mara nimmt es wortlos weg."],
      });
    }
  } else {
    held.letzterGastAbgewiesen = true;
    await rt.present({ held, lines: ["Du lässt das leere Glas stehen. Mara dankt dir nicht. Sie muss es auch nicht."] });
  }
}

async function dorfMaraHintertuer(rt: Runtime, held: Held) {
  if (held.maraGeholfen || held.maraAbgewiesen) {
    await rt.present({
      held,
      lines: ["Mara sieht zur Hintertür. „Das ist erledigt. Mehrmals muss man dieselbe Tür nicht retten.“"],
    });
    return;
  }

  const wahl = await rt.present({
    title: "Zum letzten Fass",
    art: "tavern",
    portrait: "mara",
    held,
    lines: [
      "Mara wartet, bis der Holzfäller wieder auf sein Bier schaut.",
      "„Hinter der Küche ist eine Tür, die nicht mehr richtig schließt. Jemand hat sie von außen markiert.“",
      "Sie legt den Lappen beiseite. Das tut sie selten.",
    ],
    choices: [
      "Die Hintertür prüfen (Geschick, leicht)",
      "Mara nicht weiter fragen",
    ],
  });

  if (wahl === 0) {
    const ergebnis = probe(held, "Geschicklichkeit", held.geschick, LEICHT, "die markierte Hintertür prüfen");
    if (ergebnis.erfolg) {
      held.maraGeholfen = true;
      await rt.present({
        title: "Hinter der Taverne",
        art: "tavern",
        portrait: null,
        held,
        probe: ergebnis,
        lines: [
          "Die Markierung ist kein Zeichen. Sie ist eine Kerbe im Holz, frisch und tief genug für einen Daumennagel.",
          "Unter dem losen Türstein findest du eine zusammengerollte Schnur und den Abdruck eines Stiefels.",
          "Mara nimmt beides an sich. „Dann wissen sie wenigstens, dass ich hinschaue.“",
          "Sie zeigt dir den schmalen Pfad hinter dem Haus. Er führt später näher an den Steinbruch, als dir lieb ist.",
        ],
      });
    } else {
      held.maraAbgewiesen = true;
      await rt.present({
        title: "Hinter der Taverne",
        art: "tavern",
        portrait: null,
        held,
        probe: ergebnis,
        lines: [
          "Du findest die Kerbe. Mehr nicht. Der lose Stein rutscht dir aus der Hand und schlägt gegen die Tür.",
          "Auf der anderen Seite wird es still.",
          "Mara schließt die Tür selbst. „Heute nicht mehr“, sagt sie.",
        ],
      });
    }
  } else {
    held.maraAbgewiesen = true;
    await rt.present({
      held,
      lines: [
        "Du hast bereits genug Türen geöffnet, die dir nicht gehören.",
        "Mara nimmt den Lappen wieder auf. Die Stelle auf der Theke ist noch immer sauber.",
      ],
    });
  }
}

async function dorfPlatz(rt: Runtime, held: Held, rumorenGehoert: boolean): Promise<boolean> {
  const wahl = await rt.present({
    title: "Brunnen und Dorfplatz",
    art: "village",
    portrait: null,
    held,
    lines: [
      "Der Dorfplatz ist klein genug, dass jedes Gespräch einen Zeugen findet.",
      "Am Brunnen tropft Wasser auf den Stein. Hinter dem Trog wartet ein Junge mit einer roten Schnur.",
    ],
    choices: ["Am Brunnen lauschen", "Dem Jungen mit der roten Schnur folgen", "Zurück zum Dorf"],
  });
  if (wahl === 0) await dorfBrunnen(rt, held);
  else if (wahl === 1) await dorfRoteSchnur(rt, held);
  else if (rumorenGehoert) await rt.present({ held, lines: ["Du bleibst auf dem Platz. Die Stimmen kommen und gehen."] });
  return wahl === 0;
}

async function dorfSchmiedeApotheke(rt: Runtime, held: Held) {
  const wahl = await rt.present({
    title: "Schmiede und Apotheke",
    art: "village",
    portrait: null,
    held,
    lines: [
      "Zwei Türen nebeneinander. Hinter der einen riecht es nach Eisen, hinter der anderen nach Alkohol und getrockneten Blättern.",
    ],
    choices: ["Zum Schmied", "Zu Witwe Kern", "Zurück zum Dorf"],
  });
  if (wahl === 0) await dorfSchmied(rt, held);
  else if (wahl === 1) await dorfWitweKern(rt, held);
}

async function dorfWitweKern(rt: Runtime, held: Held) {
  if (held.kernGeholfen || held.kernAbgewiesen) {
    await rt.present({
      title: "Bei Witwe Kern",
      art: "village",
      portrait: null,
      held,
      lines: ["Witwe Kern hält die Schublade geschlossen. „Was leer ist, bleibt wenigstens ordentlich.“"],
    });
    return;
  }

  const wahl = await rt.present({
    title: "Bei Witwe Kern",
    art: "village",
    portrait: null,
    held,
    lines: [
      "Witwe Kern hat ihre Apotheke geöffnet, obwohl niemand hereinkommt.",
      "Eine Schublade klemmt. Darauf liegt ein sauber gefaltetes Tuch.",
      "„Der Restbestand ist kleiner geworden“, sagt sie. „Nicht durch Verkauf.“",
    ],
    choices: [
      "Die Schublade lösen (Stärke, leicht)",
      "Das Schloss untersuchen (Geschick, mittel)",
      "Kern nach dem fehlenden Bestand fragen (Charisma, mittel)",
      "Nicht weiter fragen",
    ],
  });

  if (wahl === 3) {
    held.kernAbgewiesen = true;
    await rt.present({ held, lines: ["Witwe Kern nickt. „Dann bleibt es eben meine leere Schublade.“"] });
    return;
  }
  const attribut = wahl === 0 ? "Stärke" : wahl === 1 ? "Geschicklichkeit" : "Charisma";
  const wert = wahl === 0 ? held.staerke : wahl === 1 ? held.geschick : held.charisma;
  const schwierigkeit = wahl === 0 ? LEICHT : MITTEL;
  const ergebnis = probe(held, attribut, wert, schwierigkeit, "Kerns leere Schublade prüfen");
  if (ergebnis.erfolg) {
    held.kernGeholfen = true;
    await rt.present({
      title: "Bei Witwe Kern",
      art: "village",
      portrait: null,
      held,
      probe: ergebnis,
      lines: [
        "Hinter der Schublade klebt ein Streifen Verbandstoff. Frisch abgerissen.",
        "Kern nimmt ihn an sich. „Jemand hat sich bedient, ohne krank zu sein.“",
        "Sie legt dir einen sauberen Verband hin. „Für den Fall, dass du doch noch krank wirst.“",
      ],
    });
  } else {
    held.kernAbgewiesen = true;
    await rt.present({
      title: "Bei Witwe Kern",
      art: "village",
      portrait: null,
      held,
      probe: ergebnis,
      lines: ["Das Holz gibt nicht nach. Kern schiebt deine Hand weg.", "„Nicht alles muss mit Gewalt aufgehen.“"],
    });
  }
}

async function dorfHolmSiegel(rt: Runtime, held: Held) {
  if (held.holmSiegelGefunden || held.holmSiegelVerschwiegen) {
    await rt.present({
      title: "Rathaus",
      art: "townhall",
      portrait: "holm",
      held,
      lines: ["Das gebrochene Wachs liegt noch auf Holms Tisch. Keiner spricht darüber."],
    });
    return;
  }

  const wahl = await rt.present({
    title: "Rathaus",
    art: "townhall",
    portrait: "holm",
    held,
    lines: [
      "Neben Holms Brief liegt ein Stück rotes Wachs.",
      "Das Siegel trägt den Abdruck der Gemeinde — aber jemand hat es gebrochen, bevor der Brief ankam.",
      "Holm hält die Hand darüber. Zu spät.",
    ],
    choices: [
      "Den Abdruck vergleichen (Geschick, mittel)",
      "Holm offen darauf ansprechen (Charisma, leicht)",
      "So tun, als hättest du nichts gesehen",
    ],
  });

  if (wahl === 0 || wahl === 1) {
    const attribut = wahl === 0 ? "Geschicklichkeit" : "Charisma";
    const wert = wahl === 0 ? held.geschick : held.charisma;
    const schwierigkeit = wahl === 0 ? MITTEL : LEICHT;
    const ergebnis = probe(held, attribut, wert, schwierigkeit, "das gebrochene Siegel verstehen");
    if (ergebnis.erfolg) {
      held.holmSiegelGefunden = true;
      await rt.present({
        title: "Rathaus",
        art: "townhall",
        portrait: "holm",
        held,
        probe: ergebnis,
        lines: [
          "Das Wachs ist älter als der Brief. Jemand hat Holms Siegel benutzt, um sich Zeit zu kaufen.",
          "Holm nimmt den Brief zurück. „Jetzt weißt du, warum ich niemandem gern Papier gebe.“",
        ],
      });
    } else {
      held.holmSiegelVerschwiegen = true;
      await rt.present({ held, probe: ergebnis, lines: ["Holm faltet den Brief. Die Sache bleibt zwischen Tür und Tisch."] });
    }
  } else {
    held.holmSiegelVerschwiegen = true;
    await rt.present({ held, lines: ["Du siehst auf das Wachs und dann auf Holm. Er dankt dir nicht. Das ist Antwort genug."] });
  }
}

async function dorfRoteSchnur(rt: Runtime, held: Held) {
  if (held.schnurGeholfen || held.schnurAbgewiesen) {
    await rt.present({ held, lines: ["Der Junge mit der roten Schnur ist nicht mehr am Brunnen."] });
    return;
  }

  const wahl = await rt.present({
    title: "Hinter dem Brunnen",
    art: "well",
    portrait: null,
    held,
    lines: [
      "Ein Junge wartet hinter dem Brunnen. Um sein Handgelenk liegt eine rote Schnur.",
      "„Ich weiß, wo sie nachts langgehen“, sagt er. „Aber ich zeige es nur jemandem, der nicht laut ist.“",
    ],
    choices: [
      "Ihm zuhören und ihm folgen (Geschick, leicht)",
      "Ihn nach Hause schicken",
    ],
  });

  if (wahl === 0) {
    const ergebnis = probe(held, "Geschicklichkeit", held.geschick, LEICHT, "dem roten Faden folgen");
    if (ergebnis.erfolg) {
      held.schnurGeholfen = true;
      await rt.present({
        title: "Hinter dem Brunnen",
        art: "well",
        portrait: null,
        held,
        probe: ergebnis,
        lines: ["Die rote Schnur führt nur bis zu einem Zaunpfahl.", "Dort beginnt ein schmaler Weg nach Osten. Der Junge hatte recht.", "Er nimmt die Schnur ab. „Jetzt findest du ihn auch ohne mich.“"],
      });
    } else {
      held.schnurAbgewiesen = true;
      await rt.present({ held, probe: ergebnis, lines: ["Du verlierst die Schnur im Farn. Der Junge zieht sie zurück.", "„Dann nicht“, sagt er und läuft heim."] });
    }
  } else {
    held.schnurAbgewiesen = true;
    await rt.present({ held, lines: ["Du schickst ihn nach Hause. Er gehorcht erst, als du dich umdrehst."] });
  }
}

async function dorfSchmied(rt: Runtime, held: Held) {
  if (held.schmiedGeholfen || held.schmiedAbgewiesen) {
    await rt.present({
      title: "Beim Schmied",
      art: "village",
      portrait: null,
      held,
      lines: ["Der Schmied hebt das stumpfe Eisen hoch. „Das Werkzeug tut wieder, was es soll.“"],
    });
    return;
  }

  const wahl = await rt.present({
    title: "Beim Schmied",
    art: "village",
    portrait: null,
    held,
    lines: [
      "Hinter dem Haus schlägt jemand auf Eisen, das den Schlag nicht mehr verdient.",
      "Der Schmied hält eine stumpfe Hacke gegen das Licht.",
      "„Damit gräbt man keinen Steinbruch frei. Damit macht man nur Lärm.“",
    ],
    choices: [
      "Beim Schleifen helfen (Stärke, mittel)",
      "Die Schneide sauber ausrichten (Geschick, leicht)",
      "Nach dem Preis fragen (Charisma, mittel)",
      "Weitergehen",
    ],
  });

  if (wahl === 3) {
    held.schmiedAbgewiesen = true;
    await rt.present({ held, lines: ["Der Schmied nickt einmal. Das Eisen bleibt stumpf. Du gehst weiter."] });
    return;
  }

  const attribut = wahl === 0 ? "Stärke" : wahl === 1 ? "Geschicklichkeit" : "Charisma";
  const wert = wahl === 0 ? held.staerke : wahl === 1 ? held.geschick : held.charisma;
  const schwierigkeit = wahl === 1 ? LEICHT : MITTEL;
  const ergebnis = probe(held, attribut, wert, schwierigkeit, "das stumpfe Eisen richten");
  if (ergebnis.erfolg) {
    held.schmiedGeholfen = true;
    await rt.present({
      title: "Beim Schmied",
      art: "village",
      portrait: null,
      held,
      probe: ergebnis,
      lines: [
        "Der Funke springt nur einmal. Das reicht.",
        "Die Schneide wird nicht neu. Aber sie wird wieder brauchbar.",
        "„Im Steinbruch ist Werkzeug wichtiger als Mut“, sagt der Schmied. „Merk dir das.“",
      ],
    });
  } else {
    held.schmiedAbgewiesen = true;
    await rt.present({
      title: "Beim Schmied",
      art: "village",
      portrait: null,
      held,
      probe: ergebnis,
      lines: [
        "Der Stein rutscht. Die Schneide bleibt, wie sie war.",
        "„Kein Schaden“, sagt der Schmied. Er meint die Hacke.",
      ],
    });
  }
}

async function dorfBrunnen(rt: Runtime, held: Held) {
  const ergebnis = probe(held, "Charisma", held.charisma, LEICHT, "die Leute zum Reden bringen");
  if (ergebnis.erfolg) {
    const gold = goldPlus(held, 2, "Almosen der Müllerin");
    await rt.present({
      title: "Am Brunnen",
      art: "well",
      portrait: "miller",
      held,
      probe: ergebnis,
      log: [gold],
      lines: [
        "Am Brunnen redet man, als wäre Flüstern eine Form von Gebet.",
        "Die Müllerin sagt, die Banditen hätten einen Schlüssel zum alten Steinbruchtor.",
        "Ein Junge schwört, nachts Trommeln gehört zu haben — oder nur den Wind.",
        "Die Müllerin zieht dich beiseite.",
        "„Wenn du gehst, geh nicht stolz. Die haben Posten auf dem Felsen.“",
        "Ihre Hand bleibt noch einen Moment an deinem Ärmel. Dann tut sie, als wäre es wegen des Mehls.",
        "Sie drückt dir zwei abgewetzte Münzen in die Hand.",
      ],
    });
  } else {
    await rt.present({
      title: "Am Brunnen",
      art: "well",
      portrait: "miller",
      held,
      probe: ergebnis,
      lines: [
        "Am Brunnen redet man, als wäre Flüstern eine Form von Gebet.",
        "Die Müllerin sagt, die Banditen hätten einen Schlüssel zum alten Steinbruchtor.",
        "Ein Junge schwört, nachts Trommeln gehört zu haben — oder nur den Wind.",
        "Man sieht dich an und verstummt.",
        "Die Müllerin schiebt den Eimer zwischen dich und die anderen.",
        "Fremde mit Fragen sind in Lindendorf eine eigene Wetterlage.",
      ],
    });
  }

  if (!held.mehlsackGefunden && !held.mehlsackGemeldet) {
    await dorfFalscherMehlsack(rt, held);
  }
  if (!held.bettlerGeholfen && !held.bettlerAbgewiesen) {
    await dorfBettler(rt, held);
  }
}

async function dorfFalscherMehlsack(rt: Runtime, held: Held) {
  const wahl = await rt.present({
    title: "Am Brunnen",
    art: "well",
    portrait: "miller",
    held,
    lines: [
      "Hinter dem Mühlstein steht ein Mehlsack, der nicht nach Mehl riecht.",
      "Das Tuch ist grob. Die Naht wurde mit schwarzem Garn geschlossen.",
      "Die Müllerin sieht dich an. „Der war gestern noch nicht da.“",
    ],
    choices: [
      "Die Naht untersuchen (Geschick, mittel)",
      "Den Sack zum Bürgermeister bringen (Charisma, leicht)",
      "Die Müllerin nicht hineinziehen",
    ],
  });

  if (wahl === 0) {
    const ergebnis = probe(held, "Geschicklichkeit", held.geschick, MITTEL, "die fremde Mehlsacknaht prüfen");
    if (ergebnis.erfolg) {
      held.mehlsackGefunden = true;
      await rt.present({
        title: "Am Brunnen",
        art: "well",
        portrait: "miller",
        held,
        probe: ergebnis,
        lines: [
          "Im Saum steckt feiner grauer Staub. Steinmehl.",
          "Die Müllerin kennt den Geruch. „Aus dem alten Bruch.“",
          "Du weißt jetzt, dass die Banditen ihren Weg nicht nur durch den Wald nehmen.",
        ],
      });
    } else {
      held.mehlsackGemeldet = true;
      await rt.present({
        title: "Am Brunnen",
        art: "well",
        portrait: "miller",
        held,
        probe: ergebnis,
        lines: [
          "Die Naht gibt nicht nach. Der Sack fällt um.",
          "Die Müllerin schickt einen Jungen zum Rathaus. Mehr Hände will sie hier nicht sehen.",
        ],
      });
    }
  } else if (wahl === 1) {
    const ergebnis = probe(held, "Charisma", held.charisma, LEICHT, "die Müllerin zum Melden bewegen");
    held.mehlsackGemeldet = true;
    await rt.present({
      title: "Am Brunnen",
      art: "well",
      portrait: "miller",
      held,
      probe: ergebnis,
      lines: ergebnis.erfolg
        ? [
            "Die Müllerin nickt. „Holm soll wissen, dass sie bis hierher kommen.“",
            "Der Sack bleibt unter ihrem Fuß, bis der Junge zurück ist.",
          ]
        : [
            "Die Müllerin hört dich an. Dann schiebt sie den Sack selbst zum Rathaus.",
            "„Wenn du schon Lärm machst, dann wenigstens am richtigen Haus.“",
          ],
    });
  } else {
    held.mehlsackGefunden = true;
    await rt.present({
      title: "Am Brunnen",
      art: "well",
      portrait: "miller",
      held,
      lines: [
        "Die Müllerin zieht den Sack zurück in den Schatten.",
        "„Nicht alles, was fremd ist, muss sofort vor Holm liegen.“",
      ],
    });
  }
}

async function dorfBettler(rt: Runtime, held: Held) {
  const wahl = await rt.present({
    title: "Am Brunnen",
    art: "well",
    portrait: null,
    held,
    lines: [
      "Am Brunnenrand sitzt ein alter Mann mit einem Groschen zwischen den Fingern.",
      "Der Brunnen riecht nach Eisen und Regen.",
      "„Ein Groschen“, sagt er. Nicht bittend. Eher, als würde er eine offene Rechnung nennen.",
    ],
    choices: [
      held.gold > 0 ? "Einen Groschen geben" : "Einen Groschen versprechen, den du nicht hast",
      "Nach dem Grund fragen (Charisma, mittel)",
      "Weitergehen",
    ],
  });

  if (wahl === 0 && held.gold > 0) {
    held.gold -= 1;
    held.bettlerGeholfen = true;
    await rt.present({
      title: "Am Brunnen",
      art: "well",
      portrait: null,
      held,
      log: ["→ 1 Groschen. Der Beutel ist leichter."],
      lines: [
        "Du gibst ihm die Münze.",
        "Der Bettler zählt sie nicht. Er steckt sie ein, als wäre sie schwerer als sie aussieht.",
        "„Du hast gefragt, was es kostet“, sagt er. „Das tun hier nicht viele.“",
      ],
    });
    return;
  }

  if (wahl === 0) {
    held.bettlerAbgewiesen = true;
    await rt.present({
      title: "Am Brunnen",
      art: "well",
      portrait: null,
      held,
      lines: [
        "Du tastest in den Beutel. Nichts, was man teilen könnte.",
        "Der Bettler nickt, als hätte er genau das erwartet.",
      ],
    });
    return;
  }

  if (wahl === 1) {
    const ergebnis = probe(held, "Charisma", held.charisma, MITTEL, "den Bettler ernst nehmen");
    if (ergebnis.erfolg) {
      held.bettlerGeholfen = true;
      await rt.present({
        title: "Am Brunnen",
        art: "well",
        portrait: null,
        held,
        probe: ergebnis,
        lines: [
          "Der Bettler sieht zum Wasser. Unten treibt ein Blatt im Kreis.",
          "„Ich brauche den Groschen nicht. Ich brauche, dass einer zuhört, bevor er urteilt.“",
          "Er nennt dir keinen Namen. Aber er merkt sich deinen.",
        ],
      });
    } else {
      held.bettlerAbgewiesen = true;
      await rt.present({
        title: "Am Brunnen",
        art: "well",
        portrait: null,
        held,
        probe: ergebnis,
        lines: [
          "Der Mann hört dir zu. Das ist nicht dasselbe wie dir zu glauben.",
          "„Schon gut“, sagt er. Der Groschen bleibt zwischen seinen Fingern.",
          "Er geht, ohne dich anzusehen. Der Brunnen wirkt plötzlich kälter.",
        ],
      });
    }
    return;
  }

  held.bettlerAbgewiesen = true;
  await rt.present({
    title: "Am Brunnen",
    art: "well",
    portrait: null,
    held,
    lines: [
      "Du gehst weiter. Es ist nur ein Groschen.",
      "Hinter dir hört das Rascheln der Hand nicht auf.",
    ],
  });
}

async function dorfBettlerRueckkehr(rt: Runtime, held: Held) {
  await rt.present({
    title: "Am Schmied",
    art: "village",
    portrait: null,
    held,
    lines: held.bettlerGeholfen
      ? [
          "Beim Schmied steht der alte Mann neben dem Amboss.",
          "Der Schmied sieht dich an, dann auf die Münze in der Hand des Bettlers.",
          "„Für heute geht die Reparatur aufs Haus“, sagt er. „Morgen kostet sie wieder.“",
          "Der Bettler ist fort, bevor du dich bedanken kannst.",
        ]
      : [
          "Beim Schmied sitzt der alte Mann auf einem umgedrehten Eimer.",
          "Er sieht dich kommen und sieht dann weg. Der Schmied tut, als hätte er nichts bemerkt.",
          "Etwas Kleines kann man ablehnen. Die Erinnerung daran wird dadurch nicht kleiner.",
        ],
  });
}

async function szeneGlockenweg(rt: Runtime, held: Held) {
  const lines = [
    "Der alte Glockenweg steigt hinter den letzten Häusern an.",
    "Nasser Stein. Salzstaub im Gras. Oben hängt eine kleine Kapellenglocke im Wind.",
  ];
  if (held.glockeGescheitert) lines.push("Das Seil schwingt noch. Unten im Tal hat man es gehört.");
  await rt.present({ title: "Alter Glockenweg", art: "road", portrait: null, held, lines });

  const wahl = await rt.present({
    title: "Alter Glockenweg",
    art: "forest",
    portrait: null,
    held,
    lines: ["Neben der Kapelle wartet eine Botin. Unterhalb des Pfads liegt ein umgestürzter Sack."],
    choices: [
      held.sannaGeholfen || held.sannaAbgewiesen ? "Sanna erneut ansprechen" : "Der Botin Sanna helfen",
      held.salzGerettet || held.salzLiegenGelassen ? "Jorren erneut ansprechen" : "Den Salzsack im Geröll bergen",
      held.glockeGestoppt || held.glockeGescheitert ? "Die Kapellenglocke prüfen" : "Die Glocke zum Schweigen bringen",
      "Nach Lindendorf zurückkehren",
    ],
  });

  if (wahl === 0) await glockenwegSanna(rt, held);
  else if (wahl === 1) await glockenwegSalz(rt, held);
  else if (wahl === 2) await glockenwegGlocke(rt, held);
}

async function glockenwegSanna(rt: Runtime, held: Held) {
  if (held.sannaGeholfen || held.sannaAbgewiesen) {
    await rt.present({ held, lines: ["Sanna zählt die Schnallen ihrer Tasche. Der fehlende Brief fehlt noch immer."] });
    return;
  }
  const wahl = await rt.present({
    title: "Sanna, die Botin",
    art: "road",
    portrait: null,
    held,
    lines: [
      "Sanna trägt eine Ledertasche ohne Brief.",
      "„Er ist mir im Geröll aus der Hand gerutscht. Wenn ich leer zurückkomme, glaubt man mir weniger als dem Regen.“",
    ],
    choices: [
      "Die Spur im Geröll lesen (Geschick, leicht)",
      "Sanna beruhigen und den Inhalt rekonstruieren (Charisma, mittel)",
      "Weitergehen",
    ],
  });
  if (wahl === 2) {
    held.sannaAbgewiesen = true;
    await rt.present({ held, lines: ["Sanna zählt die Schnallen noch einmal. Du steigst allein weiter."] });
    return;
  }
  const attribut = wahl === 0 ? "Geschicklichkeit" : "Charisma";
  const wert = wahl === 0 ? held.geschick : held.charisma;
  const schwierigkeit = wahl === 0 ? LEICHT : MITTEL;
  const ergebnis = probe(held, attribut, wert, schwierigkeit, "Sannas verlorenen Brief finden");
  if (ergebnis.erfolg) {
    held.sannaGeholfen = true;
    await rt.present({
      title: "Sanna, die Botin",
      art: "road",
      portrait: null,
      held,
      probe: ergebnis,
      lines: [
        "Das Papier steckt unter einem nassen Stein. Die Schrift ist verschmiert, aber lesbar.",
        "„Die Glocke nicht läuten“, steht dort. Mehr Warnung als Nachricht.",
        "Sanna faltet den Brief. Ihre Hände zittern erst, als sie ihn wieder hat.",
      ],
    });
  } else {
    held.sannaAbgewiesen = true;
    await rt.present({ held, probe: ergebnis, lines: ["Das Geröll gibt keinen Brief her. Sanna nimmt die leere Tasche.", "„Dann war es wohl meiner“, sagt sie."] });
  }
}

async function glockenwegSalz(rt: Runtime, held: Held) {
  if (held.salzGerettet || held.salzLiegenGelassen) {
    await rt.present({ held, lines: ["Jorren prüft den Knoten am Salzsack. Er hält. Diesmal."] });
    return;
  }
  const wahl = await rt.present({
    title: "Jorren im Geröll",
    art: "ditch",
    portrait: null,
    held,
    lines: [
      "Jorren kniet neben einem aufgerissenen Sack.",
      "„Salz für drei Wochen“, sagt er. „Wenn der Berg es frisst, zahlen am Ende wieder die Falschen.“",
    ],
    choices: [
      "Den Stein heben (Stärke, mittel)",
      "Die Last neu sichern (Geschick, leicht)",
      "Den Sack liegen lassen",
    ],
  });
  if (wahl === 2) {
    held.salzLiegenGelassen = true;
    await rt.present({ held, lines: ["Der Salzstaub bleibt im Regen. Jorren bindet seinen leeren Sack zu."] });
    return;
  }
  const attribut = wahl === 0 ? "Stärke" : "Geschicklichkeit";
  const wert = wahl === 0 ? held.staerke : held.geschick;
  const schwierigkeit = wahl === 0 ? MITTEL : LEICHT;
  const ergebnis = probe(held, attribut, wert, schwierigkeit, "den Salzsack bergen");
  if (ergebnis.erfolg) {
    held.salzGerettet = true;
    const gold = goldPlus(held, 2, "Jorrens Dank");
    await rt.present({ held, probe: ergebnis, log: [gold], lines: ["Der Sack hält. Jorren zählt zwei Münzen ab.", "„Mehr habe ich nicht. Mehr wäre gelogen.“"] });
  } else {
    held.salzLiegenGelassen = true;
    await rt.present({ held, probe: ergebnis, lines: ["Der Stein rutscht zurück. Das Salz verschwindet im nassen Gras."] });
  }
}

async function glockenwegGlocke(rt: Runtime, held: Held) {
  if (held.glockeGestoppt || held.glockeGescheitert) {
    await rt.present({ held, lines: [held.glockeGestoppt ? "Das Glockenseil liegt sauber aufgerollt. Kein Wind bringt es mehr zum Sprechen." : "Das Glockenseil schwingt noch. Unten im Tal wartet man vielleicht schon."] });
    return;
  }
  const wahl = await rt.present({
    title: "Die Kapellenglocke",
    art: "ditch",
    portrait: null,
    held,
    lines: [
      "Die Glocke ist klein. Ihr Ton wäre es nicht.",
      "Das Seil wurde an einer Stelle neu geknotet. Jemand benutzt sie regelmäßig.",
    ],
    choices: ["Das Seil lösen (Geschick, mittel)", "Die Glocke in Ruhe lassen"],
  });
  if (wahl === 1) {
    held.glockeGescheitert = true;
    await rt.present({ held, lines: ["Du lässt das Seil hängen. Der Wind erledigt den Rest."] });
    return;
  }
  const ergebnis = probe(held, "Geschicklichkeit", held.geschick, MITTEL, "das Glockenseil lösen");
  if (ergebnis.erfolg) {
    held.glockeGestoppt = true;
    await rt.present({ held, probe: ergebnis, lines: ["Der Knoten gibt nach. Die Glocke bleibt still.", "Stille ist hier keine Ruhe. Sie ist ein Vorteil."] });
  } else {
    held.glockeGescheitert = true;
    held.banditenGewarnt = true;
    await rt.present({ held, probe: ergebnis, lines: ["Das Seil reißt. Die Glocke schlägt einmal an.", "Unten im Tal antwortet kein Mensch. Das ist schlimmer."] });
  }
}

async function szeneWald(rt: Runtime, held: Held) {
  const ankunftszeilen = [
    "Der Wald von Lindendorf ist kein Märchenwald.",
    "Nasses Laub. Krähen. Ein Pfad, der sich entscheidet, kein Pfad mehr zu sein.",
    "Irgendwo voraus liegt der Steinbruch. Dazwischen: Spuren, ein Hindernis, vielleicht Beute.",
  ];
  if (held.mehlsackGefunden) {
    ankunftszeilen.push("An einem Farn klebt grauer Staub. Der falsche Mehlsack hat nicht gelogen.");
  } else if (held.mehlsackGemeldet) {
    ankunftszeilen.push("Im Dorf wird man den Sack melden. Ob das schnell genug ist, weiß niemand.");
  }
  if (held.schnurGeholfen) {
    ankunftszeilen.push("Ein roter Faden hängt am Zaunpfahl. Dahinter führt ein schmaler Weg nach Osten.");
  }
  if (held.sannaGeholfen) {
    ankunftszeilen.push("Die Warnung aus Sannas Brief sitzt noch im Kopf: Die Glocke nicht läuten.");
  }
  if (held.salzGerettet) {
    ankunftszeilen.push("Zwischen den Steinen liegt Salzstaub. Jorren hat nicht übertrieben.");
  }
  await rt.present({
    title: "Wald",
    art: "forest",
    portrait: null,
    held,
    lines: ankunftszeilen,
  });

  const wahl = await rt.present({
    held,
    lines: ["Du findest Abdrücke im Matsch. Zu groß für Ziegen. Zu viele für Wanderer."],
    choices: [
      "Die Spuren behutsam lesen (Geschick, leicht)",
      "Geradeaus durch das Unterholz (Stärke, mittel)",
      "In den Wald rufen, ob jemand hilft (Charisma, mittel)",
    ],
  });

  let spurenGefunden = false;

  if (wahl === 0) {
    const ergebnis = probe(held, "Geschicklichkeit", held.geschick, LEICHT, "Spuren lesen");
    if (ergebnis.erfolg) {
      spurenGefunden = true;
      const stochern = await rt.present({
        held,
        probe: ergebnis,
        lines: [
          "Ostwärts. Gespaltene Eiche. Danach ein Wildpfad, den Wagen nicht nutzen.",
          "Zwischen den Wurzeln blinkt etwas.",
        ],
        choices: ["Im Wurzelwerk stochern", "Weitergehen"],
      });
      if (stochern === 0) await waldBeute(rt, held);
    } else {
      const lines = [
        "Die Abdrücke verlieren sich. Du folgst einem Wildwechsel und gewinnst eine Stunde Nässe.",
      ];
      if (chance(2)) lines.push(schaden(held, 1, "Dornen und Stolpern"));
      await rt.present({ held, probe: ergebnis, lines });
    }
  } else if (wahl === 1) {
    const ergebnis = probe(held, "Stärke", held.staerke, MITTEL, "Unterholz durchbrechen");
    if (ergebnis.erfolg) {
      const lines = [
        "Du machst dir einen Weg. Laut, aber schnell.",
        "Laut ist im Banditenwald eine Entscheidung.",
      ];
      if (chance(3)) {
        held.banditenGewarnt = true;
        lines.push("Irgendwo knackt Antwort. Nicht von dir.");
      }
      await rt.present({ held, probe: ergebnis, lines });
    } else {
      const dmg = schaden(held, 2, "Peitschenhiebe der Zweige, ein böser Sturz");
      await rt.present({
        held,
        probe: ergebnis,
        lines: [dmg, "Du kommst durch. Der Wald behält eine Gebühr."],
      });
    }
  } else {
    const ergebnis = probe(held, "Charisma", held.charisma, MITTEL, "Hilfe im Wald");
    if (ergebnis.erfolg) {
      const item = nimm(held, HEILTRANK);
      spurenGefunden = true;
      await rt.present({
        held,
        probe: ergebnis,
        log: [item],
        lines: [
          "Ein Köhler tritt zwischen die Stämme, als hätte der Rauch ihn ausgespuckt.",
          "„Steinbruch. Östlicher Pfad. Und nimm das, bevor du stirbst und hier liegend stinkst.“",
        ],
      });
    } else {
      held.banditenGewarnt = true;
      await rt.present({
        held,
        probe: ergebnis,
        lines: [
          "Dein Ruf hängt im Geäst und kommt nicht zurück.",
          "Dafür antwortet etwas anderes: ein Pfiff, kurz, von weit vorn.",
        ],
      });
    }
  }

  if (tot(held)) return;
  await vielleichtHeiltrank(rt, held);
  if (tot(held)) return;

  const graben = await rt.present({
    title: "Graben",
    art: "ditch",
    portrait: null,
    held,
    lines: [
      "Der Pfad endet an einem Graben. Frisch ausgehoben, mit Pfählen gespickt.",
      "Dahinter ein gestürzter Stamm, nass und glatt. Das ist Absicht, kein Sturm.",
    ],
    choices: [
      "Hinüberspringen (Geschick, mittel)",
      "Den Stamm zur Seite wuchten (Stärke, mittel)",
      "Entlang des Grabens einen Übergang suchen (Zeit, aber sicherer)",
    ],
  });

  if (graben === 0) {
    const schwierigkeit = held.verwundet ? SCHWER : MITTEL;
    const ergebnis = probe(held, "Geschicklichkeit", held.geschick, schwierigkeit, "Sprung über den Graben");
    if (ergebnis.erfolg) {
      await rt.present({
        held,
        probe: ergebnis,
        lines: ["Du landest hart, aber auf der richtigen Seite."],
      });
    } else {
      const dmg = schaden(held, 3, "Pfahl und Fall");
      await rt.present({
        held,
        probe: ergebnis,
        lines: [dmg, "Schlamm im Mund. Ein Riss im Ärmel. Der Graben hat sich genommen, was er wollte."],
      });
    }
  } else if (graben === 1) {
    const ergebnis = probe(held, "Stärke", held.staerke, MITTEL, "Stamm bewegen");
    if (ergebnis.erfolg) {
      await rt.present({
        held,
        probe: ergebnis,
        lines: ["Der Stamm gibt nach. Der Graben bleibt, aber du hast eine Brücke aus Totholz."],
      });
    } else {
      const dmg = schaden(held, 2, "der Stamm rollt zurück");
      await rt.present({
        held,
        probe: ergebnis,
        lines: [dmg, "Du kommst trotzdem rüber — auf allen vieren, fluchend."],
      });
    }
  } else {
    const lines = [
      "Du verlierst Zeit. Der Wald wird dunkler.",
      "Dafür findest du eine Stelle, an der der Graben seicht ist.",
    ];
    const log: string[] = [];
    if (!spurenGefunden && chance(2)) {
      lines.push("Im seichten Wasser liegt ein verlorener Ringbund — und daran ein eiserner Schlüssel.");
      log.push(nimm(held, SCHLUESSEL));
    }
    await rt.present({ held, lines, log: log.length ? log : undefined });
  }

  if (tot(held)) return;
  await vielleichtHeiltrank(rt, held);

  if (held.banditenGewarnt) {
    await rt.present({
      art: "camp",
      held,
      lines: [
        "Vor dir wird der Wald dünner. Stimmen. Metall auf Metall.",
        "Sie klingen nicht überrascht. Jemand hat ihnen gesagt, dass ein Gast kommt.",
      ],
    });
  } else {
    await rt.present({
      art: "camp",
      held,
      lines: [
        "Vor dir wird der Wald dünner. Rauch. Leise Stimmen.",
        "Das Lager weiß noch nicht, dass der Wald heute Besuch hat.",
      ],
    });
  }
  if (held.holmSiegelGefunden) {
    await rt.present({
      art: "camp",
      portrait: null,
      held,
      lines: ["Am Rand des Lagers liegt ein Brief mit rotem Wachs. Holms gebrochenes Siegel war kein Einzelfall."],
    });
  }
  if (held.glockeGestoppt) {
    await rt.present({
      art: "camp",
      portrait: null,
      held,
      lines: ["Kein Glockenton kommt vom Hang. Im Lager merkt man die Stille erst, als jemand zu spät aufsteht."],
    });
  }
}

async function waldBeute(rt: Runtime, held: Held) {
  const fund = pick([GOLD, HEILTRANK, SCHLUESSEL]);
  if (fund === GOLD) {
    const gold = goldPlus(held, 4, "vergrabene Münzen unter der Wurzel");
    await rt.present({ held, log: [gold], lines: ["Zwischen den Wurzeln blinkt Metall."] });
  } else if (fund === HEILTRANK) {
    if (hat(held, HEILTRANK)) {
      const gold = goldPlus(held, 3, "statt eines zweiten Tranks: Münzen im Moos");
      await rt.present({ held, log: [gold], lines: ["Kein zweites Fläschchen. Nur Münzen im Moos."] });
    } else {
      const item = nimm(held, HEILTRANK);
      await rt.present({
        held,
        log: [item],
        lines: ["Ein Fläschchen, in Leder gewickelt. Jemand hat es nicht mehr gebraucht."],
      });
    }
  } else {
    const item = nimm(held, SCHLUESSEL);
    await rt.present({
      held,
      log: [item],
      lines: ["Ein eiserner Schlüssel, grün vor Feuchtigkeit. Passt zu keinem Dorfschloss."],
    });
  }
}

async function szeneLager(rt: Runtime, held: Held) {
  const lines = [
    "Der Steinbruch ist eine Wunde im Hügel.",
    "Drei Zelte. Ein Feuer. Eine Kiste mit dem Siegel der Kirche von Lindendorf.",
    "Ein Mann mit einer Narbe über der Lippe — das wird Kess sein — würfelt mit zwei anderen.",
    "Ein vierter steht oben auf dem Felsen und schaut den Weg entlang, den du gekommen bist.",
  ];
  if (hat(held, SCHLUESSEL)) {
    lines.push("An der Felsschräge sitzt ein altes Gittertor. Dein Schlüssel juckt im Beutel.");
  }
  if (held.banditenGewarnt) {
    lines.push("Die Würfelpause ist zu kurz. Kess hebt den Kopf. „Na. Der Gast aus der Taverne.“");
  } else {
    lines.push("Noch sitzen sie. Noch ist der Posten oben gelangweilt.");
  }

  const choices = [
    "Anschleichen (Geschick)",
    "Heraustreten und reden (Charisma)",
    "Angreifen (Stärke)",
  ];
  if (hat(held, SCHLUESSEL)) choices.push("Mit dem Schlüssel das Seitentor nutzen");

  const wahl = await rt.present({
    title: "Banditenlager",
    art: "camp",
    portrait: "kess",
    held,
    lines,
    choices,
  });

  if (wahl === 0) await lagerSchleichen(rt, held);
  else if (wahl === 1) await lagerReden(rt, held);
  else if (wahl === 2) await lagerKampf(rt, held);
  else await lagerSeitetor(rt, held);

  if (!tot(held) && held.lagerGeloest) {
    await rt.present({
      art: "camp",
      portrait: null,
      held,
      lines: ["Das Feuer brennt noch. Die Kiste der Kirche ist leichter, als sie aussieht."],
    });
  }
}

async function lagerSchleichen(rt: Runtime, held: Held) {
  let schwierigkeit = held.banditenGewarnt ? SCHWER : MITTEL;
  const extra: string[] = [];
  if (held.maraGeholfen) {
    schwierigkeit = Math.max(LEICHT, schwierigkeit - 2);
    extra.push("Mara hat dir den schmalen Pfad hinter der Taverne gezeigt. Der Umweg kostet weniger als ein Fehler.");
  }
  if (held.glockeGestoppt) {
    schwierigkeit = Math.max(LEICHT, schwierigkeit - 1);
    extra.push("Die Kapelle bleibt still. Ein Warnsignal fehlt.");
  }
  if (held.verwundet) {
    schwierigkeit = Math.min(18, schwierigkeit + 2);
    extra.push("Die Wunde zerrt. Schleichen mit einem Hinken ist ein Widerspruch.");
  }

  const ergebnis = probe(held, "Geschicklichkeit", held.geschick, schwierigkeit, "Anschleichen");
  if (ergebnis.erfolg) {
    held.loesungsweg = "schleich";
    held.lagerGeloest = true;
    held.beuteGerettet = true;
    const log = [goldPlus(held, 6, "aus der unbewachten Kiste")];
    if (chance(2) && !hat(held, HEILTRANK)) log.push(nimm(held, HEILTRANK));
    await rt.present({
      art: "sneak",
      portrait: null,
      held,
      probe: ergebnis,
      log,
      lines: [
        ...extra,
        "Du nimmst das Kirchensilber, zwei Säcke Getreide markierst du dir nur im Kopf.",
        "Kess würfelt eine Acht und flucht über das Glück, das nicht seines ist.",
        "Du bist schon im Gestrüpp, als der Posten endlich blinzelt.",
      ],
    });
  } else {
    const dmg = schaden(held, 2, "ein geworfener Becher, dann eine Klinge, die nur streift");
    await rt.present({
      art: "sneak",
      held,
      probe: ergebnis,
      lines: [...extra, "Ein Stein. Ein Fluch. Drei Köpfe drehen sich.", dmg],
    });
    if (tot(held)) return;
    const next = await rt.present({
      held,
      lines: ["Jetzt bleibt Reden oder Schlagen."],
      choices: ["Jetzt reden", "Jetzt kämpfen"],
    });
    if (next === 0) await lagerReden(rt, held, true);
    else await lagerKampf(rt, held, false);
  }
}

async function lagerReden(rt: Runtime, held: Held, erwischt = false) {
  let schwierigkeit = held.banditenGewarnt || erwischt ? SCHWER : MITTEL;
  if (held.letzterGastGefunden) schwierigkeit = Math.max(LEICHT, schwierigkeit - 2);
  const wahl = await rt.present({
    title: "Banditenlager",
    art: "camp",
    portrait: "kess",
    held,
    lines: [
      "Kess hat eine Stimme wie ein stumpfer Säbel.",
      "„Lindendorf schickt keine Wache. Lindendorf schickt... dich.“",
      ...(held.letzterGastGefunden ? ["Du erinnerst dich an den Satz aus der Taverne. Kess würfelt nicht. Noch nicht."] : []),
    ],
    choices: [
      "Drohen: Das Dorf hat genug (Charisma)",
      "Handel: Abzug gegen Gold und eine Nacht Vorsprung",
      "Lügen: Hinter dir kommt die Stadtwache",
    ],
  });

  if (wahl === 0) {
    const ergebnis = probe(held, "Charisma", held.charisma, schwierigkeit, "Drohung");
    if (ergebnis.erfolg) {
      held.loesungsweg = "ueberreden";
      held.lagerGeloest = true;
      held.beuteGerettet = true;
      await rt.present({
        held,
        probe: ergebnis,
        lines: [
          "Kess sieht deine Augen länger an als dein Schwert.",
          "„Packen. Bevor ich es mir anders überlege.“",
          "Sie lassen die Kirchenkiste. Mehr Großmut steckt nicht in diesem Steinbruch.",
        ],
      });
    } else {
      await rt.present({
        held,
        probe: ergebnis,
        lines: ["Lachen. Kurzes Lachen. Dann Stahl."],
      });
      await lagerKampf(rt, held, false);
    }
  } else if (wahl === 1) {
    const preis = held.buergermeisterVertraut ? 5 : 8;
    if (held.gold >= preis) {
      const pay = await rt.present({
        held,
        lines: [`Kess will ${preis} Gold, sofort, und dass du den Mund hältst.`],
        choices: [`${preis} Gold zahlen`, "Nicht zahlen"],
      });
      if (pay === 0) {
        held.gold -= preis;
        held.loesungsweg = "ueberreden";
        held.lagerGeloest = true;
        held.beuteGerettet = false;
        await rt.present({
          held,
          lines: [
            `Du zahlst ${preis} Gold. Die Kiste bleibt — leer genug, voll genug.`,
            "Kess nickt. Das ist kein Frieden. Das ist eine Pause mit Preis.",
          ],
        });
        return;
      }
    } else {
      await rt.present({
        held,
        lines: [
          `Kess will ${preis} Gold, sofort, und dass du den Mund hältst.`,
          "Ohne Münzen ist Handel nur Theater.",
        ],
      });
    }
    await rt.present({
      held,
      lines: ["Ohne Münzen ist Handel nur Theater. Theater endet hier mit Messern."],
    });
    await lagerKampf(rt, held, false);
  } else {
    const luegeSchwer = held.banditenGewarnt ? SCHWER : MITTEL;
    const ergebnis = probe(held, "Charisma", held.charisma, luegeSchwer, "Lüge von der Wache");
    if (ergebnis.erfolg) {
      held.loesungsweg = "ueberreden";
      held.lagerGeloest = true;
      held.beuteGerettet = true;
      await rt.present({
        held,
        probe: ergebnis,
        lines: [
          "Kess glaubt nicht an Helden. Er glaubt an Galgen.",
          "In zehn Atemzügen ist das Lager halb leer. Die Kiste bleibt, weil sie schwer ist.",
        ],
      });
    } else {
      held.banditenGewarnt = true;
      await rt.present({
        held,
        probe: ergebnis,
        lines: ["„Die Wache. Natürlich. Und ich bin der Bischof.“"],
      });
      await lagerKampf(rt, held, false);
    }
  }
}

async function lagerKampf(rt: Runtime, held: Held, ueberrascht = true) {
  await rt.present({
    title: "Steinbruch",
    art: "combat",
    portrait: "kess",
    held,
    lines: ["Kein Duell. Ein Gedränge aus Stahl, Feuerlicht und schlechtem Boden."],
  });

  let s1 = ueberrascht && !held.banditenGewarnt ? MITTEL : SCHWER;
  if (held.schmiedGeholfen) s1 = Math.max(LEICHT, s1 - 1);
  if (held.verwundet) s1 = Math.min(18, s1 + 1);

  const erster = probe(held, "Stärke", held.staerke, s1, "erster Schlag");
  let s2 = MITTEL;
  if (erster.erfolg) {
    await rt.present({
      held,
      probe: erster,
      lines: ["Der erste geht zu Boden. Die anderen zögern — das ist mehr wert als Blut."],
    });
  } else {
    const dmg = schaden(held, 4, "Kess' Messer findet Stoff und Haut");
    await rt.present({
      held,
      probe: erster,
      lines: [dmg, "Du bleibst stehen, weil Hinfallen hier das Ende wäre."],
    });
    if (tot(held)) return;
    s2 = SCHWER;
  }

  await vielleichtHeiltrank(rt, held);
  if (tot(held)) return;

  const zweiter = probe(held, "Stärke", held.staerke, s2, "den Steinbruch halten");
  if (zweiter.erfolg) {
    held.loesungsweg = "kampf";
    held.lagerGeloest = true;
    held.beuteGerettet = true;
    const gold = goldPlus(held, 5, "von den Gürteln der Fliehenden");
    await rt.present({
      held,
      probe: zweiter,
      log: [gold],
      lines: [
        "Kess flieht nicht wie ein Anführer, sondern wie ein Mann, der zählen kann.",
        "Zwei bleiben liegen. Einer stöhnt. Das Lager gehört dem Rauch und dir.",
      ],
    });
  } else {
    const dmg = schaden(held, 5, "zu viele Klingen, zu wenig Platz");
    await rt.present({
      held,
      probe: zweiter,
      lines: [dmg, "Du reißt dir die Kirchenkiste unter den Arm und taumelst in den Wald."],
    });
    if (tot(held)) return;
    const flucht = probe(held, "Geschicklichkeit", held.geschick, MITTEL, "mit der Beute entkommen");
    held.loesungsweg = "kampf";
    held.lagerGeloest = true;
    if (flucht.erfolg) {
      held.beuteGerettet = true;
      await rt.present({
        art: "forest",
        portrait: null,
        held,
        probe: flucht,
        lines: ["Sie folgen nicht weit. Verwundete Jäger sind schlechte Jäger."],
      });
    } else {
      held.beuteGerettet = false;
      await rt.present({
        art: "forest",
        portrait: null,
        held,
        probe: flucht,
        lines: [
          "Die Kiste bleibt im Farn. Du behältst dein Leben, nicht den Auftrag.",
          "Hinter dir lacht jemand, dem das reicht.",
        ],
      });
    }
  }
}

async function lagerSeitetor(rt: Runtime, held: Held) {
  const wahl = await rt.present({
    title: "Seitentor",
    art: "gate",
    portrait: null,
    held,
    lines: [
      "Der Schlüssel dreht sich schwer. Rost redet mit, gibt aber nach.",
      "Du kommst hinter dem Holzstapel raus — näher an der Kiste als am Feuer.",
    ],
    choices: [
      "Nur die Beute nehmen und verschwinden (Geschick, leicht)",
      "Die Seile der Zelte kappen und Chaos nutzen (Geschick, mittel)",
      "Kess von hinten stellen (Stärke, mittel)",
    ],
  });

  if (wahl === 0) {
    const ergebnis = probe(held, "Geschicklichkeit", held.geschick, LEICHT, "Beute am Seitentor");
    if (ergebnis.erfolg) {
      held.loesungsweg = "schleich";
      held.lagerGeloest = true;
      held.beuteGerettet = true;
      const gold = goldPlus(held, 6, "Kirchensilber");
      await rt.present({
        art: "sneak",
        held,
        probe: ergebnis,
        log: [gold],
        lines: ["Kein Heldenepos. Eine offene Tür und ein geschlossener Mund."],
      });
    } else {
      await rt.present({
        held,
        probe: ergebnis,
        lines: ["Die Kiste schabt über Stein. Kess hört das."],
      });
      await lagerKampf(rt, held, false);
    }
  } else if (wahl === 1) {
    const ergebnis = probe(held, "Geschicklichkeit", held.geschick, MITTEL, "Zelte sabotieren");
    if (ergebnis.erfolg) {
      held.loesungsweg = "schleich";
      held.lagerGeloest = true;
      held.beuteGerettet = true;
      const gold = goldPlus(held, 4, "in der Verwirrung");
      await rt.present({
        art: "combat",
        held,
        probe: ergebnis,
        log: [gold],
        lines: ["Stoff stürzt, Glut springt, Männer fluchen auf das Wetter und auf dich."],
      });
    } else {
      const dmg = schaden(held, 2, "ein Wachposten sieht dich am Tau");
      await rt.present({ held, probe: ergebnis, lines: [dmg] });
      if (!tot(held)) await lagerKampf(rt, held, false);
    }
  } else {
    const ergebnis = probe(held, "Stärke", held.staerke, MITTEL, "Kess stellen");
    if (ergebnis.erfolg) {
      held.loesungsweg = "kampf";
      held.lagerGeloest = true;
      held.beuteGerettet = true;
      const gold = goldPlus(held, 5, "Kess' Beutel");
      await rt.present({
        art: "combat",
        portrait: "kess",
        held,
        probe: ergebnis,
        log: [gold],
        lines: [
          "Kess ist ein Schwätzer. Schwätzer drehen sich zu langsam um.",
          "Die anderen rennen, als ihr Anführer kniet.",
        ],
      });
    } else {
      const dmg = schaden(held, 3, "Kess ist schneller als sein Mund");
      await rt.present({
        art: "combat",
        portrait: "kess",
        held,
        probe: ergebnis,
        lines: [dmg],
      });
      if (!tot(held)) await lagerKampf(rt, held, false);
    }
  }
}

async function szeneEnde(rt: Runtime, held: Held) {
  if (tot(held) || held.lp <= 0) {
    await rt.present({
      title: "Ende",
      art: "death",
      portrait: null,
      held,
      ending: "Der Wald behält dich.",
      lines: [
        `${held.name} bleibt zwischen Lindendorf und dem Steinbruch.`,
        "Der Wald nimmt das Geräusch, das Dorf behält die Angst.",
        "Man erzählt später von jemandem, der gegangen ist. Nicht von jemandem, der zurückkam.",
      ],
      choices: ["Zurück ins Menü"],
    });
    return;
  }

  await rt.present({
    title: "Ende",
    art: "return",
    portrait: "holm",
    held,
    lines: ["Lindendorf sieht dich früher als Holm. Dann sieht dich Holm."],
  });

  if (!held.lagerGeloest) {
    await rt.present({
      held,
      ending: "Unerledigt.",
      log: epilog(held),
      lines: [
        "Du bringst keine Lösung mit. Nur Dreck und eine Geschichte ohne Schluss.",
        "Holm nickt, als hätte er das erwartet. Die nächste Nacht kommt trotzdem.",
      ],
      choices: ["Zurück ins Menü"],
    });
    return;
  }

  if (held.loesungsweg === "ueberreden" && held.beuteGerettet && held.buergermeisterVertraut) {
    const gold = goldPlus(held, 6, "Belohnung des Bürgermeisters");
    await rt.present({
      held,
      ending: "Das Wort war die Waffe.",
      log: [gold, ...epilog(held)],
      lines: [
        "Du hast gesprochen, wo andere schlagen wollten.",
        "Das Silber der Kirche liegt wieder auf Holms Tisch. Holm atmet zum ersten Mal heute.",
        "„Bleib, wenn du willst. Lindendorf zahlt schlecht. Aber es vergisst nicht.“",
      ],
      choices: ["Zurück ins Menü"],
    });
  } else if (held.loesungsweg === "ueberreden" && !held.beuteGerettet) {
    const lines = [
      "Die Banditen sind weg. Die Kiste auch nicht voller.",
      "Holm hört zu, ohne Dank. Ein Dorf, das zahlt, damit man es in Ruhe lässt,",
      "hat das schon einmal getan.",
    ];
    if (held.buergermeisterVertraut) {
      lines.push("Trotzdem sieht er dich nicht als Feind. Nur als teure Lektion.");
    }
    await rt.present({
      held,
      ending: "Gekaufter Frieden.",
      log: epilog(held),
      lines,
      choices: ["Zurück ins Menü"],
    });
  } else if (held.loesungsweg === "schleich" && held.beuteGerettet) {
    const log: string[] = [];
    const lines = [
      "Kein Blut auf dem Marktplatz. Nur eine Kiste, die wieder da ist.",
      "Manche nennen das Feigheit. Holm nennt es Ergebnis.",
    ];
    if (held.buergermeisterVertraut) {
      log.push(goldPlus(held, 5, "stille Belohnung"));
      lines.push("„Die besten Boten sind die, von denen niemand ein Lied singt.“");
    } else {
      log.push(goldPlus(held, 2, "knappe Anerkennung"));
    }
    if (held.glockeGestoppt) lines.push("Über dem Weg bleibt die Kapelle still. Das hat dir Zeit gekauft.");
    if (held.sannaGeholfen) lines.push("Sannas Warnung war richtig: Du wurdest erst spät bemerkt.");
    await rt.present({
      held,
      ending: "Schattenarbeit.",
      log: [...log, ...epilog(held)],
      lines,
      choices: ["Zurück ins Menü"],
    });
  } else if (held.loesungsweg === "kampf" && held.beuteGerettet && !held.verwundet) {
    const gold = goldPlus(held, held.buergermeisterVertraut ? 8 : 4, "Siegeslohn");
    await rt.present({
      held,
      ending: "Der kurze Ruhm.",
      log: [gold, ...epilog(held)],
      lines: [
        "Du kommst aufrecht zurück. Das Dorf versteht Stahl besser als Feinheiten.",
        "Ein Junge am Brunnen ahmt deinen Gang nach, bis seine Mutter ihn zieht.",
      ],
      choices: ["Zurück ins Menü"],
    });
  } else if (held.loesungsweg === "kampf" && held.verwundet) {
    if (held.beuteGerettet) {
      const gold = goldPlus(held, held.buergermeisterVertraut ? 4 : 2, "Lohn trotz Wunde");
      await rt.present({
        held,
        ending: "Teurer Sieg.",
        log: [gold, ...epilog(held)],
        lines: [
          "Du kommst zurück. Das reicht dem Dorf. Es reicht dir fast.",
          "Witwe Kern verbindet, ohne zu fragen, wer angefangen hat.",
          ...(held.kernGeholfen ? ["Sie erkennt den Verbandstoff. „Dann war die Schublade nicht umsonst.“"] : []),
        ],
        choices: ["Zurück ins Menü"],
      });
    } else {
      await rt.present({
        held,
        ending: "Überlebt, nicht erledigt.",
        log: epilog(held),
        lines: [
          "Du kommst zurück. Das reicht dem Dorf. Es reicht dir fast.",
          "Witwe Kern verbindet, ohne zu fragen, wer angefangen hat.",
          ...(held.kernGeholfen ? ["Sie erkennt den Verbandstoff. „Dann war die Schublade nicht umsonst.“"] : []),
          "Die Beute fehlt. Holm zahlt in Blicken, nicht in Münzen.",
        ],
        choices: ["Zurück ins Menü"],
      });
    }
  } else {
    await rt.present({
      held,
      ending: "Genug für ein Tal.",
      log: epilog(held),
      lines: [
        "Das Lager ist kein Lager mehr. Was genau passiert ist, erzählst du unvollständig.",
        "Lindendorf nimmt, was es bekommen kann: eine ruhigere Woche.",
      ],
      choices: ["Zurück ins Menü"],
    });
  }
}

function epilog(held: Held): string[] {
  const bits: string[] = [];
  if (held.banditenGewarnt) bits.push("Die Banditen wussten von dir, bevor du sie sahst.");
  if (held.buergermeisterVertraut) bits.push("Holm schuldet dir etwas, das nicht in der Kasse steht.");
  if (held.kernGeholfen) bits.push("Witwe Kern hat wieder Verbandstoff. Woher, fragt sie nicht.");
  if (held.holmSiegelGefunden) bits.push("Das gebrochene Siegel liegt noch auf Holms Tisch.");
  if (held.schnurGeholfen) bits.push("Am östlichen Zaun hängt kein roter Faden mehr.");
  if (held.sannaGeholfen) bits.push("Sanna trägt wieder einen Brief. Diesmal hält sie ihn fest.");
  if (held.salzGerettet) bits.push("Jorren zählt das Salz nach, obwohl er weiß, dass es nicht mehr wird.");
  if (held.glockeGestoppt) bits.push("Die Kapelle schweigt über dem Weg.");
  if (held.verwundet) bits.push("Die Wunde bleibt eine Weile. Narben sind in Lindendorf eine Art Ausweis.");
  if (hat(held, SCHLUESSEL)) bits.push("Der Schlüssel zum Seitentor ist noch da. Türen bleiben eine Versuchung.");
  if (!bits.length) bits.push("Du gehst leichter, als du gekommen bist. Das ist selten.");
  return bits.map((b) => `— ${b}`);
}
