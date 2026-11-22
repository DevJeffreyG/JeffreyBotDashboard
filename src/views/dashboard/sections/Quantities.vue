<script setup lang="ts">
import SchemaSettingsView from "@/components/dashboard/SchemaSettingsView.vue";
import { quantitiesSettings } from "@/config/dashboardSettings";
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
  <SchemaSettingsView
    :section-name="props.sectionName"
    :guild="props.guild"
    :config="quantitiesSettings"
  />
</template>
