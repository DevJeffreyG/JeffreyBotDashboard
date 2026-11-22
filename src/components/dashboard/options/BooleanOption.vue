<script setup lang="ts">
import type { MongoHelper } from "@/types/MongoSchemas";
import { ToggleSwitch } from "primevue";
import { computed } from "vue";
import OptionLabel from "@/components/dashboard/options/OptionLabel.vue";

const props = withDefaults(
  defineProps<{
    id?: string;
    label?: string;
    modelValue?: unknown;
    helper?: MongoHelper;
  }>(),
  {
    id: "boolean-option",
    label: "",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "change", value: boolean): void;
}>();

const inputId = computed(() => props.id || "boolean-option");

const checked = computed({
  get: () => Boolean(props.modelValue),
  set: (nextValue: boolean) => {
    emit("update:modelValue", nextValue);
    emit("change", nextValue);
  },
});
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
    <ToggleSwitch
      v-model="checked"
      :inputId="inputId"
      :pt="{
        slider: {
          class: checked ? 'bg-primary!' : '',
        },
      }"
    />
  </div>
</template>
