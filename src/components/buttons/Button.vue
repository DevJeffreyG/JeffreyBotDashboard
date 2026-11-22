<template>
  <RouterLink v-if="props.routerLink" :to="props.routerLink" class="no-underline">
    <button
      class="flex items-center justify-center bg-secondary-alt border-transparent border-2 rounded-lg h-[65%] hover:border-primary hover:cursor-pointer transition-all duration-50"
    >
      <p class="p-2 md:text-2xl">
        {{ props.text }}
      </p>
    </button>
  </RouterLink>
  <button
    v-else
    class="flex items-center justify-center bg-secondary-alt border-transparent border-2 rounded-lg h-[65%] hover:border-primary hover:cursor-pointer transition-all duration-50"
  >
    <p class="p-2 md:text-2xl">
      {{ props.text }}
    </p>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  routerLink?: string;
  text: string;
}>();
</script>
