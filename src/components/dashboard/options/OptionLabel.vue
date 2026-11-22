<script setup lang="ts">
import MaterialIcon from "@/components/buttons/MaterialIcon.vue";

const props = defineProps<{
  id?: string;
  label?: string;
  help?: string;
}>();
</script>

<template>
  <label
    :for="props.id"
    class="min-w-0 text-sm leading-snug text-secondary md:text-4xl"
  >
    <span class="wrap-break-words">{{ props.label }}</span>
    <MaterialIcon
      v-if="props.help"
      thick
      name="help"
      class="ml-1 inline-block align-middle text-secondary/60"
      v-tooltip.top="props.help"
      size="text-base md:text-2xl"
    />
  </label>
</template>
