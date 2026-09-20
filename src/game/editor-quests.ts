import { cloneHeld, createHeld, type Held } from "./types";
import { deriveKnowledge, knowledgeLabels } from "./knowledge";
import { synchronisiereLog } from "./taten";

export type QuestPfad = {
  id: string;
  titel: string;
  reihe: string;
  anwenden: (held: Held) => void;
};

export const QUEST_PFADE: QuestPfad[] = [
  {
    id: "muehle-schleich",
    titel: "Mühle — schleichen",
    reihe: "Versorgung",
    anwenden: (h) => {
      h.muehleBesucht = true;
      h.spurenGefunden = true;
      h.loesungswegMuehle = "schleich";
    },
  },
  {
    id: "muehle-kampf",
    titel: "Mühle — Kampf",
    reihe: "Versorgung",
    anwenden: (h) => {
      h.muehleBesucht = true;
      h.loesungswegMuehle = "kampf";
    },
  },
  {
    id: "muehle-verraten",
    titel: "Mühle — verraten",
    reihe: "Versorgung",
    anwenden: (h) => {
      h.muehleBesucht = true;
      h.fluechtlingeEntdeckt = true;
      h.loesungswegMuehle = "verraten";
    },
  },
  {
    id: "brunnen-geoeffnet",
    titel: "Brunnen — geöffnet",
    reihe: "Versorgung",
    anwenden: (h) => {
      h.truebungBestaetigt = true;
      h.grovinGenannt = true;
      h.loesungswegBrunnen = "geoeffnet";
    },
  },
  {
    id: "brunnen-bestochen",
    titel: "Brunnen — bestochen",
    reihe: "Versorgung",
    anwenden: (h) => {
      h.truebungBestaetigt = true;
      h.dennekEntlarvt = true;
      h.loesungswegBrunnen = "bestochen";
    },
  },
  {
    id: "gasse-liste",
    titel: "Gasse — veröffentlicht",
    reihe: "Erinnerung",
    anwenden: (h) => {
      h.gasseBesucht = true;
      h.gasseGeschichteGehoert = true;
      h.ilsesAufzeichnungenGefunden = true;
      h.loesungswegGasse = "veroeffentlicht";
    },
  },
  {
    id: "gasse-asche",
    titel: "Gasse — vernichtet",
    reihe: "Erinnerung",
    anwenden: (h) => {
      h.gasseBesucht = true;
      h.loesungswegGasse = "vernichtet";
    },
  },
  {
    id: "lager-schleich",
    titel: "Lager — schleichen",
    reihe: "Hauptfluss",
    anwenden: (h) => {
      h.lagerGeloest = true;
      h.loesungsweg = "schleich";
      h.beuteGerettet = true;
    },
  },
  {
    id: "lager-reden",
    titel: "Lager — überreden",
    reihe: "Hauptfluss",
    anwenden: (h) => {
      h.lagerGeloest = true;
      h.loesungsweg = "ueberreden";
      h.beuteGerettet = true;
      h.buergermeisterVertraut = true;
    },
  },
  {
    id: "lager-kampf",
    titel: "Lager — Kampf",
    reihe: "Hauptfluss",
    anwenden: (h) => {
      h.lagerGeloest = true;
      h.loesungsweg = "kampf";
      h.beuteGerettet = true;
      h.verwundet = true;
    },
  },
  {
    id: "lager-tor",
    titel: "Lager — Seitentor",
    reihe: "Hauptfluss",
    anwenden: (h) => {
      h.lagerGeloest = true;
      h.loesungsweg = "seitentor";
      h.beuteGerettet = true;
    },
  },
];

export function probePfad(id: string): { held: Held; sicher: string[]; offen: string[]; wissen: string[] } {
  const pfad = QUEST_PFADE.find((item) => item.id === id);
  const held = createHeld("Probe", 10, 10, 10);
  held.holmBesucht = true;
  held.auftragErhalten = true;
  pfad?.anwenden(held);
  synchronisiereLog(held, `editor:${id}`);
  const labels = knowledgeLabels(held);
  return {
    held: cloneHeld(held),
    sicher: labels.sicher,
    offen: labels.offen,
    wissen: [...deriveKnowledge(held)],
  };
}
