import {createApp} from 'vue';
import App from './App.vue';
import store from '@/store';
import router from '@/router/index';
// import setupInterceptors from '@/services/setupInterceptors';

import {
  Dismiss28Regular,
  AddCircle20Regular,
  Add16Filled,
} from '@vicons/fluent';
import './assets/main.scss';

import FormDialog from '@/components/FormDialog.vue';
import {
  NPopconfirm,
  NSpin,
  NButton,
  NSpace,
  NModal,
  NCard,
  NProgress,
  NDataTable,
  NInput,
  NDrawer,
  NDrawerContent,
  NLayoutSider,
  NLayout,
  NLayoutHeader,
  NIcon,
  NLayoutContent,
  NPopover,
  NRate,
  NDialog,
  NAlert,
} from 'naive-ui';
import CodeBlock from '@/UI/CodeBlock.vue';
const app = createApp(App);

// setupInterceptors(store);
app.component('n-alert', NAlert);
app.component('n-dialog', NDialog);
app.component('n-rate', NRate);
app.component('n-popover', NPopover);
app.component('n-icon', NIcon);
app.component('n-layout-header', NLayoutHeader);
app.component('n-layout-sider', NLayoutSider);
app.component('n-layout-content', NLayoutContent);
app.component('n-layout', NLayout);
app.component('n-popconfirm', NPopconfirm);
app.component('n-drawer-content', NDrawerContent);
app.component('n-drawer', NDrawer);
app.component('n-data-table', NDataTable);
app.component('n-input', NInput);
app.component('n-progress', NProgress);
app.component('n-code-block', CodeBlock);
app.component('n-card', NCard);
app.component('n-modal', NModal);
app.component('c-form', FormDialog);
app.component('n-spin', NSpin);
app.component('icon-close', Dismiss28Regular);
app.component('icon-add', AddCircle20Regular);
app.component('icon-add-plus', Add16Filled);
app.component('n-space', NSpace);
app.component('n-button', NButton);

app.use(router);
app.use(store);
app.mount('#app');

// app.use(createVuestic({config: config}));
