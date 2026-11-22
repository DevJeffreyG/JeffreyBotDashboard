export const routes = [
    {
        path: '/coloredstealth',
        name: 'Colored Stealth',
        component: () => import('@/views/development/ColoredStealthView.vue'),
        meta: { title: 'Colored Stealth' }
    },
    {
        path: '/developer',
        name: 'Developer',
        component: () => import('@/views/development/DeveloperView.vue'),
        meta: { title: 'Desarrollador' }
    },
    {
        path: '/projects',
        name: 'Projects',
        component: () => import('@/views/EmptyView.vue'),
        meta: { title: 'Proyectos' }
    }
]