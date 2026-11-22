import BooleanOption from "@/components/dashboard/options/BooleanOption.vue";
import NumberOption from "@/components/dashboard/options/NumberOption.vue";
import TextOption from "@/components/dashboard/options/TextOption.vue";
import UnsupportedOption from "@/components/dashboard/UnsupportedOption.vue";
import { optionTypeOf } from "@/components/dashboard/optionType";
import type { MongoHelper } from "@/types/MongoSchemas";
import type { Component } from "vue";

export { optionTypeOf } from "@/components/dashboard/optionType";

/**
 * Componentes disponibles para renderizar settings.
 *
 * Contrato común de todo option:
 *   - props: `id?`, `label?`, `modelValue?`, `helper?`
 *   - emit: `update:modelValue` con el nuevo valor
 *
 * Para soportar un tipo nuevo basta con crear su componente con este contrato y
 * registrarlo aquí. SettingsSection no necesita cambios.
 */
const optionComponents: Record<string, Component> = {
  boolean: BooleanOption,
  text: TextOption,
  number: NumberOption,
};

/** Se usa cuando el schema trae un tipo que todavía no tiene componente. */
export const fallbackOptionComponent: Component = UnsupportedOption;

export function resolveOptionComponent(helper: MongoHelper): Component {
  return optionComponents[optionTypeOf(helper)] ?? fallbackOptionComponent;
}
