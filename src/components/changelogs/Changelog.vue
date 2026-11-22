<script setup lang="ts">
import moment from "moment-timezone";
import { type ChangelogType } from "@/types/Changelog";
import { Divider } from "primevue";
import { parseMarkdown } from "@/utils/markdown";
import ChangelogBadge from "./ChangelogBadge.vue";

defineProps<{
  changeInfo: ChangelogType;
}>();

function parseDesc(description: string): string {
  let desc = description;

  // agregar punto final en caso de ser necesario
  if (!desc.endsWith(".") && !(desc.endsWith(":") || desc.endsWith("!") || desc.endsWith("?")))
    desc += ".";

  return parseMarkdown(desc);
}
</script>

<template>
  <div class="flex flex-col items-center md:items-start w-full">
    <h1 class="text-center text-4xl font-bold md:text-8xl md:text-left">
      v{{ changeInfo.version }}
    </h1>
    <h3
      v-if="changeInfo.slogan"
      class="text-center text-lg md:text-2xl font-semibold md:text-left mb-5"
    >
      {{ changeInfo.slogan }}
    </h3>

    <ul class="flex flex-col gap-5 mt-5 w-full">
      <li
        v-for="change in changeInfo.changes"
        :key="change.title"
        class="flex flex-col text-center md:text-left gap-1 md:gap-5"
      >
        <h1
          class="flex flex-row items-center justify-center md:justify-start gap-1 text-lg md:text-3xl font-bold"
        >
          <ChangelogBadge :change-type="change.type" />
          {{ change.title }}
        </h1>

        <p
          class="md:w-[80%]"
          v-if="change.description"
          v-html="parseDesc(change.description)"
        ></p>
      </li>
    </ul>

    <div class="w-[90%]">
      <Divider class="w-full opacity-20" />
    </div>
    <p class="text-xs md:text-sm text-center">
      Cambios anunciados {{ moment(changeInfo.timestamp).fromNow() }}, el
      {{ moment(changeInfo.timestamp).format("LLL") }}
    </p>
  </div>
</template>
