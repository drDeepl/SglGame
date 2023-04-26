<template>
  <n-navbar>
    <n-space hustify="start">
      <n-button @click="todos = true" style="background-color: whitesmoke"
        >todos</n-button
      >
      <n-modal v-model:show="todos">
        <p style="background-color: whitesmoke">
          <n-space vertical
            ><span>file: onClickHistory</span>
            <span
              >1.Пока загружается базаданных пользователю показывает прогресс
              загрузки</span
            >
          </n-space>
        </p>
      </n-modal>
    </n-space>
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
      <div class="card-title-history">
        history {{ history.title.replace('_', ' ') }}
      </div>
      <img
        class="card-history-img"
        :src="require('@/img/history_' + history.title + '.jpg')"
      />
    </div>
  </div>
  <div class="history-content__wrapper">
    <!-- // TODO: Добавить в отдельный компонент -->
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
      <template #header-extra>
        <n-button
          quaternary
          circle
          type="error"
          @click="history.active = false"
        >
          <icon-close style="width: 1.7em" />
        </n-button>
      </template>
      <n-space v-if="history.loadData" justify="center">
        <n-spin></n-spin>
      </n-space>
      <div v-else class="history-card-content">
        <p>
          {{ history.description }}
        </p>

        <CodeBlock
          :onClickRunCodeFunc="onClickRunCode"
          :onClickClearCodeFunc="onClickClearCode"
        >
          <n-button @click="fakeData()">Случайные данные</n-button>
        </CodeBlock>
        <!-- <n-space justify="space-around"> -->
        <n-space justify="space-between">
          <n-input
            v-model:value="codemirror.answer"
            placeholder="Ответ:"
          ></n-input>

          <n-button>Отправить</n-button>
        </n-space>
      </div>
      <div style="margin-top: 1em">
        <n-data-table
          ref="table"
          v-if="codemirror.isWork"
          :columns="codemirror.columns"
          :data="codemirror.data"
          :pagination="codemirror.pagination"
        ></n-data-table>
      </div>
      <!-- </n-space> -->

      <template #footer> </template>
    </n-card>
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
import { NCard, NModal, NAvatar, NDataTable, NInput} from 'naive-ui'
import NavbarVertical from "@/components/NavbarVertical.vue"
import CodeBlock from '@/UI/CodeBlock.vue';


import {logR} from '@/services/utils';
import FakeData from '@/services/service.fakedata';
import DatabaseManager from "@/database/DatabaseManager";
import ServiceDatabase from "@/services/service.database";

import User from "@/models/model.user"





export default defineComponent( {
  components: {"n-card": NCard, "n-input": NInput,"n-data-table": NDataTable,"n-avatar": NAvatar, "n-modal": NModal, "n-navbar": NavbarVertical, CodeBlock, },
  async created() {
    this.render.main = true;
    this.render.main = false;
    await DatabaseManager.createDatabase();



  },
  data(){
    return{
      // NOTE: На время теста ===================
      todos: false,
      // NOTE: На время теста ===================
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
        loadData: true,

      },
      codemirror:{columns: [], data: [], pagination: {pageSize: 5}, answer: '', isWork: false},
      render: {
        main: false
      },
      tab: 0,
      arrays: {
        history: [{title: "murder_mystery", description: "Description history 1"}, {title: "2", description: "Description history 2"}, {title: "3", description: "Description history 3"}]
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
    async onClickHistory(history) {
      // FIX: =========================================
      logR('warn', 'NAVBAR: onClickHistory');
      this.history.active = true;
      console.log(history);
      const urlToDb = await ServiceDatabase.getLinkToDatabase(history.title);
      const response2DownloadDb = await ServiceDatabase.downloadFile(urlToDb);
      // const body = response2DownloadDb.body.getReader();
      console.log("Downloaded BD\n", response2DownloadDb);


      this.history.title = history.title;
      this.history.description = history.description;
      // FIX: =========================================


    },
  onClickClearCode(){
    this.codemirror.data = [];
    this.codemirror.columns = [];
    this.codemirror.isWork = false;
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
      let tableHeader = []
      for(let i = 0; i<columns.length; i++) {

        const column = {title: columns[i], key: columns[i]};

        tableHeader.push(column);
        // TODO: prepare data for column;
      }
      this.codemirror.columns = tableHeader;
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
