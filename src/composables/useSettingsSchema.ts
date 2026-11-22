import { useApi } from "@/api/useApi";
import type { DiscordGuild } from "@/types/Guild";
import type { MongoHelper } from "@/types/MongoSchemas";
import { computed, ref, toValue, watch, type MaybeRefOrGetter } from "vue";

/** Valores guardados en la DB, indexados por la ruta completa del setting. */
export type SettingsValues = Record<string, unknown>;

/** Un setting editado respecto al valor inicial. */
export type SettingsChange = {
  path: string;
  value: unknown;
};

/** Grupo visual de settings dentro de una sección. */
export type SettingsGroupConfig = {
  sectionName: string;
  /** Fragmento(s) del `path` del schema que pertenecen a este grupo. */
  filter: string | string[];
};

export type SettingsReadConfig = {
  endpoint: (guildId: string) => string;
  /** Permite overridear los headers por defecto (`Content-Type` y `module-paths`). */
  headers?: (paths: string[]) => Record<string, string>;
};

export type SettingsWriteConfig = {
  endpoint: (guildId: string) => string;
  method?: "POST" | "PUT" | "PATCH";
  /** Por defecto: `{ changes: [{ path, value }] }`. */
  body?: (changes: SettingsChange[]) => unknown;
};

/**
 * Configuración declarativa de una sección basada en un schema de Mongo.
 * Cada sección sólo define de dónde leer/escribir y cómo agrupar los settings.
 */
export type SettingsSchemaConfig = {
  /** Último tramo de `/api/db/schema/guilds/:schemaPath`. */
  schemaPath: string;
  /** Prefijo de las rutas en la DB, p. ej. `active_modules`. */
  pathPrefix?: string;
  /** Texto descriptivo mostrado en la cabecera de la sección. */
  description?: string;
  groups: SettingsGroupConfig[];
  read?: SettingsReadConfig;
  write?: SettingsWriteConfig;
};

export type UseSettingsSchemaOptions = {
  guild: MaybeRefOrGetter<DiscordGuild | null | undefined>;
  config: MaybeRefOrGetter<SettingsSchemaConfig>;
};

function toArray(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value];
}

function buildPath(prefix: string, path: string): string {
  return prefix ? `${prefix}.${path}` : path;
}

/**
 * Lógica compartida por las secciones de configuración de la dashboard:
 * carga del schema, carga de los valores iniciales, detección de cambios y guardado.
 */
export function useSettingsSchema(options: UseSettingsSchemaOptions) {
  const schema = ref<MongoHelper[]>([]);
  const initialValues = ref<SettingsValues>({});
  const currentValues = ref<SettingsValues>({});
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<unknown>(null);

  let activeLoad = 0;

  const config = computed(() => toValue(options.config));
  const pathPrefix = computed(() => config.value.pathPrefix ?? "");
  const allPaths = computed(() =>
    schema.value.map((helper) => buildPath(pathPrefix.value, helper.path))
  );

  /** Los filtros son secuencias de segmentos de la ruta (separados por `.`). */
  function pathMatchesFragment(path: string, fragment: string): boolean {
    const segments = path.split(".");
    const parts = fragment.split(".");

    return segments.some((_, index) =>
      parts.every((part, offset) => segments[index + offset] === part)
    );
  }

  const groups = computed(() => {
    // Cada helper se asigna a un solo grupo: gana el fragmento más específico
    // (el más largo). En empate se queda el grupo declarado primero.
    const assignments = schema.value.map((helper) => {
      let bestIndex = -1;
      let bestLength = -1;

      config.value.groups.forEach((group, index) => {
        for (const fragment of toArray(group.filter)) {
          if (!pathMatchesFragment(helper.path, fragment)) continue;
          if (fragment.length > bestLength) {
            bestIndex = index;
            bestLength = fragment.length;
          }
        }
      });

      return { helper, index: bestIndex };
    });

    return config.value.groups.map((group, index) => ({
      sectionName: group.sectionName,
      helpers: assignments
        .filter((assignment) => assignment.index === index)
        .map((assignment) => assignment.helper),
    }));
  });

  /** Valor inicial de un helper, con soporte para rutas con o sin prefijo. */
  function initialValueFor(helper: MongoHelper): unknown {
    const path = helper.path;
    const fullPath = buildPath(pathPrefix.value, path);
    return (
      initialValues.value[fullPath] ??
      initialValues.value[path] ??
      helper.mongoInfo.defaultValue
    );
  }

  const changes = computed<SettingsChange[]>(() => {
    const pending: SettingsChange[] = [];

    for (const helper of schema.value) {
      const fullPath = buildPath(pathPrefix.value, helper.path);
      if (!Object.prototype.hasOwnProperty.call(currentValues.value, fullPath)) continue;

      const value = currentValues.value[fullPath];
      if (value !== initialValueFor(helper)) {
        pending.push({ path: fullPath, value });
      }
    }

    return pending;
  });

  const hasChanges = computed(() => changes.value.length > 0);

  function reset() {
    const values: SettingsValues = {};

    for (const helper of schema.value) {
      values[buildPath(pathPrefix.value, helper.path)] = initialValueFor(helper);
    }

    currentValues.value = values;
  }

  async function fetchSchema() {
    const { data, response } = await useApi(
      `/api/db/schema/guilds/${config.value.schemaPath}`,
      { headers: { "Content-Type": "application/json" } }
    ).json<MongoHelper[]>();

    if (response.value?.status !== 200 || !Array.isArray(data.value)) {
      throw new Error(
        `No se pudo cargar el schema "${config.value.schemaPath}" (${response.value?.status ?? "sin respuesta"})`
      );
    }

    schema.value = data.value;
  }

  async function fetchValues(guildId: string) {
    const paths = allPaths.value;
    const endpoint =
      config.value.read?.endpoint?.(guildId) ??
      `/api/db/guilds/${guildId}/bulkActiveModules`;
    const headers = {
      "Content-Type": "application/json",
      "module-paths": JSON.stringify(paths),
      ...config.value.read?.headers?.(paths),
    };

    const { data, response } = await useApi(endpoint, { headers }).json<SettingsValues>();

    if (response.value?.status !== 200 || !data.value || typeof data.value !== "object") {
      throw new Error(
        `No se pudieron cargar los valores iniciales (${response.value?.status ?? "sin respuesta"})`
      );
    }

    initialValues.value = data.value;
  }

  async function load() {
    const guild = toValue(options.guild);
    if (!guild) return;

    // Evita que una carga antigua sobrescriba los datos del guild recién seleccionado.
    const loadId = ++activeLoad;
    isLoading.value = true;
    error.value = null;

    try {
      await fetchSchema();
      if (loadId !== activeLoad) return;

      await fetchValues(guild.id);
      if (loadId !== activeLoad) return;

      reset();
    } catch (err) {
      if (loadId !== activeLoad) return;
      error.value = err;
      console.error("Error cargando la configuración:", err);
    } finally {
      if (loadId === activeLoad) isLoading.value = false;
    }
  }

  function setOption(path: string, value: unknown) {
    currentValues.value[path] = value;
  }

  function discardChanges() {
    reset();
  }

  async function save(): Promise<boolean> {
    const guild = toValue(options.guild);
    const write = config.value.write;
    if (!guild || !write || !hasChanges.value) return false;

    const pending = changes.value;
    isSaving.value = true;
    error.value = null;

    try {
      const { response } = await useApi(write.endpoint(guild.id), {
        method: write.method ?? "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(write.body ? write.body(pending) : { changes: pending }),
      });

      if (!response.value?.ok) {
        throw new Error(
          `No se pudo guardar la configuración (${response.value?.status ?? "sin respuesta"})`
        );
      }

      for (const change of pending) {
        initialValues.value[change.path] = change.value;
      }
      reset();

      return true;
    } catch (err) {
      error.value = err;
      console.error("Error guardando la configuración:", err);
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  watch(
    () => toValue(options.guild)?.id ?? null,
    (guildId) => {
      if (!guildId) {
        ++activeLoad;
        schema.value = [];
        initialValues.value = {};
        currentValues.value = {};
        error.value = null;
        isLoading.value = false;
        return;
      }

      void load();
    },
    { immediate: true }
  );

  return {
    schema,
    groups,
    allPaths,
    values: currentValues,
    initialValues,
    changes,
    hasChanges,
    isLoading,
    isSaving,
    error,
    load,
    setOption,
    discardChanges,
    save,
  };
}
