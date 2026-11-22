<script setup lang="ts">
import type { MenuItem } from "@/types/MenuItem";
import { Divider } from "primevue";
import { RouterLink } from "vue-router";
import MaterialIcon from "../buttons/MaterialIcon.vue";
const props = defineProps<{
  menuItems: MenuItem[];
  opened: boolean;
}>();
</script>

<template>
  <div
    class="flex flex-col bg-jblack w-full h-screen sticky top-0 transition-transform duration-300 ease-in-out z-10"
    :class="[props.opened ? 'translate-x-0' : '-translate-x-full']"
  >
    <ul>
      <RouterLink to="/dashboard" class="no-underline">
        <li
          class="flex items-center gap-2 w-full p-5 text-2xl font-bold hover:bg-primary/5"
        >
          <MaterialIcon name="arrow_back" />Dashboard
        </li>
      </RouterLink>
      <div v-for="item in menuItems" :key="item.name">
        <RouterLink v-if="item.link" :to="item.link">
          <li class="w-full p-5">{{ item.name }}</li>
        </RouterLink>
        <Divider v-else-if="item.divider" class="opacity-20 m-0!" />
      </div>
    </ul>
  </div>
</template>
