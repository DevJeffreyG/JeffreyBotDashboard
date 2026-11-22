export const routes = [
    {
        path: '/api/discord-callback',
        name: 'DiscordCallback',
        component: () => import('@/views/api/DiscordCallback.vue'),
        meta: { title: 'Discord Callback' }
    },
    {
        path: '/logout',
        name: 'Logout',
        component: () => import('@/views/api/Logout.vue'),
        meta: { title: 'Logout' }
    }
]