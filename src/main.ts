import { createApp } from 'vue'
import '@/assets/css/main.css'
import '@/assets/css/texts.css'

import App from './App.vue'
import router from './router/index.ts'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { initAnonymousSession } from './api/useApi.ts'

import moment from 'moment-timezone';
import "moment/dist/locale/es";
import Tooltip from 'primevue/tooltip';

export default moment;

moment.tz.setDefault("America/Bogota");
moment.locale("es");

async function initApp() {
    await initAnonymousSession()
    const app = createApp(App)
    app.use(PrimeVue, {
        theme: {
            preset: Aura,
        },
        license: import.meta.env.VITE_PRIMEUI
    });
    
    app.use(router)
    await router.isReady()
    
    app.directive('tooltip', Tooltip);
    app.mount('#app')
}

initApp();