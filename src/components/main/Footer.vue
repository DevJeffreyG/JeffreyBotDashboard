<script setup lang="ts">
import { RouterLink } from "vue-router";
import JumpTopButton from "@/components/buttons/JumpTopButton.vue";
</script>

<template>
  <div
    class="flex flex-col bg-content-contrast w-full min-h-50 md:min-h-65 mt-auto md:pt-3"
  >
    <div class="flex flex-col md:flex-row w-full h-full p-10">
      <div class="flex flex-col flex-1/4 w-full mb-5 md:mb-0 md:mr-10 lg:mr-0">
        <h1 class="text-4xl font-bold">Jeffrey Bot</h1>
        <p>Tu bot de Discord multifuncional de confianza.</p>
      </div>
      <div
        class="flex flex-col gap-10 flex-3/4 md:flex-row md:justify-evenly md:gap-30 md:w-[70%]"
      >
        <div class="flex flex-col gap-3">
          <h2>Funciones</h2>
          <ul class="text-xs flex flex-col gap-3">
            <RouterLink to="/functions/moderation">
              <li>Moderación</li>
            </RouterLink>
            <RouterLink to="/functions/administration">
              <li>Administración</li>
            </RouterLink>
            <RouterLink to="/functions/fun">
              <li>Diversión</li>
            </RouterLink>
            <RouterLink to="/functions/social">
              <li>Social</li>
            </RouterLink>
            <RouterLink to="/functions/economy">
              <li>Economía</li>
            </RouterLink>
          </ul>
        </div>
        <div class="flex flex-col gap-3">
          <h2>Desarrollo</h2>
          <ul class="text-xs flex flex-col gap-3">
            <RouterLink to="/coloredstealth">
              <li>Acerca de Colored Stealth</li>
            </RouterLink>
            <RouterLink to="/developer">
              <li>Acerca del desarrollador</li>
            </RouterLink>
            <RouterLink to="/projects">
              <li>Otros proyectos</li>
            </RouterLink>
          </ul>
        </div>
        <div class="flex flex-col gap-3">
          <h2>Jeffrey Bot</h2>
          <ul class="text-xs flex flex-col gap-3">
            <a href="/status" target="_blank" rel="noopener noreferrer">
              <li>Status</li>
            </a>
            <RouterLink to="/#about">
              <li>Acerca de</li>
            </RouterLink>
            <RouterLink to="/changelogs">
              <li>Cambios recientes</li>
            </RouterLink>
            <RouterLink to="/tos">
              <li>Términos y Condiciones</li>
            </RouterLink>
            <RouterLink to="/privacy">
              <li>Política de Privacidad</li>
            </RouterLink>
            <RouterLink to="/community">
              <li>Aportes de la comunidad</li>
            </RouterLink>
          </ul>
        </div>
      </div>
      <div class="mt-10 w-full md:w-50 md:mt-0">
        <JumpTopButton />
      </div>
    </div>
    <div class="p-10 text-xs md:text-base text-center md:text-left">
      <p class="text-white/10">&copy; Colored Stealth 2018</p>
    </div>
  </div>
</template>
