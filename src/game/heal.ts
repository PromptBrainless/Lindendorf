import { canOfferHeal, heilen } from "./engine";
import type { Runtime } from "./runtime";
import { HEILTRANK, MAX_LP, type Held } from "./types";

export async function vielleichtHeiltrank(rt: Runtime, held: Held) {
  if (!canOfferHeal(held)) return;
  const wahl = await rt.present({
    held,
    lines: [`Du hast einen ${HEILTRANK} und ${held.lp}/${MAX_LP} LP.`],
    choices: [`${HEILTRANK} trinken`, "Aufheben für später"],
  });
  if (wahl === 0) {
    held.inventar = held.inventar.filter((item) => item !== HEILTRANK);
    const text = heilen(held, 6);
    await rt.present({
      held,
      lines: [text, "Die bittere Flüssigkeit wärmt dich von innen."],
    });
  }
}
