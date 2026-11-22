import type { DiscordUser } from "@/types/User";

export type AuthJwtPayload = {
  sub?: string;
  id?: string;
  username?: string;
  global_name?: string;
  avatar?: string;
  dev?: boolean;
  iat?: number;
  exp?: number;
  user?: DiscordUser;
  [key: string]: unknown;
};

const SEGMENT_COUNT = 3;

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join("")
  );
}

export function decodeJwt(token: string): AuthJwtPayload {
  const segments = token.split(".");

  if (segments.length !== SEGMENT_COUNT || !segments[1]) {
    throw new Error("Token JWT inválido");
  }

  const payload: unknown = JSON.parse(decodeBase64Url(segments[1]));

  if (typeof payload !== "object" || payload === null) {
    throw new Error("Payload del JWT inválido");
  }

  return payload as AuthJwtPayload;
}

export function isExpired(payload: AuthJwtPayload, skewSeconds = 0): boolean {
  return (
    typeof payload.exp === "number" && Date.now() >= (payload.exp - skewSeconds) * 1000
  );
}

/**
 * Combina el usuario de la API con los claims firmados.
 * El claim `dev` firmado prevalece sobre el campo sin firmar.
 */
export function discordUserFromJwt(
  payload: AuthJwtPayload,
  fallback?: DiscordUser | null
): DiscordUser | null {
  const base: DiscordUser = payload.user ?? fallback ?? {
    id: "",
    username: "",
    global_name: "",
    avatar: "",
  };
  const id = payload.sub ?? payload.id ?? base.id;

  if (!id) return null;

  return {
    ...base,
    id,
    username: payload.username ?? base.username,
    global_name: payload.global_name ?? base.global_name,
    avatar: payload.avatar ?? base.avatar,
    dev: typeof payload.dev === "boolean" ? payload.dev : (base.dev ?? false),
  };
}
