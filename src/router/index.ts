import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import NotFoundView from "@/views/errors/NotFoundView.vue";

import { redirects } from "./redirects";
import { routes as developmentRoutes } from "@/views/development/routes";
import { routes as jeffreybotRoutes } from "@/views/jeffreybot/routes";
import { routes as dashboardRoutes } from "@/views/dashboard/routes";
import { routes as apiRoutes } from "@/views/api/routes";
import { routes as functionRoutes } from "@/views/functions/routes";
import RedirectView from "@/views/RedirectView.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: HomeView,
        meta: { title: "Inicio" }
    },
    ...redirects.map((r) => ({
        path: r.path,
        name: `Redirigiendo ${r.path}`,
        component: RedirectView,
        meta: { title: "Redirigiendo..." }
    })),
    ...functionRoutes,
    ...developmentRoutes,
    ...jeffreybotRoutes,
    ...dashboardRoutes,
    ...apiRoutes,
    {
        path: "/:pathMatch(.*)*",
        name: "Not Found",
        component: NotFoundView,
        meta: { title: "404" }
    }
];

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        return { top: 0, behavior: "smooth" };
    },
    routes
});

router.beforeEach((to) => {
    const externalRedirect = redirects.find((redirect) => redirect.path === to.path);

    if (externalRedirect) {
        document.title = "Redirigiendo... | Jeffrey Bot";
        window.location.href = externalRedirect.url;
        return false;
    }

    const pageTitle = to.meta.title || 'Colored Stealth';
    document.title = `${pageTitle} | Jeffrey Bot`;
});

router.afterEach((to) => {
    const pageTitle = to.meta.title || 'Colored Stealth';
    document.title = `${pageTitle} | Jeffrey Bot`;
});

export default router;