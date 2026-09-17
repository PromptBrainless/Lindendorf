import { MITTEL, SCHWER, type Held } from "./types";

function line(text: string | undefined): string[] {
  return text ? [text] : [];
}

/** Wasserquest färbt die Mühle. Unabhängig spielbar, kein Schloss. */
export function echoWasserInDerMuehle(held: Held): string[] {
  if (held.loesungswegBrunnen === "bestochen") {
    return line(
      "Unten am Rad ist das Wasser klarer als der Eimer auf dem Platz. Bertok tut, als hätte er den Unterschied nicht bemerkt.",
    );
  }
  if (held.loesungswegBrunnen === "zerstoert" && held.grovinGeflohen) {
    return line("Am Ufer sind frische Schritte, die nicht zum Mühlkarren passen.");
  }
  if (held.loesungswegBrunnen) {
    return line("Das Rad schlägt gegen Wasser, das wieder nach Stein schmeckt, nicht nach Metall.");
  }
  if (held.truebungBestaetigt) {
    return line(
      "Aus dem Dorf trägt der Wind denselben metallischen Geruch wie vom Brunnen. Hier unten behauptet Bertok trotzdem, das Wasser stehe zu niedrig.",
    );
  }
  return [];
}

export function echoDruckBertok(held: Held): string[] {
  if (held.dennekEntlarvt) {
    return line(
      "Bertok hat gehört, dass der Ratsherr am Brunnen einen Namen herausgegeben hat. Er prüft das Mahlwerk noch einmal.",
    );
  }
  if (held.loesungswegBrunnen === "bestochen") {
    return line("„Manche kaufen ihr Wasser zurück“, sagt er in den Stein. „Mehl lässt sich so nicht kaufen.“");
  }
  return [];
}

/** Mühlenquest färbt den Brunnen. */
export function echoMuehleAmBrunnen(held: Held): string[] {
  if (held.loesungswegMuehle === "verraten") {
    return line("Die Wache hat heute früh an der Mühle gehalten. Dennek rührt schneller, als das Gespräch es verlangt.");
  }
  if (held.loesungswegMuehle === "kampf") {
    return line("Am Steg redet man von blutigen Nasen. Dennek hört zu, ohne den Stock stillzuhalten.");
  }
  if (held.loesungswegMuehle && !held.loesungswegBrunnen) {
    return line("Seit dem Morgen riecht es wieder nach Mehl. Der Eimer bleibt trotzdem trüb.");
  }
  if (held.loesungswegMuehle && held.loesungswegBrunnen) {
    return line("Seit dem Morgen riecht es nach Mehl. Der Eimer ist klarer. Dennek tut, als gehöre beides zum Wetter.");
  }
  if (held.muehleBesucht) {
    return line("Bertoks Rad dreht sich weiter, ohne zu mahlen. Der Eimer hier tut dasselbe mit Wasser.");
  }
  return [];
}

export function echoDruckDennek(held: Held): string[] {
  if (held.loesungswegMuehle === "verraten") {
    return line("Er weiß, dass du Namen ins Rathaus trägst. Höflichkeit ist das nicht. Vorsicht.");
  }
  if (held.bertokBedraengt) {
    return line("Dennek hat gehört, wie du in der Mühle Druck gemacht hast. Die Finger trommeln kürzer.");
  }
  return [];
}

export function echoGrovinKenntMuehle(held: Held): string[] {
  if (held.loesungswegMuehle === "verraten") {
    return line("„Die Wache holt Familien, wenn jemand redet. Deshalb steht das Wasser hier und nicht im Dorf.“");
  }
  if (held.loesungswegMuehle === "kampf") {
    return line("„Am Steg hat jemand mit den Händen bezahlt. Ich zahle mit Wasser. Beides ist eine Rechnung.“");
  }
  return [];
}

export function echoHolmVersorgung(held: Held): string[] {
  if (held.loesungswegMuehle && held.loesungswegBrunnen) {
    if (held.loesungswegMuehle === "verraten" || held.loesungswegBrunnen === "bestochen") {
      return line("„Mehl und Wasser laufen wieder. Nicht für denselben Preis, und nicht für dieselben Leute.“");
    }
    return line("„Mehl und Wasser. Dasselbe Muster, zwei Türen. Das Tal hat nicht zwei Diebe. Es hat eine Rechnung.“");
  }
  if (held.truebungBestaetigt && held.muehleBesucht && !held.loesungswegMuehle && !held.loesungswegBrunnen) {
    return line(
      "„Die Mühle mahlt nichts. Der Brunnen macht krank. Wer beides gleichzeitig erklärt, lügt wenigstens in dieselbe Richtung.“",
    );
  }
  return [];
}

export function echoMaraVersorgung(held: Held): string[] {
  if (held.loesungswegMuehle && held.loesungswegBrunnen === "bestochen") {
    return line("Das Brot ist da. Das Wasser in den Bechern reicht nicht für den letzten Tisch.");
  }
  if (held.loesungswegMuehle && held.loesungswegBrunnen) {
    return line("Brot und Wasser stehen wieder auf der Theke. Mara stellt beides hin, als wäre das Wetter umgeschlagen.");
  }
  if (!held.loesungswegMuehle && held.loesungswegBrunnen) {
    return line("Die Becher sind klarer. Das Brotfach bleibt leer.");
  }
  return [];
}

export function echoPlatzVersorgung(held: Held): string[] {
  if (held.loesungswegMuehle && held.loesungswegBrunnen) {
    return line("Mehl und Wasser laufen wieder. Der Platz tut, als wäre das Wetter umgeschlagen.");
  }
  const millKnown = held.muehleBesucht || Boolean(held.loesungswegMuehle);
  const waterKnown = held.truebungBestaetigt || Boolean(held.loesungswegBrunnen);
  if (millKnown && waterKnown && !held.loesungswegMuehle && !held.loesungswegBrunnen) {
    return line("Zwei leere Dinge auf einem Platz: ein Mehlsack und ein Eimer. Niemand stellt sie nebeneinander.");
  }
  return [];
}

export function echoEpilogVersorgung(held: Held): string[] {
  if (!held.loesungswegMuehle || !held.loesungswegBrunnen) return [];
  if (held.loesungswegMuehle === "verraten" && held.loesungswegBrunnen === "bestochen") {
    return line("Mehl mit Schutzbrief, Wasser mit einem zweiten Eimer. Das Tal isst und trinkt. Es zählt anders.");
  }
  return line("Mehl und Wasser laufen wieder. Wer beides genommen hat, sitzt nicht im Steinbruch.");
}

export function dennekCharismaSchwer(held: Held): number {
  if (held.loesungswegMuehle === "verraten" || held.buergermeisterVertraut || held.truebungBestaetigt) return MITTEL;
  return SCHWER;
}
