<script setup lang="ts">
import type { MenuItem } from "@/types/MenuItem";
import type { DiscordUser } from "@/types/User";
import { Divider } from "primevue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

const menuOpened = ref(false);
const profileButton = ref<HTMLElement | null>(null);
const profileMenu = ref<HTMLElement | null>(null);

const props = defineProps<{
  discordUser: DiscordUser;
  menuItems: MenuItem[];
}>();

const avatarUrl = computed(() => {
  if (!props.discordUser.avatar) {
    return "https://cdn.discordapp.com/embed/avatars/0.png";
  }
  return `https://cdn.discordapp.com/avatars/${props.discordUser.id}/${props.discordUser.avatar}.png`;
});

const closeMenuOnOutsideClick = (event: MouseEvent) => {
  const target = event.target as Node;
  if (!profileButton.value?.contains(target) && !profileMenu.value?.contains(target)) {
    menuOpened.value = false;
  }
};

onMounted(() => document.addEventListener("click", closeMenuOnOutsideClick));
onBeforeUnmount(() => document.removeEventListener("click", closeMenuOnOutsideClick));
</script>

<template>
  <div
    ref="profileButton"
    class="flex flex-col items-center justify-center gap-2 cursor-pointer"
    @click="() => (menuOpened = !menuOpened)"
  >
    <img
      :src="avatarUrl"
      :alt="discordUser.username"
      class="w-16 h-16 rounded-full object-cover"
    />
  </div>
  <div
    ref="profileMenu"
    style="box-shadow: -5px 5px 30px rgba(210, 255, 151, 0.05)"
    class="absolute transition-all bg-jblack h-fit min-w-[90vw] md:min-w-70 right-2 p-5 rounded-2xl"
    :class="[
      menuOpened
        ? 'z-20 opacity-100 top-23 bottom-0'
        : '-z-1 opacity-0 top-0 bottom-full',
    ]"
  >
    <ul class="flex flex-col gap-5 select-none">
      <li class="text-primary font-bold md:text-2xl">Jeffrey Bot</li>

      <div v-for="item in menuItems" :key="item.name">
        <RouterLink v-if="item.link" :to="item.link" @click="menuOpened = false">
          <li class="w-full">{{ item.name }}</li>
        </RouterLink>
        <Divider v-else-if="item.divider" class="opacity-20 m-0!" />
      </div>

      <Divider class="opacity-20 m-0!" />
      <RouterLink to="/logout" class="no-underline" @click="menuOpened = false">
        <li class="text-red-500 hover:text-red-400 transition-all duration-50">
          Cerrar sesión
        </li>
      </RouterLink>
    </ul>
  </div>
</template>
