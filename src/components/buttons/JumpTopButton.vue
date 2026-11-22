<template>
  <div class="flex items-center justify-center mx-auto w-fit" @click="goUp()">
    <MaterialIcon
      name="keyboard_double_arrow_up"
      class="transition-all p-2 border rounded-2xl cursor-pointer hover:bg-secondary/50"
    />
  </div>
</template>

<script setup lang="ts">
import "@/assets/css/buttons.css";
import MaterialIcon from "./MaterialIcon.vue";

function goUp() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>
