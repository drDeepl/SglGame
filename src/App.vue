<template>
  <div id="app">
    <MainLayer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MainLayer from "@/layers/MainLayer.vue";
export default defineComponent({
  components: { MainLayer },
  data() {
    return {};
  },
});
</script>
