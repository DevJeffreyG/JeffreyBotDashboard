<script setup lang="ts">
import OptionLabel from "@/components/dashboard/options/OptionLabel.vue";
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
    id: "text-option",
    label: "",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const inputId = computed(() => props.id || "text-option");

const value = computed(() =>
  props.modelValue === undefined || props.modelValue === null
    ? ""
    : String(props.modelValue)
);

function onInput(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}
</script>

<template>
  <div
    class="flex items-center justify-between w-full bg-jblack/50 gap-3 p-5 md:p-8 rounded-3xl"
  >
    <OptionLabel
      :id="inputId"
      :label="label"
      :help="helper?.dashboardInfo?.help"
    />
    <input
      :id="inputId"
      type="text"
      :value="value"
      class="min-w-0 max-w-1/2 rounded-lg bg-content px-3 py-2 text-sm text-secondary outline-none focus:ring-2 focus:ring-primary md:text-xl"
      @input="onInput"
    />
  </div>
</template>
