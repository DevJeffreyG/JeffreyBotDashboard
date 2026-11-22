<script setup lang="ts">
import MaterialIcon from "@/components/buttons/MaterialIcon.vue";
import Sidebar from "@/components/dashboard/Sidebar.vue";
import type { MenuItem } from "@/types/MenuItem";
import { isMobile } from "@/utils/ismobile";
import HomeDashboard from "@/views/dashboard/sections/HomeDashboard.vue";
import DashboardSectionPlaceholder from "@/views/dashboard/sections/DashboardSectionPlaceholder.vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { DiscordGuild } from "@/types/Guild";
import { isOldEnough } from "@/utils/comparedates";
import { useApi } from "@/api/useApi";

import ActiveModules from "@/views/dashboard/sections/ActiveModules.vue";
import Quantities from "@/views/dashboard/sections/Quantities.vue";

const route = useRoute();
const router = useRouter();

const thisGuild = ref<DiscordGuild | null>(null);
const guildId = computed(() => (route.params.guildId as string | undefined) ?? "");
const dashboardBaseLink = computed(() =>
  guildId.value ? `/dashboard/${guildId.value}` : "/dashboard"
);

const sectionDefinitions = {
  home: { component: HomeDashboard, title: "Inicio" },
  active_modules: { component: ActiveModules, title: "Módulos activos" },
  quantities: { component: Quantities, title: "Cantidades" },
  functions: { component: DashboardSectionPlaceholder, title: "Funciones" },
  roles: { component: DashboardSectionPlaceholder, title: "Roles" },
  levels: { component: DashboardSectionPlaceholder, title: "Roles de niveles" },
  channels: { component: DashboardSectionPlaceholder, title: "Canales" },
  categories: { component: DashboardSectionPlaceholder, title: "Categorías" },
  chat_rewards: {
    component: DashboardSectionPlaceholder,
    title: "Recompensas en canales",
  },
} as const;

const currentSection = computed(() => {
  const sectionKey = (route.params.section as string | undefined) ?? "home";
  const selectedSection =
    sectionDefinitions[sectionKey as keyof typeof sectionDefinitions] ??
    sectionDefinitions.home;

  return {
    component: selectedSection.component,
    props: {
      sectionName: selectedSection.title,
      guild: thisGuild.value,
    },
  };
});

const menuItems = computed<MenuItem[]>(() => [
  { divider: true },
  { name: "Inicio", link: `${dashboardBaseLink.value}` },
  { divider: true },
  { name: "Modulos activos", link: `${dashboardBaseLink.value}/active_modules` },
  { name: "Cantidades", link: `${dashboardBaseLink.value}/quantities` },
  { name: "Funciones", link: `${dashboardBaseLink.value}/functions` },
  { divider: true },
  { name: "Roles", link: `${dashboardBaseLink.value}/roles` },
  { name: "Roles de niveles", link: `${dashboardBaseLink.value}/levels` },
  { divider: true },
  { name: "Canales", link: `${dashboardBaseLink.value}/channels` },
  { name: "Categorias", link: `${dashboardBaseLink.value}/categories` },
  { name: "Recompensas en canales", link: `${dashboardBaseLink.value}/chat_rewards` },
]);

const isMobileView = ref(isMobile(window));

const updateMobileState = () => {
  isMobileView.value = isMobile(window);
  sidebarOpen.value = isMobileView.value ? false : true;
};

const sidebarOpen = ref<boolean>(!isMobileView.value);

const burgerMenuButton = ref<HTMLElement | null>(null);

const closeSidebarOnOutsideClick = (event: MouseEvent) => {
  const target = event.target as Node;
  if (!burgerMenuButton.value?.contains(target) && isMobileView.value) {
    sidebarOpen.value = false;
  }
};

onMounted(async () => {
  document.addEventListener("click", closeSidebarOnOutsideClick);
  window.addEventListener("resize", updateMobileState);

  // fetch guild if necessary
  let fetchedGuild = localStorage.getItem(`guild_${guildId.value}`);

  if (
    !fetchedGuild ||
    (JSON.parse(fetchedGuild).lastFetch &&
      isOldEnough(new Date(JSON.parse(fetchedGuild).lastFetch), 5))
  ) {
    const { data, error, response } = await useApi(
      `/api/discord/guild/${guildId.value}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).json();

    if (response.value?.status === 403 || response.value?.status === 404) {
      console.log("bot not on guild"); // TODO: INVITE BOT TO GUILD
      return router.replace("/dashboard");
    } else if (response.value?.status !== 200) {
      console.log(response.value?.status, error.value, data.value);

      return router.replace("/");
    }

    thisGuild.value = { ...data.value.guild, lastFetch: new Date() };
    localStorage.setItem(`guild_${guildId.value}`, JSON.stringify(thisGuild.value));
  } else {
    thisGuild.value = JSON.parse(fetchedGuild);
  }
});
onBeforeUnmount(() => {
  document.removeEventListener("click", closeSidebarOnOutsideClick);
  window.removeEventListener("resize", updateMobileState);
});
</script>

<template>
  <div class="relative flex min-h-screen w-full">
    <div
      ref="burgerMenuButton"
      v-if="isMobileView"
      class="sticky top-0 z-15 h-0 w-0 shrink-0"
    >
      <div
        class="absolute flex translate-y-1 items-center justify-center rounded border bg-jblack p-2 transition-all duration-300 ease-in-out cursor-pointer"
        :class="[sidebarOpen ? 'left-71' : 'left-1']"
        @click="() => (sidebarOpen = !sidebarOpen)"
      >
        <MaterialIcon :name="sidebarOpen ? 'close' : 'menu'" />
      </div>
    </div>

    <div
      class="w-70 shrink-0"
      :class="isMobileView ? 'absolute inset-y-0 left-0 z-10' : 'static'"
    >
      <Sidebar :menu-items="menuItems" :opened="sidebarOpen" />
    </div>

    <div class="flex min-w-0 flex-1 flex-col items-center justify-center gap-10 p-10">
      <component :is="currentSection.component" v-bind="currentSection.props" />
    </div>
  </div>
</template>
