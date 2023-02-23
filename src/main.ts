import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {createVuestic} from 'vuestic-ui';
import App from './App.vue';
import router from './router';

import './assets/main.scss';

import 'vuestic-ui/styles/essential.css';
import 'vuestic-ui/css';
import 'vuestic-ui/styles/grid.css';
import 'vuestic-ui/styles/reset.css';
import 'vuestic-ui/styles/typography.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(
  createVuestic({
    config: {
      colors: {
        variables: {
          primary: '#5a6170',
          secondary: '#fff',
          success: '#43d681',
          danger: '#ee4540',
          grey: '#565656'
        }
      }
    }
  })
);

app.mount('#app');
