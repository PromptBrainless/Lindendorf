# Projektkontext — How to be a Hero: Lindendorf

**Snapshot:** 18. September 2026, 00:30 Uhr
**Status:** Versorgungsreihe (Mühle + Brunnen) spielt zusammen; Questreihen-Skill und Echo-Schnittstelle sitzen. Preview läuft.

## Verbindliche Richtung

Lindendorf bleibt ein ausführlich erzähltes, düsteres Dark-Fantasy-Mittelalterabenteuer.

> Heldenerstellung → Dorf-Schleife → Glockenweg/Wald → Banditenlager → Ende

Regeln unverändert: ST/GE/CH, W10, 10 LP, Heiltrank, Schlüssel, Gold.

## Erzählstand

Hauptplot und Bildrunde wie zuvor. Zwei Nebenquests der Versorgungsreihe sind spielbar und **echoen einander** (Methode und Ausgang), ohne sich zu sperren.

- Mühle: Dorf → *Zur Mühle gehen*
- Wasser: Brunnen und Dorfplatz → *Den trüben Eimer prüfen*
- Schnittstelle: `src/game/reihe-versorgung.ts`
- Journal-Faden: `versorgung_muster`

## Autorensystem

Skill `.grok/skills/lindendorf-questreihe/`, Prompt `docs/PROMPT_QUESTREIHE.md`, Register `docs/QUESTREGISTER.md`, Prüfer `npm run check:questreihe`.

## Nächster sicherer Schritt

Keine dritte Quest, bevor die Echo-Pfade (Mühle→Brunnen und umgekehrt, Verrat/Bestechung) einmal von Hand gespielt sind. Dritte Lücke erst, wenn ein Mangel feststeht, der nicht Mehl, Wasser, Salz oder Kirchensilber ist.

## Git

Arbeitsbaum enthält uncommittete Questmodule plus Echo. Zielrepo laut Übergabe: `PromptBrainless/Lindendorf`. Local `origin` zeigte zeitweise auf `PromptBrainless/Dice` — vor dem Push prüfen.
