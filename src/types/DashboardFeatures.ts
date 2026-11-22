/** Efectos visuales de los selectores (equivalente a `Selector.Effects` de master). */
export const OptionEffects = {
  None: "none-effect",
  New: "new-effect",
  Featured: "featured-effect",
  Recommended: "recommended-effect",
} as const;

export type OptionEffect = (typeof OptionEffects)[keyof typeof OptionEffects];

export type DashboardFeature = {
  path: string;
  /** Texto del tooltip; reemplaza el tooltip por defecto del efecto. */
  description?: string;
};

/** Respuesta de GET /api/db/global/dashboard-features (`info`). */
export type DashboardFeatures = {
  new?: DashboardFeature[];
  featured?: DashboardFeature[];
  recommended?: DashboardFeature[];
};
