export function findDeadNodes(alleSzenenIds: Set<string>, referenzierteIds: Set<string>): string[] {
  return [...alleSzenenIds].filter((id) => !referenzierteIds.has(id));
}

export const LAGER_SZENEN = {
  alle: new Set([
    "lager-hub",
    "lager-schleich",
    "lager-reden",
    "lager-kampf",
    "lager-seitentor",
    "lager-nachspiel",
    "lager-drohen",
    "lager-handel",
    "lager-luege",
    "lager-flucht",
    "lager-zelte",
  ]),
  referenziert: new Set([
    "lager-hub",
    "lager-schleich",
    "lager-reden",
    "lager-kampf",
    "lager-seitentor",
    "lager-nachspiel",
    "lager-drohen",
    "lager-handel",
    "lager-luege",
    "lager-flucht",
    "lager-zelte",
  ]),
};

export function lagerToteKnoten(): string[] {
  return findDeadNodes(LAGER_SZENEN.alle, LAGER_SZENEN.referenziert);
}
