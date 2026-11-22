export const routes = [
  {
    path: '/tos',
    alias: ['/terms'],
    name: 'Terms',
    component: () => import('@/views/jeffreybot/TermsView.vue'),
    meta: { title: 'ToS' }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/jeffreybot/PrivacyView.vue'),
    meta: { title: 'Privacidad' }
  },
  {
    path: '/changelog/:version?',
    alias: ['/changelogs', '/changelogs/:version?'],
    name: 'Changelog',
    component: () => import('@/views/jeffreybot/ChangelogView.vue'),
    meta: { title: 'Changelog' }
  },
  {
    path: '/community',
    alias: ['/credits'],
    name: 'Community',
    component: () => import('@/views/EmptyView.vue'),
    meta: { title: 'Comunidad' }
  }
]