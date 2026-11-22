<script setup lang="ts">
import { ProgressSpinner } from "primevue";
</script>

<template>
  <ProgressSpinner
    :strokeWidth="18"
    animationDuration=".5s"
    :pt="{
      circleTrack: { style: { stroke: 'transparent' } },
      root: {
        style: {
          '--p-progressspinner-color-one': 'var(--primary)',
          '--p-progressspinner-color-two': 'var(--secondary)',
          '--p-progressspinner-color-three': 'var(--primary)',
          '--p-progressspinner-color-four': 'var(--secondary)',
        },
      },
    }"
    aria-label="loading"
  />
</template>
