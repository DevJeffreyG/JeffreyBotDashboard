<script setup lang="ts">
import { useApi } from "@/api/useApi";
import Card from "@/components/content/Card.vue";
import LoadingCircle from "@/components/content/LoadingCircle.vue";
import NumberCard from "@/components/content/NumberCard.vue";
import type { DiscordGuild } from "@/types/Guild";
import { useCookies } from "@vueuse/integrations/useCookies";
import moment from "moment-timezone";
import { computed, onMounted, ref, watch } from "vue";

const cookies = useCookies();

const props = withDefaults(
  defineProps<{
    sectionName?: string;
    guild: DiscordGuild;
  }>(),
  {
    sectionName: "Sección",
  }
);

const resume = ref<{
  id: string;
  channels: number;
  roles: number;
  staff: number;
  admins: number;
  members: number;
  activeModules: number;
  totalModules: number;
  activeFunctions: number;
  totalFunctions: number;
  levelRoles: number;
  chatRewards: number;
  currencyAverage: number;
  currencyName: string;
} | null>(null);

const hello = computed(() => {
  const username = localStorage.getItem("discordUser")
    ? JSON.parse(localStorage.getItem("discordUser")!).global_name
    : "Usuario";
  const greetings: string[] = [
    "¡Hola, USERNAME!",
    "¡Bienvenidx, USERNAME!",
    "¡Buen día, USERNAME!",
    "¡Qué gusto verte, USERNAME!",
    "¡Saludos, USERNAME!",
  ].map((greeting) => {
    return greeting.replace("USERNAME", username);
  });

  return greetings[Math.floor(Math.random() * greetings.length)];
});

async function resumeGuild(id: string) {
  if (cookies.get("guild_resume")) {
    resume.value = cookies.get("guild_resume");
  }

  if (resume.value?.id === id) return;

  const { data, response } = await useApi(`/api/discord/guild/resume/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).json();

  if (response.value?.status != 200) {
    console.error("Error fetching guild resume:", response.value?.status, data);
    return;
  } else {
    console.log(data.value);
    resume.value = data.value;
  }
}

watch(
  () => props.guild,
  async (newGuild: DiscordGuild) => {
    if (newGuild) await resumeGuild(newGuild.id);
  }
);

onMounted(async () => {
  if (props.guild) await resumeGuild(props.guild.id);
});
</script>

<template>
  <section v-if="!props.guild">
    <LoadingCircle />
  </section>
  <section v-else class="flex flex-col gap-10 w-full items-center">
    <Card :title="hello" :description="`Estás configurando **${props.guild?.name}**.`" />

    <Card
      description="Usa las secciones de la izquierda para configurar Jeffrey Bot como gustes."
    />
    <div class="flex flex-wrap justify-center md:max-w-[60vw] gap-5">
      <!-- IZQUIERDA -->

      <div class="flex flex-col w-fit items-start gap-5">
        <div class="flex flex-wrap max-w-90 justify-center gap-5">
          <NumberCard :number="resume?.channels || 0" text="canales" />
          <NumberCard :number="resume?.roles || 0" text="roles" />
          <NumberCard :number="resume?.staff || 0" text="STAFF" />
          <NumberCard :number="resume?.admins || 0" text="Admins" />
          <NumberCard
            class="w-full"
            prefix="$"
            :number="resume?.currencyAverage || 0"
            prettify
            showTooltip
            :text="`Promedio de ${resume?.currencyName || 'Jeffros'}`"
          />
        </div>
      </div>

      <!-- DERECHA -->

      <div class="flex max-w-90 flex-wrap gap-5">
        <div class="flex flex-row w-full gap-5">
          <NumberCard
            class="w-full"
            :number="resume?.activeModules || 0"
            :total="resume?.totalModules || 0"
            text="Módulos activos"
          />
          <NumberCard
            class="w-full"
            :number="resume?.activeFunctions || 0"
            :total="resume?.totalFunctions || 0"
            text="Funciones activas"
          />
        </div>
        <NumberCard
          class="w-full"
          :number="resume?.levelRoles || 0"
          text="Roles de niveles"
        />
        <NumberCard
          class="w-full"
          :number="resume?.chatRewards || 0"
          text="Recompensas en canales"
        />
      </div>

      <!-- ABAJO -->
      <div class="flex flex-col w-[70%]">
        <Card
          class="w-full text-center"
          :description="`Ultima actualización ${moment(
            props.guild.lastFetch
          ).fromNow()}.`"
        />
      </div>
    </div>
  </section>
</template>
