import { createApp } from 'vue';
import { toast } from 'mhz-ui';
import { VueQueryPlugin, vueQueryOptions, setBaseURL } from 'mhz-helpers';

import App from '@/common/components/App.vue';

import { i18n } from '@/common/plugins';
import { router } from '@/common/router';
import { TOKEN_NAME } from '@/auth/constants';
import { URL_HOME } from '@/common/constants';

import '@/common/styles/main.scss';

const app = createApp(App);

app.use(router);
app.use(VueQueryPlugin, vueQueryOptions(toast, URL_HOME, TOKEN_NAME));
app.use(i18n);

setBaseURL(import.meta.env.VITE_API);

app.mount('#app');
