<script setup lang="ts">
import { resolveOptionComponent } from "@/components/dashboard/optionRegistry";
import { useDashboardFeatures } from "@/composables/useDashboardFeatures";
import type { SettingsValues } from "@/composables/useSettingsSchema";
import {
  OptionEffects,
  type OptionEffect,
} from "@/types/DashboardFeatures";
import type { MongoHelper } from "@/types/MongoSchemas";
import MaterialIcon from "@/components/buttons/MaterialIcon.vue";
import { computed } from "vue";

const props = defineProps<{
  sectionName: string;
  pathPrefix?: string;
  mongoHelpers?: MongoHelper[];
  values?: SettingsValues;
}>();

const emit = defineEmits<{
  (e: "update:value", path: string, value: unknown): void;
}>();

// GET /api/db/global/dashboard-features (global, con caché en el composable).
const { featureFor } = useDashboardFeatures();

const effectIcons: Record<OptionEffect, string> = {
  [OptionEffects.None]: "",
  [OptionEffects.New]: "fiber_new",
  [OptionEffects.Featured]: "star",
  [OptionEffects.Recommended]: "mode_heat",
};

const effectColors: Record<OptionEffect, string> = {
  [OptionEffects.None]: "",
  [OptionEffects.New]: "#d9ff52",
  [OptionEffects.Featured]: "#ffe600",
  [OptionEffects.Recommended]: "#ff5e00",
};

/** Borde animado: el padding del envoltorio deja ver el gradiente alrededor del Option. */
const effectClasses: Record<OptionEffect, string> = {
  [OptionEffects.None]: "",
  [OptionEffects.New]:
    "bg-[length:400%_100%] bg-[linear-gradient(45deg,transparent_0%,rgba(102,102,102,0.75)_50%,transparent_100%)] animate-[moveGradient_3s_linear_infinite]",
  [OptionEffects.Featured]:
    "bg-[length:400%_100%] bg-[repeating-linear-gradient(45deg,#d9ff52_0%,#d9ff52_25%,#f1ffbf_50%,#d9ff52_75%,#d9ff52_100%)] animate-[moveGradient_10s_linear_infinite]",
  [OptionEffects.Recommended]:
    "bg-[length:400%_100%] bg-[linear-gradient(45deg,#ff595e,#ffca3a,#8ac926,#1982c4,#6a4c93,#ff6700)] animate-[moveGradient_3s_linear_infinite] shadow-[0_0_25px_rgba(255,94,0,0.35)]",
};

const defaultTooltips: Record<OptionEffect, string> = {
  [OptionEffects.None]: "",
  [OptionEffects.New]: "¡Nuevo!",
  [OptionEffects.Featured]: "¡Destacado, suele usarse mucho!",
  [OptionEffects.Recommended]: "¡Recomendado, deberías usar esto!",
};

function optionPath(helper: MongoHelper): string {
  return `${props.pathPrefix ? props.pathPrefix + "." : ""}${helper.path}`;
}

function optionValue(helper: MongoHelper): unknown {
  const path = optionPath(helper);
  if (props.values && Object.prototype.hasOwnProperty.call(props.values, path)) {
    return props.values[path];
  }
  return helper.mongoInfo.defaultValue;
}

const renderedOptions = computed(() =>
  (props.mongoHelpers ?? []).map((helper) => {
    const path = optionPath(helper);
    const feature = featureFor(path, helper.path);
    const effect = feature?.effect ?? OptionEffects.None;

    return {
      helper,
      path,
      value: optionValue(helper),
      effect,
      border: effectClasses[effect],
      hasEffect: effect !== OptionEffects.None,
      icon: effectIcons[effect],
      color: effectColors[effect],
      tooltip: feature?.description || defaultTooltips[effect],
    };
  })
);
</script>

<template>
  <section
    v-if="mongoHelpers && mongoHelpers.length > 0"
    class="flex flex-col gap-5 w-full md:w-300 items-center bg-content-contrast rounded-2xl p-5"
  >
    <h1 class="font-bold md:text-2xl">{{ props.sectionName }}</h1>

    <div
      v-for="option in renderedOptions"
      :key="option.path"
      class="relative w-full rounded-3xl p-1 md:p-2"
      :class="option.border"
    >
      <div class="relative overflow-hidden rounded-[21px] bg-jblack md:rounded-[19px]">
        <component
          :is="resolveOptionComponent(option.helper)"
          class="w-full"
          :id="option.path"
          :helper="option.helper"
          :label="option.helper.dashboardInfo.name"
          :model-value="option.value"
          @update:model-value="
            (nextValue: unknown) => emit('update:value', option.path, nextValue)
          "
        />
      </div>

      <span
        v-if="option.hasEffect"
        class="absolute -top-3 -left-2 z-4 grid size-8 place-items-center rounded-full bg-content shadow-md md:-top-4 md:-left-3 md:size-10"
        :style="{ color: option.color }"
        v-tooltip.top="option.tooltip"
      >
        <MaterialIcon :name="option.icon" thick class="text-base md:text-2xl" />
      </span>
    </div>
  </section>
</template>

<style>
@keyframes moveGradient {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>
