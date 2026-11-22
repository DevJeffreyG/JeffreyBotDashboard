export const routes = [
    {
        path: "/dashboard",
        name: "Servidor",
        component: () => import("@/views/dashboard/ServerSelectView.vue"),
        meta: { title: "Seleccionar Servidor" }
    },
    {
        path: "/dashboard/:guildId/:section?",
        name: "Dashboard",
        component: () => import("@/views/dashboard/DashboardView.vue"),
        meta: { title: "Dashboard" }
    }
]