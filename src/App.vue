<script setup lang="ts">
import Navbar from "@/components/main/Navbar.vue";
import Footer from "@/components/main/Footer.vue";
import { revealWork } from "@/utils/reveal";

revealWork();
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex h-full w-full">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
