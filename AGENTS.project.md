# Lindendorf — Projekthinweise

Nebenquests und Questreihen: zuerst
`.grok/skills/lindendorf-questreihe/SKILL.md` laden und die sieben Phasen
dort abarbeiten. Nutzer-Prompt: `docs/PROMPT_QUESTREIHE.md`.
Belegte Namen/Flags/Labels: `docs/QUESTREGISTER.md`.
Letzter Stand: `docs/HANDOFF.md`.

Spielertext nachziehen: OpenCode kopflos, Modell `xai/grok-4.20-0309-non-reasoning`,
nur `lines` und Dialoge, danach Diff + `npm run typecheck && npm run check:knowledge && npm run check:questreihe`.
Stimme: schön, hart, düster. Vorbild `quest-muehle.ts`. Kein Telegramm, kein Barock.

Nicht ohne Auftrag: Engine, Runtime, Auth, Datenbank, Haupt-Endtitel,
Grundfluss Heldenerstellung → Dorf → Glockenweg/Wald → Lager → Ende.
