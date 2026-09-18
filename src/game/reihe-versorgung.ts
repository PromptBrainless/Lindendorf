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

export function echoGasseInDerMuehle(held: Held): string[] {
  if (held.loesungswegGasse === "veroeffentlicht") {
    return line(
      "Bertok hat gehört, dass Vahls Großvater zuerst gezeichnet hat. Er sieht das Rad an, als stünde es auf fremdem Grund.",
    );
  }
  if (held.loesungswegGasse === "vernichtet") {
    return line("Vom Dorf her hämmert jemand an der Gerberei. Das Holz ist neu. Der Grund unter Bertoks Stein nicht.");
  }
  if (held.gasseGeschichteGehoert && !held.loesungswegGasse) {
    return line(
      "Fenn hat vom Kesseljahr erzählt. Die Mühle steht auf Land, das damals aufgeteilt wurde. Bertok mahlt, als gehörte der Grund ihm.",
    );
  }
  return [];
}

export function echoDruckBertok(held: Held): string[] {
  if (held.leneBedraengt) {
    return line("Bertok hat Lenes Stimme aus der Kammer gehört. Seither justiert er den Stein, der schon justiert ist.");
  }
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

export function echoGasseAmBrunnen(held: Held): string[] {
  if (held.loesungswegGasse === "veroeffentlicht") {
    return line("Dennek hat gehört, dass Vahl seinen Sitz verloren hat. Der Stock rührt langsamer, als gehöre der Rat nicht mehr ihm.");
  }
  if (held.loesungswegGasse === "erpresst" && held.vahlKonfrontiert) {
    return line("Dennek trommelt noch. Vahl nicht mehr. Zwei Ratsherren, und nur einer rührt im Eimer.");
  }
  if (held.gasseGeschichteGehoert && !held.loesungswegBrunnen) {
    return line("Im Kesseljahr hat man die Gasse abgeriegelt, damit das Fieber nicht den Platz holt. Der Eimer hier holt es trotzdem.");
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
  const bits: string[] = [];
  if (held.loesungswegMuehle && held.loesungswegBrunnen) {
    if (held.loesungswegMuehle === "verraten" && held.loesungswegBrunnen === "bestochen") {
      bits.push("Mehl mit Schutzbrief, Wasser mit einem zweiten Eimer. Das Tal isst und trinkt. Es zählt anders.");
    } else {
      bits.push("Mehl und Wasser laufen wieder. Wer beides genommen hat, sitzt nicht im Steinbruch.");
    }
  }
  if (held.loesungswegGasse && (held.loesungswegMuehle || held.loesungswegBrunnen)) {
    bits.push("Die Gasse bleibt eine leere Stelle neben Mehl und Wasser. Das Tal füllt nicht jede auf dieselbe Weise.");
  }
  return bits;
}

export function dennekCharismaSchwer(held: Held): number {
  if (held.loesungswegMuehle === "verraten" || held.buergermeisterVertraut || held.truebungBestaetigt) return MITTEL;
  return SCHWER;
}
