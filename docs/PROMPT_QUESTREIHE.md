# Prompt: Qualitativ hohe Questreihe in Lindendorf

Diesen Block an Grok geben (Chat oder Automation). Platzhalter in
`{{doppelten Klammern}}` ersetzen. Den Rest nicht kürzen.

---

## Auftrag

Du arbeitest im **Lindendorf**-Projekt (illustriertes deutsches Textabenteuer).
Technische Reihenfolge des Ausbaus: `docs/ERNEUERUNGSPLAN.md`.
Während Block A (Schema+Log) und während der Lager-Extraktion **keine** neue Quest.

Deine Aufgabe: eine **qualitativ hohe Nebenquest-Reihe** im bestehenden System
planen und — nur nach Steckbrief und Kollisionscheck — **eine Quest pro Block**
spielbar einbauen.

Lade zuerst das Skill **`lindendorf-questreihe`**:

- `.grok/skills/lindendorf-questreihe/SKILL.md`
- danach dessen `references/` in der dort genannten Reihenfolge

Goldstandard-Code: `src/game/quest-muehle.ts`, `src/game/quest-brunnen.ts`, `src/game/quest-kesseljahr.ts`.
Goldstandard-Spec: `attachments/quest-die-schuld-der-muehle.md`,
`attachments/quest-das-truebe-wasser.md`.
Stimme: `attachments/how_to_be_a_hero_v01.py`.
Register: `docs/QUESTREGISTER.md` (vor Namenswahl lesen, nach der Quest schreiben).

## Diesmal

- **Thema / gemeinsame Schuld:** {{z. B. Das Tal verliert, was es zum Leben braucht}}
- **Umfang:** {{3}} Quests in der Reihe, diesmal nur Quest {{1}} ausliefern
- **Arbeitstitel dieser Quest:** {{…}}
- **Einstieg:** {{neuer Dorf-Label / unter bestehendem Ort}}
- **Randort (höchstens einer, nicht Steg, nicht Zisterne, nicht Steinbruch):** {{…}}
- **Bilder:** vorhandene ArtKeys wiederverwenden, keine neuen Assets ohne Bildplan
- **Nicht anfassen:** Hauptfluss, Engine, Runtime, Auth, UI-Chrome, Haupt-Endtitel

Falls ein Feld leer ist: **nicht raten**. Erst den Reihe-Steckbrief vorschlagen
und auf Freigabe der Namen warten. Dann Spec. Dann Code.

## Automatismus — sieben Phasen, keine überspringen

0. **Kanon.** `references/kanon.md` + `docs/QUESTREGISTER.md` + `src/game/types.ts`.
   Kollisionsliste: Namen, Flags, Labels, Bilder.
1. **Reihe.** `references/reihe.md` — gemeinsame Schuld, 3–5 Karten, Unabhängigkeit,
   Echo ohne Schloss. Datei: `docs/quests/reihe-<slug>.md`.
2. **Steckbrief dieser Quest.** `references/steckbrief.md`.
   Datei: `docs/quests/<slug>.md`. Figuren-, Flag-, Wissens-, Konsequenzmatrix.
   Vier Ausgänge (Stärke, Geschick, Charisma + teurer vierter).
3. **Kollision.** Spec-Namen gegen Sanna/Kern/Lene halten. Lehre: Spec „Senna“
   und „Mirl“ wurden zu Lene und Kern, weil die Namen schon vergeben waren.
4. **Modul.** `src/game/quest-<slug>.ts` im Mühle-Muster.
   Hub über `{id,label}[]`. `vielleichtHeiltrank` aus `./heal`.
5. **Draht.** `references/wiring.md`.
   `types.ts` + `createHeld`, `knowledge.ts`, Label-Dispatch in `script.ts`
   (nie Index), Wald, Epilog pro Lösungsweg, `todesort` falls tödlich,
   `scripts/check-knowledge-gates.mjs`.
6. **Qualität.** `references/qualitaet.md`.
   `npm run typecheck && npm run check:knowledge && npm run check:questreihe`
   und ein Erfolg- plus ein Misserfolg-Pfad. Register aktualisieren.

## Harte Regeln

- Deutsch, Du, Präsens, `„…“`. Kein Emoji, kein Pathos, kein Schicksal.
- W10 + Attribut ≥ 8/12/15. Inventar nur Heiltrank, Schlüssel, Gold.
- Option erst nach erworbenem Wissen; Label darf nach Wissen schärfer werden.
- Flag nur, wenn es eine Entscheidung speichert und **mindestens zweimal** gelesen wird.
- Misserfolg verändert den Weg. Tod nur aus erkennbarem Risiko.
- `held` mutieren, dann `present`. Nach Schaden `tot` prüfen.
- Dorf-Hub nach **Label-String** dispatchen.
- Hauptfluss bleibt: Heldenerstellung → Dorf → Glockenweg/Wald → Lager → Ende.
- Eine Quest darf den Wald nicht ersetzen und den Auftrag nicht erzwingen.

## Fertig, wenn

Der Spieler die Quest im Dorf findet, drei Stationen mehrfach besuchen kann,
auf drei Arten löst (plus einem teuren vierten Weg), und Holm, Mara oder der
Wald sich später daran erinnern — ohne dass der Banditenplot bricht.

Antworte dem Nutzer in Produktform: wo die Quest liegt, was sie kostet, welcher
Ausgang wen verändert. Keine interne Werkzeugliste als Erfolgsmeldung.
