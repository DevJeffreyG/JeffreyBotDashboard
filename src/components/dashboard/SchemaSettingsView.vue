<script setup lang="ts">
import SaveButton from "@/components/buttons/SaveButton.vue";
import Card from "@/components/content/Card.vue";
import LoadingCircle from "@/components/content/LoadingCircle.vue";
import {
  useSettingsSchema,
  type SettingsSchemaConfig,
} from "@/composables/useSettingsSchema";
import type { DiscordGuild } from "@/types/Guild";
import SettingsSection from "@/components/dashboard/SettingsSection.vue";

const props = withDefaults(
  defineProps<{
    sectionName?: string;
    guild?: DiscordGuild | null;
    config: SettingsSchemaConfig;
    description?: string;
  }>(),
  {
    sectionName: "Sección",
    description: "",
  }
);

const {
  groups,
  values,
  hasChanges,
  isLoading,
  isSaving,
  error,
  setOption,
  save,
} = useSettingsSchema({
  guild: () => props.guild,
  config: () => props.config,
});

async function handleSave() {
  await save();
}
</script>

<template>
  <section v-if="!props.guild || isLoading">
    <LoadingCircle />
  </section>
  <div v-else class="flex flex-col gap-5">
    <section class="flex flex-col gap-10 w-full items-center">
      <Card
        :title="props.sectionName"
        :description="props.description || props.config.description || undefined"
        :footer="`Estás configurando ${props.guild.name}.`"
      />
    </section>

    <p v-if="error" class="text-center text-red-400">
      No se pudo cargar la configuración de esta sección.
    </p>

    <SettingsSection
      v-for="group in groups"
      :key="group.sectionName"
      :section-name="group.sectionName"
      :path-prefix="props.config.pathPrefix"
      :mongo-helpers="group.helpers"
      :values="values"
      @update:value="setOption"
    />

    <SaveButton :show="hasChanges" :loading="isSaving" @click="handleSave" />
  </div>
</template>
