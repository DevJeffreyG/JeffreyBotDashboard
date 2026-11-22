<script setup lang="ts">
import ParallaxBanner from "@/components/content/ParallaxBanner.vue";
import bannerImg from "@/assets/imgs/BANNER.png";
import SwappedCards from "@/components/content/SwappedCards.vue";
import type { SwappedCard } from "@/components/content/SwappedCards.vue";

let bd = new Date("12/29/2005");
const age = Math.floor((Date.now() - bd.getTime()) / 31536000000);

const cards = [
    {
        title: "Conoce al desarrollador",
        content: `Gabriel Páez es un estudiante de ${age} años de Colombia, apasionado por el dibujo, programación y entretenimiento.
    \\n\\n
    Gabriel siempre quiere hacerlo todo por su cuenta y por eso tarda en completar sus proyectos en mente.
    \\n\\n
    Su seudónimo en internet ha cambiado durante muchos años, sin embargo, siempre ha girado entorno a "Jeff": JeffTheCrack, JeffreyGMD, JeffreyG y más recientemente **Jeffrowo**.
    \\n\\nNaturalmente, puedes simplemente llamarlo Jeff ;)`,
        media: "/imgs/jeff.png",
        mediaClasses: "avatar",
    },
    {
        title: `El personaje "Jeff"`,
        content: `Jeffrey (Jeff) es el personaje (fursona), con el que Gabriel se representa en internet.
    \\n\\n
    Jeff es un zorro con colores naranja, blanco y verde en su mayoría. El color favorito de Gabriel es el verde y debía estar presente en su personaje, claro.
    \\n\\n
    El origen de su nombre es para otra ocasión. Sólo quédate con Jeff, que es más corto y fácil de decir :)`,
        media: "/imgs/JeffFoxRef.png",
        mediaPosition: "bottom",
    },
    {
        title: "Furry Fandom",
        content: `Al principio, Jeff estaba pensado en ser un zorro con colores naturales, pero con el tiempo fue evolucionando con patrones y colores diferentes.
    \\n\\n
    Gab creó a Jeff aproximadamente a finales de 2018, principios de 2019, cuando también comenzó a dibujar.
    \\n\\n
    No es secreto para nadie. Gab es parte del Furry Fandom, y si conoces sus otras redes, supongo que... ¿lo siento?
    \\n
    Y también, ¿cómo es que no te ha bloqueado...?
    \\n\\n
    *Y si no las conoces, te lo ahorro, es... [w](acércate...)[/w] ¡+18...! :O*
    \\n
    *No quieres encontrar eso. Él prefiere mantener esa personalidad separada de lo que normalmente muestra en redes. Además, ya es suficiente con su perfil público, ¿no crees?*
    \\n\\n
    *;3*`,
        textAlign: "left",
    },
    {
        title: "El trayecto del dibujo",
        content: `Sí... Gab ha estado dibujando desde el 2018 ya, cómo pasa el tiempo... ¿Quién hubiese sabido que el mismo tipo que odiaba las clases de arte en 2013 terminaría siendo artista [w]furry[/w]?
    \\n\\n
¿Sabías que las miniaturas de YouTube dónde aparece Jeff fueron todas dibujadas por Gab? Es más, aún recuerdo cómo tardaba meses en publicar un vídeo por estar perfeccionando la miniatura. Es cómo si hubiese sido ayer... [w]¿Qué? ¿qué pasa, qué me ves?[/w]
    \\n\\n
Todo lo que tenga a Jeff (o cualquier personaje que no sea una imagen sacada de internet) fue dibujado por Gab. Fotos de perfil, banners, miniaturas, iconos de Discord, emotes de Discord, todo. ¡Hasta el mismo personaje de Jeffrey Bot...!
    \\n\\n
Es lo que pasa cuando no tienes dinero, y tienes un personaje que necesita mostrarse... ¡aprendes a dibujar por necesidad! [w](Y no me arrepiento, la verdad)[/w]`,
        textAlign: "left",
    },
    {
        title: "Eso es todo, ¡por ahora!"
    }
] satisfies SwappedCard[];
</script>

<template>
  <div class="flex w-full flex-col">
    <ParallaxBanner title="Desarrollador" :bannerImg="bannerImg" />
    <SwappedCards :cards="cards" />
  </div>
</template>
