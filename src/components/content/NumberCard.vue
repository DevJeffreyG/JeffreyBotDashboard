<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    number: number;
    total?: number;
    text: string;
    color?: string;
    prefix?: string;
    tooltip?: string | number;
    prettify?: boolean;
    showTooltip?: boolean;
  }>(),
  {
    number: 0,
    text: "elementos",
    prettify: false,
    showTooltip: false,
  }
);

function prettyNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  } else if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  } else {
    return num.toString();
  }
}
</script>

<template>
  <div
    class="flex flex-col justify-center items-center rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg"
    v-tooltip="
      showTooltip || props.tooltip
        ? props.prefix + String(props.tooltip ?? props.number.toLocaleString('es-CO'))
        : undefined
    "
  >
    <p
      v-if="!props.total"
      class="text-7xl font-bold -translate-y-3"
      :class="props.color ?? ''"
    >
      {{ props.prefix ?? "" }}
      {{ props.prettify ? prettyNumber(props.number) : props.number }}
    </p>

    <div v-if="props.total" class="flex items-end mb-1">
      <p class="text-4xl font-bold -translate-y-3" :class="props.color ?? ''">
        {{ props.number }}
      </p>
      <p class="text-xs text-gray-500">/{{ props.total }}</p>
    </div>

    <p class="text-xs text-center mt-2 text-gray-500">{{ props.text.toUpperCase() }}</p>
  </div>
</template>
