<script setup lang="ts">
import MaterialIcon from "./MaterialIcon.vue";

withDefaults(
  defineProps<{
    show: boolean;
    loading?: boolean;
    label?: string;
  }>(),
  {
    loading: false,
    label: "Guardar cambios",
  }
);

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <button
    v-if="show"
    type="button"
    :title="label"
    :aria-label="label"
    :disabled="loading"
    class="fixed bottom-5 right-5 z-20 flex h-14 w-14 items-center justify-center rounded bg-secondary-alt shadow-lg cursor-pointer disabled:opacity-60 hover:bg-primary/50 transition-all duration-300 ease-in-out"
    :class="loading ? 'animate-pulse' : ''"
    @click="emit('click')"
  >
    <MaterialIcon thick name="save" />
  </button>
</template>
