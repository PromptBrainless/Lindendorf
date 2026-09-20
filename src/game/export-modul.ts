import type { ZodTypeAny } from "zod";

export function exportiereModul(
  dateiname: string,
  schema: ZodTypeAny,
  daten: unknown,
): { dateiname: string; inhalt: string } {
  schema.parse(daten);
  return { dateiname, inhalt: JSON.stringify(daten, null, 2) };
}
