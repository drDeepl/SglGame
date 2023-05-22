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

    <n-collapse-transition :show="getErrors.length > 0">
      <n-alert
        v-if="getErrors.length > 0"
        title="Что-то пошло не так..."
        type="error"
        closable
        @close="$store.commit('story/CLEAR_ERRORS')"
      >
        <n-space vertical>
          <span v-for="(error, id) in getErrors" :key="id">{{ error }}</span>
        </n-space>
      </n-alert>
    </n-collapse-transition>
    <n-space class="codeblock-action">
      <n-popover trigger="hover" class="border-left-red">
        <template #trigger>
          <div>
            <n-button
              :disabled="!codeIsValid"
              :loading="loadApply"
              @click="onClickRunCode"
            >
              Выполнить
            </n-button>
          </div>
        </template>

        <span class="primary-font-color">
          {{ codeIsValid ? 'Получить таблицу' : 'Некорретный запрос' }}
        </span>
      </n-popover>
      <n-button :disabled="loadApply" @click="onClickClearCode"
        >Очистить</n-button
      >
    </n-space>
  </n-space>
  <slot></slot>
</template>

<script lang="js">
import {defineComponent} from 'vue';
// import {ref} from 'vue';
import {logR} from '@/services/utils';
import Codemirror from 'codemirror-editor-vue3';
import 'codemirror/addon/display/placeholder.js';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/addon/display/placeholder.js';
import 'codemirror/theme/idea.css';
import parser from 'js-sql-parser';

export default defineComponent({
  components: {Codemirror},
  props: {
    onClickRunCodeFunc: {type: Function, required: false},
    onClickClearCodeFunc: {type: Function, required: false},
    loadApply: {type: Boolean, required: false},
    errorsMsg: {type: Array, required: false, default(){return []}}
  },
  data(){
    return{
      codeIsValid: true,

      code: '',
      cmOptions: {
        mode: 'sql', // Language mode
        theme: 'idea' // Theme
      }
    }
  },

  watch:{
    // code(value){
    //   this.codeIsValid = false;
    //   const lowerCaseValue = value.toLowerCase();
    //   const isValidQuery = /(select)+.+(from)\s+./.test(lowerCaseValue);
    //   // console.log(isValidQuery);
    //   if(isValidQuery){

    //     console.log(`Decard: ${isDecard}`)
    //     const isHaveJoin = /\s(cross)|(outer)\s(join)\s/.test(lowerCaseValue);
    //     if(isHaveJoin){
    //       console.log(`Is have join: ${isHaveJoin}`)
    //       return
    //     }
    //     this.codeIsValid = true;

    //   }
    // }
  },
  computed: {
    getErrors(){
      return this.$store.state.story.errors
    }
  },
  methods: {
    async onClickRunCode() {
      logR("warn", "CodeMirror: onClickRunCode");
      this.$store.commit('story/CLEAR_ERRORS');
      let errors = [];
      const lowerCaseValue = this.code.toLowerCase();
      const isValidQuery = /(select)+.+(from)\s+./.test(lowerCaseValue);
      console.log("query is valid" + isValidQuery);
      if(isValidQuery){
        const isHaveJoin = /\s(cross)|(outer)\s(join)\s/.test(lowerCaseValue);
        if(isHaveJoin){
          console.log(`Is have join: ${isHaveJoin}`)
          errors.push("Декартово произведение таблиц запрещено");
          this.$store.commit('story/SET_ERRORS', errors);
        }
        else{
        try {
        const ast = parser.parse(this.code);
        const selectCount = ast.value.selectItems.value.length;
        const fromCount = ast.value.from.value.length;
        // console.log(`SELECT COUNT: ${selectCount}\nFROM COUNT: ${fromCount}`);
        if(selectCount > 1){

          errors.push('За один раз можно выполнить только один запрос c SELECT')
        }
      else if(fromCount > 1){
          errors.push("Объединение таблиц запрещено")
        }
        else{
          await this.onClickRunCodeFunc(this.code);
        }

      } catch (e) {
        errors.push('За один раз возможно выполнить только один запрос');
      }
      finally{
        this.$store.commit('story/SET_ERRORS', errors);
      }
    }
      }
      else{
        errors.push('Некорректный запрос');
        this.$store.commit('story/SET_ERRORS', errors);

      }

    },
    onClickClearCode(){
      logR('warn', 'CodeMirror: onClickClearCode');
      this.code = "";
      this.onClickClearCodeFunc()
    }
  }
});
</script>
