<script setup lang="ts">
import { parseMarkdown } from "@/utils/markdown";

const props = defineProps<{
  title?: string;
  subtitle?: string;
  description?: string;
  footer?: string;
}>();
</script>

<template>
  <section
    class="min-w-[90%] w-90 md:min-w-[50%] md:max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg"
  >
    <h1
      v-if="title"
      class="mb-3 wrap-break-word text-4xl md:text-5xl font-bold"
      v-html="parseMarkdown(title)"
    ></h1>
    <h2
      v-if="subtitle"
      class="mb-3 text-xl font-bold"
      v-html="parseMarkdown(subtitle)"
    ></h2>
    <p v-if="description" class="text-jgray-200" v-html="parseMarkdown(description)"></p>
    <p
      v-if="footer"
      class="text-xs text-primary/25"
      :class="[title || subtitle || description ? 'mt-5' : '']"
      v-html="parseMarkdown(footer)"
    ></p>
  </section>
</template>
