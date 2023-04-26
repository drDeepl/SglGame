<template>
  <n-space vertical class="code-mirror-wrapper">
    <Codemirror
      v-model:value="code"
      :options="cmOptions"
      border
      placeholder="Введи запрос..."
      height="13vh"
      min-width="20em"
    />
    <n-space class="codeblock-action">
      <n-button :loading="loadApply" @click="onClickRunCode"
        >Выполнить</n-button
      >
      <n-button :disabled="loadApply" @click="onClickClearCode"
        >Очистить</n-button
      >
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
    onClickRunCodeFunc: {type: Function, required: false},
    onClickClearCodeFunc: {type: Function, required: false},
    loadApply: {type: Boolean, required: false},
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
      this.onClickClearCodeFunc()
    }
  }
});
</script>
