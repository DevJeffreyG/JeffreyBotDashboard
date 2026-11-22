<script setup lang="ts">
import { useApi } from "@/api/useApi";
import LoadingCircle from "@/components/content/LoadingCircle.vue";
import { parseMarkdown } from "@/utils/markdown";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
const loading = ref(true);
const route = useRoute();
const errorMessage = ref<string | null>(null);
const router = useRouter();

onMounted(async () => {
  const code = route.query.code as string;
  const error = route.query.error as string;

  if (error) {
    errorMessage.value = "Acceso denegado o cancelado por el usuario.";
    loading.value = false;
    return;
  }

  if (!code) {
    errorMessage.value = "No se encontró ningún código de autorización.";
    loading.value = false;
    return;
  }

  try {
    const { data, error } = await useApi("/api/discord/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    }).json();

    if (error.value) {
      console.log(error);
      if (error.value.message.includes("NetworkError"))
        throw new Error(
          "No nos pudimos comunicar con [Jeffrey Bot](/status!). Intenta de nuevo más tarde."
        );
      else throw error.value;
    }

    if (!data.value) {
      throw new Error("El servidor no devolvió los datos de autenticación.");
    }

    router.push("/dashboard");
  } catch (err: any) {
    errorMessage.value = parseMarkdown(err.message) || "Ocurrió un error inesperado.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full p-5 min-h-[60vh] gap-10">
    <h1 v-if="loading" class="text-3xl md:text-5xl font-bold">Iniciando sesión...</h1>
    <h1 v-if="errorMessage" class="text-3xl md:text-5xl font-bold">
      Error iniciando sesión
    </h1>
    <LoadingCircle v-if="loading" />
    <p v-if="errorMessage" class="text-red-500" v-html="errorMessage"></p>
    <p v-if="!loading && !errorMessage">Redirigiendo...</p>
  </div>
</template>
