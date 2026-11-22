<template>
  <div class="flex flex-col overflow-x-clip">
    <div
      v-for="(card, index) in props.cards"
      :key="index"
      :class="[
        'flex flex-col justify-center items-center w-screen p-15 reveal keep gap-10 md:min-h-80',
        index % 2 === 0 ? 'left' : 'right',
        index % 2 === 0 ? '' : 'bg-content-contrast',
        card.mediaPosition &&
        (card.mediaPosition === 'bottom' || card.mediaPosition === 'top')
          ? 'md:flex-col'
          : '',
        !card.mediaPosition || card.mediaPosition === 'side'
          ? index % 2 === 0
            ? 'md:flex-row'
            : 'md:flex-row-reverse'
          : '',
        index % 2 === 0 ? '' : 'p-10 translate-y-5',
      ]"
    >
      <template
        v-if="card.media || card.mediaSvg"
        :class="['mb-10 md:mb-0 md:w-75 md:mr-10 md:ml-10']"
      >
        <div
          v-if="card.mediaSvg"
          class="mb-10 md:mb-0 md:mr-10 md:ml-10 flex justify-center w-30 md:w-auto md:h-full"
          id="logo"
          :style="svgStyles(card.mediaFill, card.mediaStroke)"
          v-html="getSvgMarkup(card, index)"
        />
        <img
          id="logo"
          v-else-if="
            !card.mediaPosition || (card.mediaPosition && card.mediaPosition === 'side')
          "
          :src="card.media"
          :alt="card.title"
          :class="['w-30 md:w-auto md:max-w-80 h-auto', ...[card.mediaClasses || []]]"
        />
        <div
          v-else-if="card.mediaPosition && card.mediaPosition === 'top'"
          class="flex h-70 w-full justify-center items-center mt-10 md:mt-0 reveal late keep"
        >
          <img
            :src="card.media"
            :alt="card.title"
            :class="['md:max-w-[70%]', ...[card.mediaClasses || []]]"
          />
        </div>
      </template>
      <div
        :class="[
          'flex flex-col text-center max-w-[80vw]',
          card.textAlign
            ? card.textAlign === 'left'
              ? 'md:text-left'
              : 'justify-center items-center'
            : card.media || card.mediaSvg
            ? 'md:text-left'
            : 'justify-center items-center',
        ]"
      >
        <h1
          :class="[
            'font-bold text-5xl mb-5',
            !card.content ? 'md:text-7xl' : 'md:text-6xl',
          ]"
        >
          {{ card.title }}
        </h1>
        <p
          class="md:text-xl"
          v-if="card.content"
          v-html="parseMarkdown(card.content)"
        ></p>
      </div>
      <div
        v-if="card.media && card.mediaPosition && card.mediaPosition === 'bottom'"
        class="flex h-full w-full justify-center items-center mt-10 md:mt-0 reveal late keep"
      >
        <img
          :src="card.media"
          :alt="card.title"
          :class="['md:max-w-[70%]', ...[card.mediaClasses || []]]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { parseMarkdown } from "@/utils/markdown";

export interface SwappedCard {
  media?: string;
  mediaSvg?: string;
  mediaFill?: string;
  mediaStroke?: string;
  mediaPosition?: "side" | "top" | "bottom";
  mediaClasses?: string;
  title: string;
  content?: string;
  textAlign?: "left" | "center";
}

const props = defineProps<{
  cards: Array<SwappedCard>;
}>();

const embeddedSvgMap = ref<Record<string, string>>({});

function svgStyles(fill?: string, stroke?: string) {
  return {
    color: fill ?? "currentColor",
    "--svg-fill": fill ?? "currentColor",
    "--svg-stroke": stroke ?? "currentColor",
  };
}

function isSvgMarkup(value?: string) {
  return typeof value === "string" && value.trim().startsWith("<svg");
}

function getSvgKey(card: SwappedCard, index: number) {
  return `${index}-${card.title}`;
}

function getSvgMarkup(card: SwappedCard, index: number) {
  const key = getSvgKey(card, index);

  if (embeddedSvgMap.value[key]) {
    return embeddedSvgMap.value[key];
  }

  if (isSvgMarkup(card.mediaSvg)) {
    return card.mediaSvg ?? "";
  }

  return "";
}

async function loadSvgMarkup(card: SwappedCard, index: number) {
  if (!card.mediaSvg || isSvgMarkup(card.mediaSvg)) {
    return;
  }

  const key = getSvgKey(card, index);

  if (embeddedSvgMap.value[key]) {
    return;
  }

  try {
    const response = await fetch(card.mediaSvg);

    if (!response.ok) {
      throw new Error(`No se pudo cargar el SVG: ${response.status}`);
    }

    const svgMarkup = await response.text();
    embeddedSvgMap.value[key] = svgMarkup;
  } catch (error) {
    console.error(error);
    embeddedSvgMap.value[key] = "";
  }
}

watch(
  () => props.cards,
  (cards) => {
    cards.forEach((card, index) => {
      void loadSvgMarkup(card, index);
    });
  },
  { immediate: true, deep: true }
);
</script>
