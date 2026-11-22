export const routes = [
    {
        path: "/functions/:name",
        component: () => import("@/views/EmptyView.vue"),
        meta: { title: 'Funciones' }
    }
]