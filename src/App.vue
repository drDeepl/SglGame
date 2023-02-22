<template id="app">
  <va-navbar color="primary">
    <template #left>
      <v-navbar-item>Logo</v-navbar-item>
    </template>

    <template #right>
      <va-button><va-avatar color="danger">?</va-avatar></va-button>
      <v-navbar-item>Account</v-navbar-item>
    </template>
  </va-navbar>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {};
  },
});
</script>
