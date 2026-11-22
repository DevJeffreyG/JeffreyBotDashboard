<script setup lang="ts">
import { useApi } from "@/api/useApi";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(async () => {
  const { response } = await useApi("/api/discord/logout", {
    method: "GET",
    credentials: "include",
  }).json();

  if (response.value?.status === 401) {
    console.log("User is not logged in.");
  } else if (response.value?.status === 200) {
    console.log("User logged out successfully.");
  } else {
    console.error("Unexpected response:", response.value);
  }

  window.dispatchEvent(new Event("auth-changed"));
  router.replace("/");
});
</script>

<template>
  <div class="flex flex-col w-full justify-center items-center mt-10 min-h-100">
    <h1 class="text-5xl font-bold">Logout</h1>
    <p>You have been logged out.</p>
  </div>
</template>
