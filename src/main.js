import { createApp } from "vue";
import App from "./App.vue";
import FormDialog from "@/components/FormDialog.vue";
import "./assets/main.scss";

const app = createApp(App);
app.component("c-form", FormDialog);
app.mount("#app");

// app.use(createVuestic({config: config}));
