<template>
  <section class="parallax-page w-full min-h-[40vh] md:min-h-[67vh]">
    <div class="parallax-layer" :style="backgroundStyle"></div>

    <div class="content w-full">
      <h1 class="font-bold text-4xl md:text-7xl">{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useScroll } from "@vueuse/core";

const { y } = useScroll(window);

const props = defineProps<{
  title: string;
  subtitle?: string | null;
  bannerImg?: string | null;
  bannerColor?: string | null;
}>();

const backgroundStyle = computed(() => ({
  transform: `translate3d(0, ${y.value * 0.2}px, 0)`,
  backgroundColor: props.bannerColor || undefined,
  backgroundImage: props.bannerImg ? `url(${props.bannerImg})` : undefined,
}));
</script>

<style scoped>
.parallax-page {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(
    rgb(104, 129, 64),
    rgb(217, 255, 82),
    rgb(104, 129, 64)
  );
}

.parallax-layer {
  position: absolute;
  inset: -20px;
  background-size: cover;
  background-position: center;
  filter: blur(1px) brightness(0.9);
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

.content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
}

h1 {
  margin-bottom: 0.5rem;
}

p {
  opacity: 0.9;
}
</style>
