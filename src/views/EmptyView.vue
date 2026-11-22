<template>
  <div class="flex flex-col w-screen h-100 justify-center items-center text-center gap-5">
    <h1 class="text-4xl md:text-6xl font-bold">
      {{ phrase }}
    </h1>
    <h2><a class="show-link" href="/">> Volver al Inicio</a></h2>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

let phrase = ref("");
let phrases = ["Aún no hay nada...", "Próximamente...", "Mucho silencio por aquí..."];

onMounted(() => {
  phrase.value = phrases[Math.floor(Math.random() * phrases.length)];
});
</script>
