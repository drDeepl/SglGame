import {createApp} from 'vue';
import App from './App.vue';
import {Dismiss28Regular} from '@vicons/fluent';
import './assets/main.scss';
import {NSpin, NButton, NSpace} from 'naive-ui';
const app = createApp(App);

app.component('n-spin', NSpin);
app.component('icon-close', Dismiss28Regular);
app.component('n-space', NSpace);
app.component('n-button', NButton);
// app.component('c-form', FormDialog);
app.mount('#app');

// app.use(createVuestic({config: config}));
