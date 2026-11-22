<script setup lang="ts">
import OptionLabel from "@/components/dashboard/options/OptionLabel.vue";
import { optionConstraintsFor, optionHintFor } from "@/components/dashboard/optionHints";
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
    id: "number-option",
    label: "",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const inputId = computed(() => props.id || "number-option");
const hint = computed(() => optionHintFor(props.helper));
const constraints = computed(() => optionConstraintsFor(props.helper));
const isSpecial = computed(() => hint.value?.isActive(props.modelValue) ?? false);

const value = computed(() => {
  const raw = props.modelValue;
  const parsed = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
});

function onInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value;
  emit("update:modelValue", raw === "" ? 0 : Number(raw));
}
</script>

<template>
  <div
    class="flex items-center justify-between w-full bg-jblack/50 gap-3 p-5 md:p-8 rounded-3xl"
  >
    <OptionLabel :id="inputId" :label="label" :help="helper?.dashboardInfo?.help" />
    <div class="flex min-w-0 max-w-1/2 flex-col items-end gap-1">
      <span
        v-if="hint"
        :id="hint ? `${inputId}-hint` : undefined"
        class="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase md:text-xs"
        :class="isSpecial ? 'bg-primary/20 text-primary' : 'bg-content text-secondary/70'"
        v-tooltip.top="hint.tooltip"
      >
        {{ isSpecial ? hint.activeLabel : hint.label }}
      </span>
      <input
        :id="inputId"
        type="number"
        :value="value"
        :min="constraints.min"
        :step="constraints.step"
        :aria-describedby="hint ? `${inputId}-hint` : undefined"
        class="min-w-0 max-w-30 md:max-w-full rounded-lg bg-content px-3 py-2 text-sm text-secondary! outline-none focus:ring-2 focus:ring-primary md:text-xl"
        @input="onInput"
      />
    </div>
  </div>
</template>
