import { z } from "zod";

const AttributeSchema = z.enum(["Stärke", "Geschicklichkeit", "Charisma"]);
const RouteSchema = z.enum(["kampf", "schleich", "ueberreden"]);

export const IntroArtifactContentSchema = z.object({
  id: z.literal("intro-fremder-am-weg"),
  title: z.string().min(1),
  art: z.literal("stranger"),
  lines: z.array(z.string().min(1)).min(3),
  choices: z.array(
    z.object({
      label: z.string().min(1),
      attribute: AttributeSchema.optional(),
      difficulty: z.number().int().positive().optional(),
      route: RouteSchema.optional(),
    }),
  ).length(4),
  successLines: z.array(z.string().min(1)).length(3),
  failureLines: z.array(z.string().min(1)).min(2),
  passLines: z.array(z.string().min(1)).min(2),
});

export const INTRO_ARTIFACT_CONTENT = IntroArtifactContentSchema.parse({
  id: "intro-fremder-am-weg",
  title: "Der Fremde am Weg",
  art: "stranger",
  lines: [
    "Ein schwächlicher Mann kommt dir entgegen. Sein Gang ist unsicher, als würde ihn jeder Schritt überraschen. Der Regen hat sein Haar an die Stirn geklebt, und an seinem linken Ärmel ist dunkles Blut getrocknet.",
    "Unter seinem Mantel blitzt ein silbernes Artefakt hervor. Es trägt das Zeichen der Kirche — ein Auge über drei eingeritzten Linien — und gehört ganz sicher nicht ihm.",
    "Du hast dieses Zeichen schon einmal gesehen, auf einem verwitterten Stein am Nordpass. Damals lag Schnee darauf. Heute liegt nur Schlamm auf allem.",
    "Der Mann hat dich noch nicht bemerkt. Hinter ihm führt der Weg zurück in den Nebel, vor ihm fällt er nach Lindendorf ab. Du kannst weitergehen und so tun, als hättest du nichts gesehen. Oder du kannst dich einmischen.",
  ],
  choices: [
    { label: "Das Artefakt gewaltsam nehmen (Stärke, mittel)", attribute: "Stärke", difficulty: 12, route: "kampf" },
    { label: "Es unbemerkt stehlen (Geschick, schwer)", attribute: "Geschicklichkeit", difficulty: 15, route: "schleich" },
    { label: "Ihn überzeugen, es herauszugeben (Charisma, mittel)", attribute: "Charisma", difficulty: 12, route: "ueberreden" },
    { label: "Vorübergehen" },
  ],
  successLines: [
    "Du packst den Mann am Mantel und entreißt ihm das Artefakt. Der Stoff reißt mit einem trockenen Laut. Er stolpert zurück, greift nach dem leeren Riemen und verschwindet schließlich im Nebel.",
    "Deine Finger lösen den Riemen, ohne dass der Mann den Verlust bemerkt. Erst im Nebel tastet er vergeblich nach dem Silber. Sein Fluchen wird leiser, bis der Regen es nimmt.",
    "Du sprichst ruhig auf ihn ein. Der Mann senkt den Blick und legt dir das Artefakt in die Hand. Seine Finger bleiben einen Augenblick länger darauf liegen, als würde er sich von etwas verabschieden.",
  ],
  failureLines: [
    "Der Mann bemerkt deine Absicht. Für einen Augenblick wirkt er schwach — dann ist er schneller, als du erwartet hast. Etwas Hartes schlägt gegen deine Hand, und der Schmerz bleibt, obwohl der Mann schon zurückweicht.",
    "Er verschwindet mit dem silbernen Artefakt im Nebel. Deine erste Probe ist gescheitert, aber der Weg bleibt offen. Nur das Zeichen bleibt dir im Kopf, heller als es im grauen Licht gewesen sein dürfte.",
  ],
  passLines: [
    "Du lässt den Mann passieren. Das Silber verschwindet unter seinem Mantel, bevor der Nebel ihn schluckt. Für einen Moment dreht er den Kopf, als hätte er deine Entscheidung trotzdem gehört.",
    "Du hast nichts gewonnen. Aber du hast dich entschieden, nicht jede fremde Not zu deinem Vorteil zu machen. Später wirst du nicht wissen, ob das ein Maßstab oder nur Bequemlichkeit war.",
  ],
});
