<template>
  <div
    class="relative flex h-45 w-full items-center justify-center overflow-hidden rounded-2xl bg-jblack transition-all hover:[box-shadow:inset_0px_0px_0px_2px_var(--primary),0_0_1000px_var(--primaryo1)]"
  >
    <div
      class="absolute inset-0 h-full w-full p-4 shadow-md rounded-2xl"
      :style="{
        filter: 'blur(16px)',
        opacity: 0.5,
        background: guild.icon
          ? `url('${getGuildIconUrl}') center center / cover no-repeat`
          : 'linear-gradient(135deg, var(--bg-color) 0%, var(--bg-darker) 50%, var(--primaryo1) 100%)',
      }"
    ></div>
    <img
      v-if="guild.icon"
      :src="getGuildIconUrl"
      :alt="guild.name"
      class="absolute rounded-full z-1 top-[15%] h-[50%]"
    />
    <h2
      class="absolute z-2 mb-2 text-sm md:text-lg font-bold bg-primary/10 p-1 rounded-xl text-center text-wrap"
      :class="guild.icon ? 'bottom-3' : 'translate-y-[-50%] top-[50%]'"
    >
      {{ guildName }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import { type DiscordGuild } from "@/types/Guild";
import { isMobile } from "@/utils/ismobile";
import { computed } from "vue";

const props = defineProps<{
    guild: DiscordGuild;
}>();

const getGuildIconUrl = computed(() => {
    if (!props.guild.icon) return "";
    const format = props.guild.icon.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/icons/${props.guild.id}/${props.guild.icon}.${format}`;
});

const guildName = computed(() => {
    let max = isMobile(window) ? 15 : 25; // set max length based on
    return props.guild.name.length > max
        ? props.guild.name.substring(0, max) + "..."
        : props.guild.name;
});
</script>
