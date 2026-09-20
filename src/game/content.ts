import { z } from "zod";
import { exportiereModul } from "./export-modul";

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
    "Etwa fünfzig Schritt voraus taucht eine Gestalt aus dem Regen auf.",
    "Ein Mann. Mager genug, dass der Wind an ihm zerren kann.",
    "Sein Gang ist ungleichmäßig. Nicht das Hinken eines Verletzten. Eher das Stolpern eines Menschen, der zu lange wach geblieben ist oder zu viel Blut verloren hat. Jeder Schritt wirkt, als müsse er sich erst daran erinnern, wie Gehen funktioniert.",
    "Nasses Haar klebt an seiner Stirn. Der linke Ärmel seines Mantels ist dunkel verfärbt. Das Blut darauf ist bereits getrocknet.",
    "Als er kurz ins Straucheln gerät, schlägt der Mantel auseinander.",
    "Etwas Silbernes blitzt darunter hervor.",
    "Ein Artefakt.",
    "Nicht groß. Vielleicht handtellergroß. Doch selbst auf diese Entfernung erkennst du das Zeichen: ein offenes Auge über drei eingeritzten Linien.",
    "\"Kirchensilber\"",
    "Du hast das Symbol schon einmal gesehen.",
    "Am Nordpass. Vor Jahren. Es war in einen Grenzstein geschlagen worden, halb verborgen unter Eis und Schnee. Die Händler hatten damals darüber gespuckt und sich bekreuzigt. Niemand erklärte warum.",
    "Heute gibt es keinen Schnee.",
    "Nur Regen, Schlamm und einen Fremden, der etwas bei sich trägt, das kaum ihm gehören dürfte.",
    "Der Mann hat dich noch nicht bemerkt.",
    "Hinter ihm verschluckt Nebel den Weg.",
    "Vor ihm liegt Lindendorf.",
    "Zwischen euch stehen nur einige Schritte, schlechtes Wetter und die Frage, wem das Blut auf seinem Ärmel gehört.",
  ],
  choices: [
    { label: "(Stärke – mittel) Der Mann wirkt geschwächt. Falls er Widerstand leistet, dürfte der Kampf kurz sein. Dennoch tragen auch Sterbende Messer.", attribute: "Stärke", difficulty: 12, route: "kampf" },
    { label: "(Geschick – schwer) Der Regen dämpft Geräusche. Der Nebel verbirgt Bewegungen. Doch Kirchenartefakte werden selten achtlos getragen.", attribute: "Geschicklichkeit", difficulty: 15, route: "schleich" },
    { label: "(Charisma – mittel) Vielleicht ist er verängstigt. Vielleicht verletzt. Vielleicht sucht er Hilfe mehr als Streit.", attribute: "Charisma", difficulty: 12, route: "ueberreden" },
    { label: "Vorübergehen - Manche Dinge bringen Unglück, lange bevor man sie berührt." },
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

export function exportiereIntro() {
  return exportiereModul("intro-fremder.json", IntroArtifactContentSchema, INTRO_ARTIFACT_CONTENT);
}
