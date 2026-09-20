import { HEILTRANK, createHeld, type EffektId, type Held } from "./types";

export type HerkunftArt = "gnade" | "ordnung" | "nutzen";

export type HerkunftAntwort = {
  label: string;
  art: HerkunftArt;
  lp?: number;
  gold?: number;
  inventar?: string[];
  effekte?: EffektId[];
  mal: string;
};

export type HerkunftFrage = {
  id: string;
  titel: string;
  geschichte: string[];
  antworten: HerkunftAntwort[];
};

export const HERKUNFT_FRAGEN: HerkunftFrage[] = [
  {
    id: "soldateska",
    titel: "Die Soldateska",
    geschichte: [
      "Der Schlamm hält die Stiefel fest, als du die Palisade erreichst. Hinter den Dächern steigt Rauch auf, der nicht nach Brot riecht. Die Söldner sind schon da. Ihr Anführer reitet auf einem gescheckten Gaul, ohne abzusteigen.",
      "„Du bist der Älteste?“ Die Frage gilt dem, der antwortet. Deine Hand zuckt zum Messer. Eine dumme Geste. Die Finger kennen keine andere.",
      "„Wir wissen, dass ihr Vorräte habt. Gebt sie her, und wir ziehen weiter. Versteckt sie — und wir nehmen sie uns. Mit Feuer.“ Hinter dir stehen Frauen, Kinder, Männer ohne Waffen. Die Angst hat keine andere Sprache.",
    ],
    antworten: [
      {
        label: "Die Vorräte verraten. Das Dorf hier überlebt. Das nächste zahlt.",
        art: "ordnung",
        gold: 1,
        effekte: ["erschoepfung"],
        mal: "Vorräte hergibt, damit das Feuer woanders brennt",
      },
      {
        label: "Lügen. Sagen, es gäbe nichts. Riskieren, dass beide Dörfer brennen.",
        art: "nutzen",
        effekte: ["furcht"],
        mal: "lügt, wenn Söldner nach Mehl fragen",
      },
      {
        label: "Sie an den Brunnen schicken. Das Wasser dort kennt schon Gift.",
        art: "nutzen",
        effekte: ["konzentriert"],
        mal: "Söldner an einen Brunnen schickt, der nicht heilen soll",
      },
    ],
  },
  {
    id: "feind",
    titel: "Der verwundete Feind",
    geschichte: [
      "Er liegt im Graben vor dem Steinbruch, der Atem pfeift. Der Brustpanzer ist aufgerissen. Darunter eine Wunde, die nicht mehr geschlossen werden will. Am Umhang sitzt ein Zeichen, das nicht zu Lindendorf gehört.",
      "Er sieht dich. Die Lippen bewegen sich. „Wasser.“ Am Gürtel hängt ein voller Schlauch. Das Messer ist schon in der Hand.",
    ],
    antworten: [
      {
        label: "Ihm Wasser geben und die Wunde verbinden. Vielleicht kämpft er nie wieder.",
        art: "gnade",
        lp: 1,
        effekte: ["traurig"],
        mal: "einem Feind Wasser reicht, bevor er stirbt",
      },
      {
        label: "Ihm den Hals durchschneiden. Ein toter Feind zählt nicht mehr mit.",
        art: "ordnung",
        gold: 1,
        effekte: ["wunde"],
        mal: "im Graben zu Ende bringt, was noch nach Wasser fragt",
      },
      {
        label: "Ihn mitnehmen. Er arbeitet, bis er umfällt. Das Mehl wartet nicht.",
        art: "nutzen",
        effekte: ["erschoepfung"],
        mal: "Verwundete mahlen lässt, solange sie stehen",
      },
    ],
  },
  {
    id: "ernte",
    titel: "Die gestohlene Ernte",
    geschichte: [
      "Die Frau kniet im Staub hinter der Mühle. Drei Säcke, die nicht ihr gehören. Die Kinder halten sich an ihrem Rock, als könnte Stoff sättigen.",
      "„Bitte“, sagt sie, ohne dich anzusehen. „Sie hungern.“ Die Strafe für Diebstahl kennt jeder: zuerst die Peitsche, beim zweiten Mal der Strick.",
    ],
    antworten: [
      {
        label: "Sie melden. Die Strafe kommt. Die Ordnung bleibt.",
        art: "ordnung",
        effekte: ["konzentriert"],
        mal: "Diebstahl anzeigt, weil das Mehl einen Herrn hat",
      },
      {
        label: "Sie laufen lassen. Tun, als wäre der Staub leer gewesen.",
        art: "gnade",
        effekte: ["gelassen"],
        mal: "drei Säcke nicht gesehen hat",
      },
      {
        label: "Sie zwingen, für dich zu arbeiten. Das Leben hat einen Preis.",
        art: "nutzen",
        gold: 1,
        effekte: ["wunde"],
        mal: "Hunger in Arbeit umrechnet",
      },
    ],
  },
  {
    id: "verraeter",
    titel: "Der Verräter",
    geschichte: [
      "Er steht am Rand des Lagers, das Gesicht im Schatten der Bäume. Du hast ihn gesehen: den Boten, den Beutel, das Gold, das nicht aus diesem Tal stammt.",
      "Er merkt dich. Die Augen werden groß. „Du verstehst das nicht. Meine Familie — sie haben sie.“ Er bricht ab. Du weißt, was folgt, wenn du den Namen laut sagst.",
    ],
    antworten: [
      {
        label: "Ihn melden. Er hängt. Der Verrat endet mit ihm.",
        art: "ordnung",
        effekte: ["motiviert"],
        mal: "Namen nennt, bevor das Gold ihn kauft",
      },
      {
        label: "Ihn decken. Vielleicht ändert er sich. Vielleicht nicht.",
        art: "gnade",
        effekte: ["furcht"],
        mal: "Verrat zudeckt, weil jemand eine Familie hat",
      },
      {
        label: "Ihn erpressen. Fortan arbeitet er für dich, gegen dieselben Leute.",
        art: "nutzen",
        gold: 2,
        effekte: ["erschoepfung"],
        mal: "Verrat in eine zweite Rechnung verwandelt",
      },
    ],
  },
  {
    id: "brot",
    titel: "Die letzte Fuhre",
    geschichte: [
      "Der Karren knarrt. Die Räder saufen im Schlamm. Darunter liegt das Brot für Lindendorf, das seit Tagen ohne Mehl kocht. Vor dir sitzen Kinder, ausgezehrt, die Augen zu groß für ihre Gesichter.",
      "Eine alte Frau steht auf. „Wir haben seit Tagen nichts. Sie können nicht weiter.“ Wenn du verteilst, kommt das Dorf zu spät. Wenn du fährst, bleiben diese hier im Dreck.",
    ],
    antworten: [
      {
        label: "Das Brot verteilen. Die Kinder essen. Lindendorf wartet hungrig.",
        art: "gnade",
        lp: -1,
        effekte: ["hungrig"],
        mal: "Brot an Kinder gibt, das einem anderen Dorf gehört",
      },
      {
        label: "Weiterfahren. Das Dorf bekommt, was auf dem Karren steht.",
        art: "ordnung",
        effekte: ["konzentriert"],
        mal: "am Hunger vorbeifährt, weil ein Karren einen Auftrag hat",
      },
      {
        label: "Die Kinder mitnehmen. Wer geht, arbeitet. Wer bleibt, bleibt.",
        art: "nutzen",
        effekte: ["erschoepfung"],
        mal: "Kinder hinter einem Karren herlaufen lässt",
      },
    ],
  },
  {
    id: "seuche",
    titel: "Die Scheune",
    geschichte: [
      "Die Scheune brennt nicht. Noch nicht. Die Schreie darin werden leiser. Du stehst vor der Tür, den Riegel in der Hand.",
      "Drinnen die Kranken. Draußen die, die noch keinen Husten haben. Im Kesseljahr hat man eine Gasse so geschlossen. Das Fieber hat trotzdem den Platz geholt.",
    ],
    antworten: [
      {
        label: "Die Tür öffnen und Hilfe holen. Einige könnten leben. Alle könnten krank werden.",
        art: "gnade",
        lp: -1,
        effekte: ["neugierig"],
        mal: "eine Seuchentür öffnet, weil drinnen noch Stimmen sind",
      },
      {
        label: "Den Riegel lassen und gehen. Die Kranken sterben. Die anderen nicht.",
        art: "ordnung",
        effekte: ["gelassen"],
        mal: "eine Scheune schließt und weitergeht",
      },
      {
        label: "Die Scheune anzünden. Ein schnelles Ende. Kein Fieber auf dem Platz.",
        art: "nutzen",
        effekte: ["erschoepfung"],
        mal: "Kranke mit der Scheune verbrennt, damit das Dorf atmet",
      },
    ],
  },
  {
    id: "spion",
    titel: "Der Gefangene",
    geschichte: [
      "Er ist an den Pfahl hinter der Schmiede gebunden. Das Gesicht ist eine Maske aus Blut und Dreck. In der Hand hast du die Laterne, nicht die Zange. Noch nicht.",
      "„Ich sage nichts“, presst er hervor. Er kennt den Weg, den sie nachts nehmen. Wenn du ihn zum Reden bringst, weißt du ihn auch. Dann bist du jemand, der das getan hat.",
    ],
    antworten: [
      {
        label: "Ihn zum Reden bringen. Die Wahrheit kommt teuer. Du auch.",
        art: "nutzen",
        gold: 1,
        effekte: ["erschoepfung"],
        mal: "aus einem Gefangenen holt, was der Mund nicht hergeben will",
      },
      {
        label: "Ihn losbinden. Gnade ist eine Wette, die man selten gewinnt.",
        art: "gnade",
        effekte: ["gelassen"],
        mal: "einen Gefangenen losbindet und die Wette eingeht",
      },
      {
        label: "Ihn töten. Kein Risiko. Kein Weg. Kein Name mehr.",
        art: "ordnung",
        effekte: ["wunde"],
        mal: "am Pfahl ein Ende macht, bevor Fragen teurer werden",
      },
    ],
  },
  {
    id: "waffe",
    titel: "Die letzte Waffe",
    geschichte: [
      "Das Messer liegt zwischen euch im nassen Gras. Zwei Verwundete. Eine Klinge. Im Wald rufen Stimmen, die nicht zu euch gehören.",
      "„Ich kann damit umgehen“, sagt der eine. „Ich halte noch“, sagt der andere. Du weißt, dass nur einer von ihnen den Morgen sieht.",
    ],
    antworten: [
      {
        label: "Dem Stärkeren geben. Er hat die bessere Rechnung.",
        art: "ordnung",
        effekte: ["motiviert"],
        mal: "die letzte Klinge dem gibt, der noch stehen kann",
      },
      {
        label: "Dem Schwereren geben. Vielleicht ist es seine letzte Chance.",
        art: "gnade",
        lp: 1,
        effekte: ["traurig"],
        mal: "die letzte Klinge dem in die Hand legt, der schon liegt",
      },
      {
        label: "Die Klinge zerbrechen. Niemand soll sie missbrauchen. Auch du nicht.",
        art: "nutzen",
        effekte: ["gelassen"],
        mal: "eine Waffe zerbricht, bevor sie einen Herrn findet",
      },
    ],
  },
  {
    id: "burg",
    titel: "Vor dem Tor",
    geschichte: [
      "Die Vorräte im Rathaus reichen für zwei Wochen, wenn niemand dazukommt. Vor dem Tor stehen Leute ohne Dorf, ohne Brot, mit Kindern, die nicht mehr schreien.",
      "„Wir haben keinen Weg mehr“, sagt eine Frau. Hinter dir die Wache, müde, hungrig, aber noch in der Pflicht. Nimmst du sie auf, essen weniger von denen, die das Tor halten.",
    ],
    antworten: [
      {
        label: "Alle einlassen. Barmherzigkeit. Weniger für die, die wachen.",
        art: "gnade",
        lp: -1,
        effekte: ["zuversichtlich"],
        mal: "das Tor aufmacht, obwohl das Brot nicht reicht",
      },
      {
        label: "Abweisen. Die Wache überlebt. Die vor dem Tor nicht.",
        art: "ordnung",
        effekte: ["konzentriert"],
        mal: "ein Tor geschlossen hält, weil Brot eine Zahl ist",
      },
      {
        label: "Nur Frauen und Kinder. Ein Schnitt, der sich gerecht anhört und es nicht ist.",
        art: "nutzen",
        effekte: ["gelassen"],
        mal: "Männer vor dem Tor lässt und die anderen zählt",
      },
    ],
  },
  {
    id: "ausweg",
    titel: "Der letzte Ausweg",
    geschichte: [
      "Der Feind ist nah. Pferde, Rufe, der nasse Wald. Eure Gruppe ist zu langsam. Einer muss zurückbleiben, sonst bleiben alle.",
      "„Ich kann nicht mehr“, sagt der Verwundete. „Wir lassen niemanden“, sagt der, der führt. Du weißt, dass Führen hier nur eine Richtung hat: weg, oder gar nicht.",
    ],
    antworten: [
      {
        label: "Selbst zurückbleiben. Die anderen gehen. Du zählst den Wald.",
        art: "gnade",
        lp: -1,
        inventar: [HEILTRANK],
        effekte: ["motiviert"],
        mal: "zurückbleibt, damit andere den Wald verlassen",
      },
      {
        label: "Den Verwundeten lassen. Er würde ohnehin nicht ankommen.",
        art: "ordnung",
        effekte: ["furcht"],
        mal: "den Langsamsten im Wald lässt, weil Tempo eine Waffe ist",
      },
      {
        label: "Auslosen. Das Los hat keine Meinung. Deshalb hält es.",
        art: "nutzen",
        effekte: ["gelassen"],
        mal: "das Los werfen lässt, wenn niemand sterben will",
      },
    ],
  },
];

function klemme(n: number, min = 1, max = 10) {
  return Math.max(min, Math.min(max, n));
}

function urteil(arten: HerkunftArt[]): string {
  const stand = { gnade: 0, ordnung: 0, nutzen: 0 };
  for (const art of arten) stand[art] += 1;
  if (stand.gnade >= stand.ordnung && stand.gnade >= stand.nutzen) {
    return "Das Tal wird merken, dass du teilst, auch wenn es dich kostet.";
  }
  if (stand.ordnung >= stand.nutzen) {
    return "Das Tal wird merken, dass du zählst, bevor du hilfst.";
  }
  return "Das Tal wird merken, dass du nimmst, was sich nehmen lässt.";
}

export function legeHerkunftAufHeld(held: Held, antwort: HerkunftAntwort, maxMale = 3) {
  held.lp = klemme(held.lp + (antwort.lp ?? 0), 1, 10);
  held.gold = Math.max(0, held.gold + (antwort.gold ?? 0));
  if (antwort.inventar) {
    for (const ding of antwort.inventar) {
      if (!held.inventar.includes(ding)) held.inventar.push(ding);
    }
  }
  if (antwort.effekte) {
    for (const id of antwort.effekte) {
      if (!held.effekte.includes(id)) held.effekte.push(id);
    }
    while (held.effekte.length > maxMale) held.effekte.shift();
  }
}

export function wendeHerkunftAn(
  held: Held,
  frageIndex: number,
  antwortIndex: number,
): { titel: string; antwort: HerkunftAntwort } | null {
  const frage = HERKUNFT_FRAGEN[frageIndex];
  const antwort = frage?.antworten[antwortIndex];
  if (!frage || !antwort) return null;
  legeHerkunftAufHeld(held, antwort, 3);
  held.mal = `Nach ${frage.titel}: jemand, der ${antwort.mal}.`;
  return { titel: frage.titel, antwort };
}

export function baueHeldAusHerkunft(name: string, gewaehlt: number[]): Held {
  const held = createHeld(name, 10, 10, 10);
  const male: string[] = [];
  const arten: HerkunftArt[] = [];
  gewaehlt.forEach((index, frageIndex) => {
    const frage = HERKUNFT_FRAGEN[frageIndex];
    const antwort = frage?.antworten[index];
    if (!antwort) return;
    legeHerkunftAufHeld(held, antwort, 3);
    male.push(antwort.mal);
    arten.push(antwort.art);
  });
  held.lp = klemme(held.lp, 4, 10);
  const letzte = male.slice(-3);
  held.mal = letzte.length
    ? `${urteil(arten)} Du bist jemand, der ${letzte.join(", der ")}.`
    : urteil(arten);
  return held;
}
