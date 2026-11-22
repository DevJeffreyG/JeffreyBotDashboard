import type { SettingsSchemaConfig } from "@/composables/useSettingsSchema";

/**
 * Definición de una sección de settings.
 * Para crear otra sección del mismo tipo sólo hace falta agregar una entrada aquí
 * y usar `SchemaSettingsView` con ella.
 */
export const activeModulesSettings: SettingsSchemaConfig = {
  schemaPath: "active-modules",
  pathPrefix: "active_modules",
  description:
    "Activa o desactiva los módulos que deseas que Jeffrey Bot tenga en el servidor. Desactivar un módulo puede que vuelva irrelevantes otras configuraciones.",

  groups: [
    { sectionName: "Funciones", filter: "functions" },
    { sectionName: "Audit Logs", filter: "logs.guild" },
    { sectionName: "Logs de moderación", filter: "logs.moderation" },
    { sectionName: "Logs de STAFF", filter: "logs.staff" },
    { sectionName: "Logs de DarkShop", filter: "logs.darkshop" },
  ],

  read: {
    endpoint: (guildId) => `/api/db/guilds/${guildId}/bulkActiveModules`,
  },
  write: {
    endpoint: (guildId) => `/api/db/guilds/${guildId}/bulkActiveModules`,
    method: "PATCH",
  }
};

export const quantitiesSettings: SettingsSchemaConfig = {
  schemaPath: "quantities",
  pathPrefix: "quantities",
  description:
    "Configura los límites y porcentajes de las funciones de Jeffrey Bot. Algunos valores pueden afectar la economía del servidor.",

  groups: [
    { sectionName: "Awards", filter: "awards" },
    { sectionName: "Blackjack", filter: "blackjack" },
    { sectionName: "DarkShop", filter: "darkshop" },
    { sectionName: "Límites", filter: "limits" },
    { sectionName: "Porcentajes", filter: "percentages" },
    { sectionName: "Misc", filter: ["interest_days", "currency_per_rep", "adjust_ratio"] },
    { sectionName: "Ignorar notificaciones (DEV, WIP)", filter: "ignore_notifications" },
  ],

  read: {
    endpoint: (guildId) => `/api/db/guilds/${guildId}/bulkQuantities`
  },
  write: {
    endpoint: (guildId) => `/api/db/guilds/${guildId}/bulkQuantities`,
    method: "PATCH",
  }
};