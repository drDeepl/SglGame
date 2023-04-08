<template>
  <Codemirror
    v-model:value="code"
    :options="cmOptions"
    border
    placeholder="Введи свой запрос здесь..."
    height="13vh"
    width="35vw"
    @change="OnClickChange"
/></template>

<script lang="ts">
import {defineComponent} from 'vue';
import {ref} from 'vue';

import Codemirror from 'codemirror-editor-vue3';
import 'codemirror/addon/display/placeholder.js';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/addon/display/placeholder.js';
import 'codemirror/theme/dracula.css';
export default defineComponent({
  components: {Codemirror},
  setup() {
    const code = ref(``);

    return {
      code,
      cmOptions: {
        mode: 'sql', // Language mode
        theme: 'dracula' // Theme
      }
    };
  },
  methods: {
    onClickChange() {
      console.log('OnClickChange');
    }
  }
});
</script>
