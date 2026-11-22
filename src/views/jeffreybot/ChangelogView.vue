<script setup lang="ts">
import ParallaxBanner from "@/components/content/ParallaxBanner.vue";
import { onMounted, ref } from "vue";
import { type ChangelogType } from "@/types/Changelog";
import { useApi } from "@/api/useApi";
import Changelog from "@/components/changelogs/Changelog.vue";
import { parseMarkdown } from "@/utils/markdown";
import Skeleton from "primevue/skeleton";
import Button from "@/components/buttons/Button.vue";
import { Divider } from "primevue";
import { useRoute } from "vue-router";

const allChanges = ref<ChangelogType[]>([]);
const shownChanges = ref<ChangelogType[]>([]);

const errorFetch = ref<boolean>(false);

const route = useRoute();


onMounted(() => {
  // change api to /api/db/get-changelog/:version if version is provided in the route
  let specificVersion = route.params.version;
  useApi(specificVersion ? `/api/db/get-changelog/${specificVersion}` : "/api/db/get-changelogs")
    .get()
    .json()
    .then((response) => {
      const { data } = response;

      if (!specificVersion) {
        if (!Array.isArray(data.value)) {
          errorFetch.value = true;
        } else {
          allChanges.value = data.value;
        }
      } else {
        if (!data.value) {
          errorFetch.value = true;
        } else {
          allChanges.value = [data.value];
        }
      }

      // show only first 5 changes
      shownChanges.value = allChanges.value.slice(0, allChanges.value.length > 5 ? 5 : allChanges.value.length);
    })
});

function loadMore() {
  shownChanges.value = allChanges.value.slice(0, shownChanges.value.length + 5);
}

const sizes = ["md:w-[80%]!", "md:w-[90%]!", "md:w-[70%]!"];
const getRandomSize = () => {
  return sizes[Math.floor(Math.random() * sizes.length)];
};
</script>

<template>
  <div class="flex w-full flex-col">
    <ParallaxBanner title="Últimos cambios" />

    <div
      class="flex flex-col w-screen min-h-100 items-center justify-center mt-10 mb-10 overflow-x-clip"
    >
      <div class="flex flex-col mt-5 gap-10 md:gap-40 items-center w-[80%]">
        <p
          v-if="errorFetch"
          class="text-center mt-5 w-screen pl-5 pr-5 md:pl-100 md:pr-100 md:text-xl pb-10"
          v-html="
            parseMarkdown(
              'Parece que no podemos comunicarnos con **[Jeffrey Bot](/status!)**, inténtalo más tarde.'
            )
          "
        ></p>
        <div v-if="allChanges.length === 0" class="w-full flex flex-col gap-3">
          <Skeleton borderRadius="0.75rem" class="w-full h-20!" />
          <Skeleton
            v-for="i in 5"
            :key="i"
            borderRadius="0.75rem"
            class="w-[90%]! h-5! md:h-10!"
            :class="getRandomSize()"
          />
        </div>
        <div
          v-for="(item, i) in shownChanges"
          :key="i"
          class="flex flex-col w-full reveal right keep"
        >
          <div v-if="i != 0" class="w-full md:invisible">
            <Divider class="w-full opacity-10" style="--p-divider-border-color: #000" />
          </div>
          <Changelog :changeInfo="item" />
        </div>
      </div>

      <Button
        v-if="allChanges.length > 0 && shownChanges.length != allChanges.length"
        text="Mostrar más cambios"
        @click="loadMore()"
        class="mt-5"
      />
    </div>
  </div>
</template>
