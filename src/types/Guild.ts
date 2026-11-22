import type { DiscordChannel } from "./Channel";
import type { DiscordRole } from "./Role";

export type DiscordGuild = {
    id: string;
    name: string;
    icon: string | null;
    channels: DiscordChannel[];
    roles: DiscordRole[];
    lastFetch?: Date;
}