<template>
  <n-space vertical>
    <Codemirror
      v-model:value="code"
      :options="cmOptions"
      border
      placeholder="Введи свой запрос здесь..."
      height="13vh"
    />
    <n-space class="codeblock-action">
      <n-button @click="onClickRunCode">Выполнить</n-button>
      <n-button @click="onClickClearCode">Очистить</n-button>
    </n-space>
  </n-space>
  <slot></slot>
</template>

<script lang="js">
import {defineComponent} from 'vue';
import {ref} from 'vue';
import {logR} from '@/services/utils';
import Codemirror from 'codemirror-editor-vue3';
import 'codemirror/addon/display/placeholder.js';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/addon/display/placeholder.js';
import 'codemirror/theme/idea.css';
export default defineComponent({
  components: {Codemirror},
  props: {
    onClickRunCodeFunc: {type: Function, required: false}
  },
  setup() {
    const code = ref(``);
    return {
      code,
      cmOptions: {
        mode: 'sql', // Language mode
        theme: 'idea' // Theme
      }
    };
  },
  methods: {
    async onClickRunCode() {
      logR("warn", "CodeMirror: onClickRunCode")
      await this.onClickRunCodeFunc(this.code);

    },
    onClickClearCode(){
      logR('warn', 'CodeMirror: onClickClearCode');
      this.code = "";
    }
  }
});
</script>
