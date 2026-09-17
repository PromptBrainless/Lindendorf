import { z } from "zod";

const AttributeSchema = z.enum(["Stärke", "Geschicklichkeit", "Charisma"]);
const RouteSchema = z.enum(["kampf", "schleich", "ueberreden"]);

export const IntroArtifactContentSchema = z.object({
  id: z.literal("intro-fremder-am-weg"),
  title: z.string().min(1),
  art: z.literal("road"),
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
  art: "road",
  lines: [
    "Ein schwächlicher Mann kommt dir entgegen. Sein Gang ist unsicher, als würde ihn jeder Schritt überraschen.",
    "Unter seinem Mantel blitzt ein silbernes Artefakt hervor. Es trägt das Zeichen der Kirche — und gehört ganz sicher nicht ihm.",
    "Er hat dich noch nicht bemerkt. Du musst entscheiden, was für ein Held du sein willst.",
  ],
  choices: [
    { label: "Das Artefakt gewaltsam nehmen (Stärke, mittel)", attribute: "Stärke", difficulty: 12, route: "kampf" },
    { label: "Es unbemerkt stehlen (Geschick, schwer)", attribute: "Geschicklichkeit", difficulty: 15, route: "schleich" },
    { label: "Ihn überzeugen, es herauszugeben (Charisma, mittel)", attribute: "Charisma", difficulty: 12, route: "ueberreden" },
    { label: "Vorübergehen" },
  ],
  successLines: [
    "Du packst den Mann am Mantel und entreißt ihm das Artefakt. Er stolpert zurück und verschwindet im Nebel.",
    "Deine Finger lösen den Riemen, ohne dass der Mann den Verlust bemerkt. Erst im Nebel tastet er vergeblich nach dem Silber.",
    "Du sprichst ruhig auf ihn ein. Der Mann senkt den Blick und legt dir das Artefakt in die Hand.",
  ],
  failureLines: [
    "Der Mann bemerkt deine Absicht. Für einen Augenblick wirkt er schwach — dann ist er schneller, als du erwartet hast.",
    "Er verschwindet mit dem silbernen Artefakt im Nebel. Deine erste Probe ist gescheitert, aber der Weg bleibt offen.",
  ],
  passLines: [
    "Du lässt den Mann passieren. Das Silber verschwindet unter seinem Mantel, bevor der Nebel ihn schluckt.",
    "Du hast nichts gewonnen. Aber du hast dich entschieden, nicht jede fremde Not zu deinem Vorteil zu machen.",
  ],
});
