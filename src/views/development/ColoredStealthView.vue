<script setup lang="ts">
import ParallaxBanner from "@/components/content/ParallaxBanner.vue";
import bannerImg from "@/assets/imgs/CSBanner.png";
import SwappedCards from "@/components/content/SwappedCards.vue";
const cards = [
  {
    title: "¿Qué es Colored Stealth?",
    content:
      "Colored Stealth es el nombre en clave de un proyecto a manos de [@Jeffrowo](/developer), que tiene el fin de recopilar los productos/proyectos distribuídos por su creador al público.",
    mediaSvg: "/svg/coloredstealth.svg",
    mediaFill: "#1a3d09",
    mediaStroke: "#1a3d09",
  },
  {
    title: "Jeffrey Bot x Colored Stealth",
    content: `**Jeffrey Bot** inició como un proyecto personal de Jeff con el fin de administrar su servidor de Discord.\\n\\nLuego con el tiempo se decidió que sería un buena idea iniciar el proceso para que Jeffrey Bot esté disponible al público en el futuro. Y así se volvió parte de 'Colored Stealth'.`,
    media: "/imgs/jb_logo.png",
  },
  {
    title: "Acceso anticipado",
    content: `**Jeffrey Bot** está en contados servidores de Discord actualmente. Uno de ellos es el [servidor de Jeff](/discord). Eres libre de unirte y hablar con la gente si gustas. [w](Aunque últimamente, aquí entre nos... Jeff lo tiene bastante abandonado. Sigue ahí, pero no hay muchas cosas nuevas. Tampoco ayuda que Jeff no hace nada ni en YouTube ni Twitch)[/w]\\n\\nCabe aclarar que este servidor **NO** es de Jeffrey Bot, es del desarrollador. Jeffrey Bot sólo está ahí como base para que todo el server funcione y sea interactivo con la comunidad de Jeff.\\n\\nSi consigues VIP en el [servidor de Jeff](!/discord), podrías ser __Beta Tester__ de **Jeffrey Bot** para versiones futuras.`,
    mediaSvg: "/svg/discord.svg",
  },
  {
    title: "¿Cuándo será público finalmente?",
    content: `No está claro... y por eso, "Jeffrey Bot siempre está en desarrollo".\\n\\nEl proceso de reescritura de la base del bot está en proceso y avanza bastante bien.\\n\\nSin embargo, también está el tema del hosting y mantenimiento del proyecto.`,
  },
];
</script>

<template>
  <div class="flex w-full flex-col">
    <ParallaxBanner title="Colored Stealth" :bannerImg="bannerImg" />
    <SwappedCards :cards="cards" />
  </div>
</template>
