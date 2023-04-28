import {createApp} from 'vue';
import App from './App.vue';

import Vuex from 'vuex';
import message from '@/store/module.message';

import {Dismiss28Regular} from '@vicons/fluent';
import './assets/main.scss';

import Form from '@/components/FormDialog.vue';
import {NPopconfirm, NSpin, NButton, NSpace} from 'naive-ui';
const app = createApp(App);

app.component('c-form', Form);
app.component('n-popconfirm', NPopconfirm);
app.component('n-spin', NSpin);
app.component('icon-close', Dismiss28Regular);
app.component('n-space', NSpace);
app.component('n-button', NButton);
// app.component('c-form', FormDialog);
app.use(Vuex);
app.use(message);
app.mount('#app');

// app.use(createVuestic({config: config}));
