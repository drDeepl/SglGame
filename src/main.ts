import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuestic } from "vuestic-ui";
import "vuestic-ui/css";

import App from "./App.vue";
import router from "./router";

import "./assets/main.scss";
import { createVuesticEssential, VaButton } from "vuestic-ui";
import "vuestic-ui/styles/essential.css";
import "vuestic-ui/styles/grid.css";
import "vuestic-ui/styles/reset.css";
import "vuestic-ui/styles/typography.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(createVuestic());

app.use(
  createVuesticEssential({
    config: {
      colors: {
        variables: {
          primary: "#5a6170",
          secondary: "#fff",
          success: "#43d681",
          danger: "#ee4540",
        },
      },
    },
    components: { VaButton },
  })
);
app.mount("#app");
