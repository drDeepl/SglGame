<template>
  <n-navbar>
    <n-space justify="end">
      <n-avatar
        @click="onClickAvatar"
        class="user__avatar"
        round
        :style="{backgroundColor: '#ee4540'}"
        >?</n-avatar
      >
      <div v-if="activateBlock.avatar" class="user-menu">
        <n-button>Вход</n-button>
        <n-button>Регистрация</n-button>
      </div>
    </n-space>
  </n-navbar>

  <div class="choice-history mb-5">
    <div
      class="card-history-main-layer"
      v-for="history in arrays.history"
      :key="history"
      @click="onClickHistory(history)"
    >
      <div class="card-title-history">history {{ history.title }}</div>
      <img
        class="card-history-img"
        :src="require('@/img/history_' + history.title + '.jpg')"
      />
    </div>
  </div>
  <div class="history-content__wrapper">
    <!-- // TODO: Добавить в отдельный компонент -->
    <div class="codemirror-container">
      <CodeBlock :onClickRunCodeFunc="onClickRunCode">
        <n-button @click="fakeData()">Случайные данные</n-button>
      </CodeBlock>
      <n-space justify="space-between">
        <n-input
          v-model:value="codemirror.answer"
          placeholder="Введи ответ.."
        ></n-input>
        <n-button>Отправить</n-button>
      </n-space>
      <n-data-table
        ref="table"
        v-if="codemirror.isWork"
        :columns="codemirror.columns"
        :data="codemirror.data"
        :pagination="codemirror.pagination"
      ></n-data-table>
    </div>
  </div>
  <n-modal
    v-model:show="forms.logIn.active"
    :mask-closable="false"
    title="Диалог"
  >
    <c-form
      title="Вход"
      :itemModel="forms.logIn.model"
      :toValidate="true"
      :hideProps="{role: true}"
    ></c-form>
  </n-modal>
  <n-modal
    v-if="history.active"
    v-model:show="history.active"
    :mask-closable="false"
  >
    <n-card
      class="card-main-layer border-top-yellow"
      :title="history.title"
      role="dialog"
      size="huge"
    >
      {{ history.description }}
      <template #footer>
        <n-button @click="history.active = false">Закрыть</n-button>
      </template></n-card
    >
  </n-modal>
  <!-- <Form
    v-if="forms.logIn.active"
    title="Вход"
    :itemModel="forms.logIn.model"
    :isActive="forms.logIn.active"
    :onClickCancelForm="onClickCancelLogin"
    :onClickApplyForm="onClickApplyLogIn"
  />
  <Form
    v-if="forms.register.active"
    title="Регистрация"
    :itemModel="forms.register.model"
    :isActive="forms.register.active"
    :onClickCancelForm="onClickCancelRegister"
    :onClickApplyForm="onClickApplyRegister"
  /> -->
</template>

<script lang="js">
import { defineComponent} from "vue";
import {NCard, NModal, NAvatar, NDataTable, NInput} from 'naive-ui'

import {logR} from '@/services/utils';
import NavbarVertical from "@/components/NavbarVertical.vue"

import CodeBlock from '@/UI/CodeBlock.vue';
import DatabaseManager from "@/database/DatabaseManager"
import FakeData from '@/services/service.fakedata';
import User from "@/models/model.user"

export default defineComponent( {
  components: { "n-card": NCard, "n-input": NInput,"n-data-table": NDataTable,"n-avatar": NAvatar, "n-modal": NModal, "n-navbar": NavbarVertical, CodeBlock, },
  async created() {
    this.render.main = true;
    this.render.main = false;
    await DatabaseManager.createDatabase();



  },
  data(){
    return{
      menubar: {},
      alert: {
        success:{ active: false, message: ""},
        info:{ active: false, message: ""},
        error:{ active: false, message: ""},
      },
      history: {
        active: false,
        title: "",
        description: "",

      },
      codemirror:{columns: [], data: [], pagination: {pageSize: 2}, answer: '', isWork: false},
      render: {
        main: false
      },
      tab: 0,
      arrays: {
        history: [{title: "1", description: "Description history 1"}, {title: "2", description: "Description history 2"}, {title: "3", description: "Description history 3"}]
      },
      game: {
        step: ''
      },
      activateBlock: {
        avatar: false,
      },
      forms: {
        logIn: {
          model: User,
          active: false
        },
        register: {
          model: User,
          active: false
        }
      },
    }
  },
    methods: {
      async fakeData(){
        await DatabaseManager.createTableUsers();
        const resp = await FakeData.getUsers();
        const users = resp.data
        console.log(users);
        for(let i = 0; i<users.length; i++){
          let queryVal = "INSERT INTO users VALUES\n"
          const value = users[i];
          const name = value.name.split(' ')[0];
          const username = value.username;
          const email = value.email;
          const values = `("${name}", "${username}", "${email}")`;
          queryVal +=  values;
          console.log(queryVal);
          await DatabaseManager.runQuery(queryVal);
        }


      },
      onClickAvatar() {
      logR('warn', 'NAVBAR: onClickAvatar');
      this.activateBlock.avatar = true;

    },
    onClickLogIn() {
      logR('warn', 'NAVBAR: onClickLogIn');
      this.forms.logIn.active = true;
    },
    onClickCancelLogin() {
      logR('warn', 'NAVBAR: onClickCancelLogin');
      this.forms.logIn.active = false;
    },
    onClickApplyLogIn() {
      logR('warn', 'NAVBAR: onClickApplyLogIn');
    },
    onClickRegister() {
      logR('warn', 'onClickRegister');
      this.forms.register.active = true;
    },
    onClickApplyRegister(dataForm) {
      logR('warn', 'NAVBAR: onCLickApplyRegister');
      console.log(dataForm);
      this.forms.register.active = false;
    },
    onClickCancelRegister() {
      logR('warn', 'NAVBAR: onClickCancelRegister');
      this.forms.register.active = false;
    },
    onClickHistory(history) {
      logR('warn', 'NAVBAR: onClickHistory');
      console.log(history);
      this.history.title = history.title;
      this.history.description = history.description;
      this.history.active = true;
    },
    async onClickRunCode(code){
      logR('warn', 'NAVBAR: onClickRunCode');

      const data = await DatabaseManager.executeQuery(code);
      console.log(data);
      // this.codemirror.columns = data.columns;
      // TODO: parse response ============================================
      const columns  = data[0].columns;
      const values = data[0].values;
      console.log(columns);
      for(let i = 0; i<columns.length; i++) {

        const column = {title: columns[i], key: columns[i]};
        this.codemirror.columns.push(column);
        // TODO: prepare data for column;

      }
      // TODO: parse response =============================================
      let array_vals = [];
      values.forEach(row => {
        const value = {};
        for(let column = 0; column < columns.length; column++){
          value[columns[column]] = row[column];
        }
        array_vals.push(value);
      });
      this.codemirror.data = array_vals;
      this.codemirror.isWork = true;
      // code.value.scrollIntoView({ behavior: 'smooth' });



    },


  },

});
</script>
