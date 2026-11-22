<script setup lang="ts">
import moment from "moment-timezone";
import ParallaxBanner from "@/components/content/ParallaxBanner.vue";
import bannerImg from "@/assets/imgs/CSBanner.png";
import { onMounted, ref } from "vue";
import { useApi } from "@/api/useApi";
import { parseMarkdown } from "@/utils/markdown";
import { Skeleton } from "primevue";
let lastUpdated = ref("");
let terms = ref("Cargando...");

onMounted(() => {
  useApi("/api/db/get-tos")
    .get()
    .json()
    .then((response) => {
      const { data } = response;

      if (!data.value) {
        lastUpdated.value = "";
        terms.value =
          "No pudimos comunicarnos con **[Jeffrey Bot](/status!)**, inténtalo más tarde. ¡Contacta a Jeff si es urgente, disculpa las molestias!";
        return;
      } else {
        lastUpdated.value = moment(new Date(data.value.info.terms_since)).format(
          "DD/MM/YYYY hh:mm a"
        );
        terms.value = data.value.info.terms;
      }
    });
});
</script>

<template>
  <div class="flex w-full flex-col">
    <ParallaxBanner :banner-img="bannerImg" title="Términos y Condiciones" />
    <div class="flex flex-col w-screen min-h-100 items-center">
      <div class="flex flex-col gap-5 font-bold text-center p-10">
        <h1 class="text-4xl md:text-6xl">Última actualización</h1>
        <h3 class="md:text-xl">{{ lastUpdated }}</h3>
      </div>
      <div>
        <p
          class="mt-5 w-screen pl-5 pr-5 md:pl-100 md:pr-100 md:text-xl pb-10"
          v-html="parseMarkdown(terms)"
        ></p>
      </div>
      <div v-if="lastUpdated.length === 0" class="w-[80%] flex flex-col gap-3 mb-10">
        <Skeleton
          v-for="i in 10"
          :key="i"
          borderRadius="0.75rem"
          class="w-full! h-5! md:h-10!"
        />
      </div>
    </div>
  </div>
</template>
