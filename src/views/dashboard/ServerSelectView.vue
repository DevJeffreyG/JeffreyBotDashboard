<script setup lang="ts">
import { Skeleton } from "primevue";
import { onMounted, ref } from "vue";
import { type DiscordGuild } from "@/types/Guild";
import { useApi } from "@/api/useApi";
import { useCookies } from '@vueuse/integrations/useCookies'
import { useRouter } from "vue-router";
import { isOldEnough } from "@/utils/comparedates";
import GuildCard from "@/components/dashboard/GuildCard.vue";

const cookies = useCookies()
const router = useRouter();

const guilds = ref<DiscordGuild[]>([]);

const fetchTimes = cookies.get<{ lastGuildsFetch: string }>("fetch_times");
const guildFetchTime = fetchTimes?.lastGuildsFetch ?? null;

let needToFetchGuilds = guildFetchTime ? isOldEnough(new Date(guildFetchTime), 5) : true; // Check if the last fetch was more than 5 minutes ago

onMounted(async () => {
  console.log("need to refetch", needToFetchGuilds);
  if (needToFetchGuilds || !localStorage.getItem('guilds')) {
    const { data, error, response } = await useApi("/api/discord/available-guilds", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).json();


    if (error.value) {
      console.log(error.value);
      if (response.value?.status === 401) router.replace("/login");
      else router.replace("/");

      return;
    }

    localStorage.setItem('guilds', JSON.stringify(data.value.guilds));
  }

  guilds.value = JSON.parse(localStorage.getItem('guilds') || '[]');
})
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full gap-10 mt-10">
    <h1 class="text-2xl md:text-5xl font-bold mb-4">Administra un servidor</h1>
    <div
      class="grid grid-cols-1 md:grid-cols-3 justify-center gap-4 md:gap-10 w-[80%] md:w-[50%] mb-10"
    >
      <Skeleton
        v-if="guilds.length === 0"
        v-for="i in 6"
        :key="i"
        borderRadius="0.75rem"
        class="h-45!"
      />

      <GuildCard
        v-for="guild in guilds"
        :key="guild.id"
        :guild="guild"
        class="hover:cursor-pointer"
        @click="() => router.push(`/dashboard/${guild.id}`)"
      />
    </div>
  </div>
</template>
