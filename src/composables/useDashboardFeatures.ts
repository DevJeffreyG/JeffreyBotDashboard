import { useApi } from "@/api/useApi";
import {
  OptionEffects,
  type DashboardFeature,
  type DashboardFeatures,
  type OptionEffect,
} from "@/types/DashboardFeatures";
import { computed, ref } from "vue";

type FeatureInfo = {
  effect: OptionEffect;
  description?: string;
};

/** Las features son globales: se cargan una sola vez para toda la dashboard. */
const features = ref<DashboardFeatures>({});
let request: Promise<void> | null = null;

function ensureLoaded(): Promise<void> {
  if (request) return request;

  request = (async () => {
    try {
      const { data, response } = await useApi(
        "/api/db/global/dashboard-features"
      ).json<DashboardFeatures>();

      if (response.value?.status === 200 && data.value && typeof data.value === "object") {
        features.value = data.value;
      }
    } catch (error) {
      console.error("No se pudieron cargar los efectos de la dashboard:", error);
    }
  })();

  return request;
}

const featuresByPath = computed(() => {
  const map = new Map<string, FeatureInfo>();
  const groups: Array<[OptionEffect, DashboardFeature[] | undefined]> = [
    [OptionEffects.New, features.value.new],
    [OptionEffects.Featured, features.value.featured],
    [OptionEffects.Recommended, features.value.recommended],
  ];

  for (const [effect, list] of groups) {
    for (const feature of list ?? []) {
      if (!feature?.path) continue;
      // Un path en varios grupos se queda con el primero (New > Featured > Recommended).
      if (!map.has(feature.path)) {
        map.set(feature.path, { effect, description: feature.description });
      }
    }
  }

  return map;
});

export function useDashboardFeatures() {
  void ensureLoaded();

  /** Busca por la ruta completa y por la del schema (con/sin prefijo). */
  function featureFor(...paths: string[]): FeatureInfo | undefined {
    for (const path of paths) {
      const found = featuresByPath.value.get(path);
      if (found) return found;
    }
    return undefined;
  }

  function effectFor(...paths: string[]): OptionEffect {
    return featureFor(...paths)?.effect ?? OptionEffects.None;
  }

  return { features, featureFor, effectFor };
}
