import type { MongoHelper } from "@/types/MongoSchemas";

/** Alias de los tipos que puede traer el schema a los tipos lógicos de opción. */
const typeAliases: Record<string, string> = {
  bool: "boolean",
  boolean: "boolean",
  str: "text",
  string: "text",
  text: "text",
  int: "number",
  integer: "number",
  num: "number",
  number: "number",
  float: "number",
  double: "number",
  decimal: "number",
};

function normalize(raw: unknown): string {
  if (typeof raw === "string") return raw.trim().toLowerCase();

  // Los schemas pueden exponer el constructor (Boolean, String, Number...) en vez del nombre.
  if (typeof raw === "function") return (raw.name || "").toLowerCase();

  // También aparecen arrays ([String]) u objetos ({ type: String, enum: [...] }).
  if (Array.isArray(raw)) return raw.length > 0 ? normalize(raw[0]) : "";
  if (raw && typeof raw === "object" && "type" in raw) {
    return normalize((raw as { type: unknown }).type);
  }

  return "";
}

function typeFromDefaultValue(value: unknown): string {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (typeof value === "string") return "text";
  return "";
}

/**
 * Tipo lógico de un setting. Prioridad:
 * `dashboardInfo.optionType` > `mongoInfo.type` > tipo del valor por defecto.
 *
 * Un tipo desconocido se devuelve normalizado para que el registro decida qué hacer
 * con él, sin necesidad de tocar SettingsSection.
 */
export function optionTypeOf(helper: MongoHelper): string {
  const raw =
    normalize(helper.dashboardInfo?.optionType) ||
    normalize(helper.mongoInfo?.type) ||
    typeFromDefaultValue(helper.mongoInfo?.defaultValue);

  return typeAliases[raw] ?? raw;
}
