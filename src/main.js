import {createApp} from 'vue';
import App from './App.vue';
import FormDialog from '@/components/FormDialog.vue';
import './assets/main.scss';
import {NButton, NSpace} from 'naive-ui';
const app = createApp(App);

app.component('n-space', NSpace);
app.component('n-button', NButton);
app.component('c-form', FormDialog);
app.mount('#app');

// app.use(createVuestic({config: config}));
