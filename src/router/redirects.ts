export const redirects = [
    {
        path: "/status",
        url: "https://stats.uptimerobot.com/oOR4JiDYNj",
    },
    {
        path: "/login",
        url: `https://discord.com/api/oauth2/authorize?client_id=${import.meta.env.VITE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_DISCORD_REDIRECT_URI}&response_type=code&scope=guilds+identify`,
    }
];
