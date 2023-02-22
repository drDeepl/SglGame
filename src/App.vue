<template id="app">
  <va-navbar color="secondary pa-0">
    <template #left>
      <v-navbar-item>SQL Game</v-navbar-item>
    </template>

    <template #right>
      <va-button round size="small"
        ><va-avatar color="danger">?</va-avatar></va-button
      >
      <v-navbar-item>Account</v-navbar-item>
    </template>
  </va-navbar>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {};
  },
});
</script>
