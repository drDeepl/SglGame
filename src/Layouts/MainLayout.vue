<template>
  <!-- <va-progress-circle v-if="render.main" indeterminate /> -->
  <!-- <va-navbar @mouseleave="() => ($data.activateBlock.avatar = false)">
    <template #left>
      <va-navbar-item>
        <va-button>Помощь</va-button>
      </va-navbar-item>
      <va-navbar-item class="ml-2">
        <va-button>О проекте</va-button>
      </va-navbar-item>
    </template>
    <template #center>
      <va-navbar-item><va-button>SQL Game</va-button></va-navbar-item>
    </template>
    <template #right>
      <va-dropdown
        class="mr-3"
        trigger="none"
        v-model="activateBlock.avatar"
        :close-on-click-outside="true"
        :offset="[-50, -155]"
      >
        <template #anchor>
          <va-button round size="small" @click="onClickAvatar">
            <va-avatar color="danger">?</va-avatar>
          </va-button>
        </template>
        <va-dropdown-content class="flex flex-row">
          <va-button class="mr-2" @click="onClickLogIn">Войти</va-button>
          <va-button @click="onClickRegister">Зарегистрироваться</va-button>
        </va-dropdown-content>
      </va-dropdown>
    </template>
  </va-navbar> -->
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
      @click="onClickHistory"
    >
      <va-card-title class="card-title-history"
        >history {{ history }}</va-card-title
      >
    </div>
  </div>
  <div class="history-content__wrapper mt-5">
    <!-- // TODO: Добавить в отдельный компонент -->
    <CodeBlock></CodeBlock>
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
import { NButton, NModal, NAvatar, NSpace, } from 'naive-ui'

import {logR} from '@/services/utils';
import NavbarVertical from "@/components/NavbarVertical.vue"
// import Form from '@/components/Form.vue';
import CodeBlock from '@/UI/CodeBlock.vue';
import DatabaseManager from "@/database/DatabaseManager"

import User from "@/models/model.user"

export default defineComponent( {
  components: {"n-button": NButton,"n-space": NSpace, "n-avatar": NAvatar, "n-modal": NModal, "n-navbar": NavbarVertical, CodeBlock, },
  async created() {
    this.render.main = true;
    this.render.main = false;
    const query = "SELECT * FROM person";
    await DatabaseManager.createDatabaseFromFile("sql-murder-mystery.db");
    const res = await DatabaseManager.executeQuery(query);
    console.log(res)
  },
  data(){
    return{
      menubar: {},
      render: {
        main: false
      },
      tab: 0,
      arrays: {
        history: [1, 2, 3]
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
    onClickHistory() {
      logR('warn', 'NAVBAR: onClickHistory');
    }


  },

});
</script>
