import type { MongoHelper } from "@/types/MongoSchemas";

/**
 * Pistas de UI derivadas de los validators del schema.
 * Para soportar un validator nuevo alcanza con agregar una entrada al registro.
 */
export type OptionHint = {
  id: string;
  /** Texto cuando el valor está en el estado normal. */
  label: string;
  /** Texto cuando el valor está en el estado especial. */
  activeLabel: string;
  tooltip: string;
  /** Detecta si el valor actual está en el estado especial. */
  isActive: (value: unknown) => boolean;
};

const isUnlimited = (value: unknown): boolean =>
  value === 0 ||
  value === "0" ||
  value === null ||
  value === undefined ||
  value === Number.POSITIVE_INFINITY;

const hintsByValidator: Record<string, OptionHint> = {
  integerOrInfinity: {
    id: "integerOrInfinity",
    label: "0 = sin límite",
    activeLabel: "∞ Sin límite",
    tooltip:
      "Este ajuste admite valores ilimitados. Escribe 0 para guardar Infinity (sin límite).",
    isActive: isUnlimited,
  },
};

/** Mensajes históricos, para schemas que todavía no exponen `validator.id`. */
const legacyValidatorIds: Record<string, string> = {
  "Tiene que ser un entero o Infinity": "integerOrInfinity",
};

function validatorIds(helper: MongoHelper): string[] {
  return (helper.mongoInfo?.validators ?? [])
    .map((validator) =>
      typeof validator?.id === "string"
        ? validator.id
        : legacyValidatorIds[validator?.message ?? ""]
    )
    .filter((id): id is string => Boolean(id));
}

export function optionHintFor(helper?: MongoHelper): OptionHint | undefined {
  if (!helper) return undefined;

  for (const id of validatorIds(helper)) {
    const hint = hintsByValidator[id];
    if (hint) return hint;
  }

  return undefined;
}

export type OptionConstraints = {
  min?: number;
  step?: number;
};

/** Restricciones del input derivadas de los validators del schema. */
export function optionConstraintsFor(helper?: MongoHelper): OptionConstraints {
  const ids = helper ? validatorIds(helper) : [];

  const min = ids.includes("integerOrInfinity")
    ? 0 // 0 significa "sin límite" y se normaliza a Infinity en el backend.
    : ids.includes("positive")
      ? 1
      : ids.includes("positiveWithZero")
        ? 0
        : undefined;

  return {
    ...(min !== undefined ? { min } : {}),
    ...(ids.some((id) => id === "integer" || id === "integerOrInfinity") ? { step: 1 } : {}),
  };
}
