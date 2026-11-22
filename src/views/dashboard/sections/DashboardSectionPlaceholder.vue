<script setup lang="ts">
import Card from "@/components/content/Card.vue";
import LoadingCircle from "@/components/content/LoadingCircle.vue";
import type { DiscordGuild } from "@/types/Guild";

const props = withDefaults(
  defineProps<{
    sectionName?: string;
    guild?: DiscordGuild | null;
  }>(),
  {
    sectionName: "Sección",
  }
);
</script>

<template>
  <section v-if="!props.guild">
    <LoadingCircle />
  </section>
  <section v-else class="flex flex-col gap-10 w-full items-center">
    <Card
      :title="props.sectionName"
      subtitle="Esta sección aún no está disponible"
      :description="'Estamos trabajando en ello, pero aún no está disponible. Por favor, vuelva más tarde.'"
      :footer="props.guild ? `Estás configurando ${props.guild.name}.` : undefined"
    />
  </section>
</template>
