<script setup lang="ts">
const props = defineProps<{
  name: string;
  thick?: boolean;
  color?: string;
  /** Tailwind font-size class(es), e.g. "text-2xl" or "text-base md:text-4xl". */
  size?: string;
}>();
</script>

<template>
  <span
    class="material-symbols-rounded no-underline! hover:no-underline!"
    :class="[props.thick ? 'thick' : '', props.size ?? '']"
    :style="[props.color ? { color: props.color } : {}, { textDecoration: 'none' }]"
  >
    {{ name }}
  </span>
</template>
