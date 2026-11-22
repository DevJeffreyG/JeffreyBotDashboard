<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import Button from "@/components/buttons/Button.vue";
import { useApi } from "@/api/useApi.ts";
import Profile from "@/components/navbar/Profile.vue";
import type { DiscordUser } from "@/types/User.ts";
import type { MenuItem } from "@/types/MenuItem.ts";
import { useRoute } from "vue-router";
import {
  decodeJwt,
  discordUserFromJwt,
  isExpired,
  type AuthJwtPayload,
} from "@/utils/jwt.ts";

const defaultMenuItems: MenuItem[] = [
  { name: "Dashboard", link: "/dashboard" },
  { name: "Cambios recientes", link: "/changelogs" },
];

const discordUser = ref<DiscordUser | null>(null);
const menuItems = ref<MenuItem[]>(defaultMenuItems);
const route = useRoute();
const resetAuthState = () => {
  discordUser.value = null;
  menuItems.value = defaultMenuItems;
};

const loadDiscordUser = async () => {
  const { data, response } = await useApi("/api/discord/me", {
    credentials: "include",
  }).json();

  const status = response.value?.status;
  if (status === 401 || status === 403 || status === 204) {
    resetAuthState();
    return;
  }

  // /api/discord/me devuelve un JWT firmado como string JSON: res.json(jwt.sign(...))
  const token = typeof data.value === "string" ? data.value : null;
  if (!token) {
    resetAuthState();
    return;
  }

  let claims: AuthJwtPayload;
  try {
    claims = decodeJwt(token);
  } catch (error) {
    console.error("No se pudo decodificar el JWT de sesión:", error);
    resetAuthState();
    return;
  }

  if (isExpired(claims)) {
    resetAuthState();
    return;
  }

  const user = discordUserFromJwt(claims);
  if (!user) {
    resetAuthState();
    return;
  }

  discordUser.value = user;

  const store = {
    id: user.id,
    username: user.username,
    global_name: user.global_name,
    avatar: user.avatar,
  };

  localStorage.setItem("discordUser", JSON.stringify(store));

  if (user.dev) {
    if (!menuItems.value.some((item) => item.link === "/changelogs?showAdmin=1")) {
      menuItems.value.push({ divider: true });
      menuItems.value.push({ name: "Admin Panel", link: "/changelogs?showAdmin=1" });
    }
  }
};

onMounted(() => {
  window.addEventListener("auth-changed", resetAuthState);
  loadDiscordUser();
});

onBeforeUnmount(() => {
  window.removeEventListener("auth-changed", resetAuthState);
});

watch(() => route.fullPath, loadDiscordUser);
</script>

<template>
  <nav
    class="flex flex-row items-center justify-between w-full h-20 md:h-25 bg-content-contrast"
  >
    <RouterLink to="/">
      <div class="flex flex-row items-center justify-center gap-2 ml-1 md:ml-10">
        <img
          src="@/assets/imgs/nobg_jb_logo.png"
          alt="Jeffrey Bot Logo"
          class="max-h-full w-20 object-contain"
        />
        <p class="text-2xl md:text-4xl">Jeffrey Bot</p>
      </div>
    </RouterLink>
    <div class="flex flex-row items-center justify-end mr-2 md:mr-10 h-[80%]">
      <Button
        v-if="!discordUser"
        routerLink="/login"
        text="Entra con
      Discord"
      />
      <Profile v-else :discordUser="discordUser" :menuItems="menuItems" />
    </div>
  </nav>
</template>
