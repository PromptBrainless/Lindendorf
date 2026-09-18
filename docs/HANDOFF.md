# Übergabe — 18. September 2026

Frisch starten: zuerst `.grok/skills/lindendorf-questreihe/SKILL.md`, dann
dieses Blatt, dann `docs/QUESTREGISTER.md`. Code gewinnt bei Streit.

## Was im Spiel liegt

Drei Nebenquests, Hauptfluss unberührt.

| Quest | Einstieg | Modul | Status |
|---|---|---|---|
| Die Schuld der Mühle | `Zur Mühle gehen` | `quest-muehle.ts` | Goldstandard |
| Das trübe Wasser | `Den trüben Eimer prüfen` | `quest-brunnen.ts` | spielbar, Prosa nachgezogen |
| Das Kesseljahr | `Zur Gerbereigasse gehen` | `quest-kesseljahr.ts` | spielbar, Gasse ausformuliert (Grete/Vahl/Gewölbe/Nachspiele) |

Echo ohne Schloss: `src/game/reihe-versorgung.ts` (Mühle ↔ Brunnen, Gasse färbt beide, Holm/Mara/Wald/Epilog).

Gasse: Fenn (Kirche, nicht Brunnenbettler), Vahl, Grete, Ilse Brandtner (tot, Liste).
Vier Enden: `veroeffentlicht` / `weitergegeben` / `erpresst` / `vernichtet`. Kein Tod.

## Stimme (verbindlich)

Deutsch. Du. Präsens. Schön, hart, düster.

Vorbild: `quest-muehle.ts` und Fenns Kesseljahr-Rede in `quest-kesseljahr.ts`.

Nicht: Telegramm (ein Fakt pro Satz). Nicht: Barock (gestapelte als-wäre-Rätsel).
Nicht: Wasser, das „will“, Häuser, die sich „ducken“.
Ja: Lohe, Wachs, Fieber, Bretter, Siegelring, nackte Füße, Eisen, Eimer.

## OpenCode (zweiter Blick, nicht Autopilot)

```bash
opencode run --auto --model xai/grok-4.20-0309-non-reasoning --dir /workspace \
  --title "Quest-Prosa" "Nur deutsche lines/Dialoge in DATEI. Keine Logik. Stimme wie quest-muehle.ts."
```

Danach immer: Diff lesen, weiche Zeilen verwerfen, dann

```bash
npm run typecheck && npm run check:knowledge && npm run check:questreihe
```

OpenCode darf vorschlagen. Der Agent entscheidet, was ins Spiel kommt.

## Nächster sinnvoller Schritt

Nicht neu verdrahten. Entweder:

1. Glockenweg/Wald — kürzester Hauptast, Gewichtsfrage aus der QM.
2. Dritte Versorgungsquest: anderer Randort als Steg und Zisterne.
3. Zweite Erinnerungsquest der Reihe „Erinnerung des Tals“ — Namen erst nach Kollisionscheck.

Nicht ohne Auftrag: Engine, Auth, Haupt-Endtitel, neue ArtKeys.
