<script setup lang="ts">
import OptionLabel from "@/components/dashboard/options/OptionLabel.vue";
import { optionTypeOf } from "@/components/dashboard/optionType";
import type { MongoHelper } from "@/types/MongoSchemas";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    id?: string;
    label?: string;
    modelValue?: unknown;
    helper?: MongoHelper;
  }>(),
  {
    id: "unsupported-option",
    label: "",
  }
);

const inputId = computed(() => props.id || "unsupported-option");

const typeLabel = computed(() =>
  props.helper ? optionTypeOf(props.helper) : "desconocido"
);

const displayValue = computed(() => {
  if (props.modelValue === undefined || props.modelValue === null) return "—";
  if (typeof props.modelValue === "object") return JSON.stringify(props.modelValue);
  return String(props.modelValue);
});
</script>

<template>
  <div
    class="flex items-center justify-between w-full bg-jblack/50 gap-3 p-5 md:p-8 rounded-3xl"
  >
    <div class="flex min-w-0 flex-col gap-1">
      <OptionLabel
        :id="inputId"
        :label="label"
        :help="helper?.dashboardInfo?.help"
      />
      <span class="text-xs text-secondary/60">
        Sin editor para "{{ typeLabel }}" (sólo lectura)
      </span>
    </div>
    <output
      :id="inputId"
      class="max-w-1/2 break-all text-right text-sm text-secondary/80 md:text-xl"
    >
      {{ displayValue }}
    </output>
  </div>
</template>
