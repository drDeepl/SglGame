<template>
  <n-navbar>
    <n-space justify="end">
      <n-button @click="todos = true" style="background-color: whitesmoke"
        >todos</n-button
      >
      <n-modal v-model:show="todos">
        <p style="background-color: whitesmoke">
          <n-space class="user-menu" vertical>
            <span>
              1.Найти способ автоматизировать подгрузку схемы базы данных
            </span>
            <span
              >2.Статус открытой\закрытой истории и соответствующая иконка к
              нему</span
            >
          </n-space>
        </p>
      </n-modal>
      <n-popconfirm
        class="navbar-popconfirm"
        :show-icon="false"
        positive-text="Вход"
        :on-positive-click="onClickLogIn"
        negative-text="Регистрация"
        :on-negative-click="onClickRegister"
      >
        <template #trigger>
          <n-avatar
            @click="onClickAvatar"
            class="user__avatar"
            size="large"
            round
            :style="{backgroundColor: '#ee4540'}"
          >
            <span>?</span>
          </n-avatar>
        </template>
      </n-popconfirm>
    </n-space>
  </n-navbar>
  <div class="main-content">
    <router-view />
  </div>

  <!-- // NOTE: блок с всплывающими оповещениями -->

  <!-- // NOTE: блок с формами -->
  <c-form
    v-if="forms.logIn.active"
    :isActive="forms.logIn.active"
    title="Вход"
    :itemModel="forms.logIn.model"
    :toValidate="true"
    labelApplyButton="Войти"
    :applyFunction="onClickApplyLogIn"
    :cancelFunction="onClickCancelLogIn"
    :isRunSuccess="forms.runSuccess"
    :loading="forms.running"
  >
  </c-form>

  <c-form
    v-if="forms.register.active"
    :isActive="forms.register.active"
    title="Регистрация"
    :itemModel="forms.register.model"
    :toValidate="true"
    :hideProps="{role: true}"
    labelApplyButton="Зарегистрироваться"
    :applyFunction="onClickApplyRegister"
    :cancelFunction="onClickCancelRegister"
    :loading="forms.running"
  >
  </c-form>
</template>

<script lang="js">
import { defineComponent} from "vue";
import {NAvatar} from 'naive-ui'
import NavbarVertical from "@/components/NavbarVertical.vue"

import {logR} from '@/services/utils';
// import FakeData from '@/services/service.fakedata';

import UserService from "@/services/user.service";
import {extractJWT} from "@/services/utils";



import UserLogin from "@/models/model.user.login";
import UserRegister from "@/models/model.user.register"


export default defineComponent( {
  components: {"n-avatar": NAvatar, "n-navbar": NavbarVertical},
  async created() {
    this.render.main = true;
    this.render.main = false;

  },
  data(){
    return{
      // NOTE: На время теста ===================
      todos: false,
      // NOTE: На время теста ===================
      render: {main: false},
      menubar: {},

      activateBlock: {
        avatar: false,
      },
      forms: {
        runSuccess: false,
        running: false,
        logIn: {
          active: false,
          model: UserLogin,

        },
        register: {
          active: false,
          model: UserRegister,

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
    onClickCancelLogIn() {
      logR('warn', 'NAVBAR: onClickCancelLogin');
      this.forms.logIn.active = false;
    },
    async onClickApplyLogIn(dataForm) {
      logR('warn', 'NAVBAR: onClickApplyLogIn\n');
      console.log(dataForm)
      // const response = await this.$store.dispatch("auth/login", dataForm)
      const response = {status: 200,
      data: {type: "Bearer",
      accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNjgyNjg0MTQ3LCJ1c2VySWQiOjIsInJvbGUiOiJST0xFX1VTRVIifQ.kiXWT2vKMUSmhFbhRMBFVZPMWyrfWTO90xrW5KsUFhqBJHi1VvDuno9QrCq6Mb_w7CGGp14KD6CNrDYCjS-Ufw",
      refreshToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwiZXhwIjoxNjg1Mjc1ODQ3fQ.zRlDaEuUz_CDp--ZpNKz93oeEzZXfBz28mlKGrMBk8D3AUUhWop3vuIej8KHSVzEquQBrMErmeGtEQ4Ira-S4Q"
      },
      message: ''};
      console.log(response);
      if(response.status==200){
        const token = response.data.accessToken;

        const userData = extractJWT(token);
        console.log(userData);

        this.$store.commit("auth/SET_TOKEN_USER", token);
        this.$store.commit("auth/SET_DATA_LOGIN", userData);
        this.$router.push({name:"profile"})
      }
      this.forms.logIn = false;

    },
    onClickRegister() {
      logR('warn', 'onClickRegister');
      this.forms.register.active = true;
    },
    async onClickApplyRegister(dataForm) {
      logR('warn', 'NAVBAR: onCLickApplyRegister');
      console.log(dataForm);
      // TODO: исправить после внесения правок на бэке ========================================================
      // const response = await UserService.createUser({username:dataForm.username, password:dataForm.password})
      console.error("todo: userService.createUser", UserService)
      // TODO: ================================================================================================
      const response = {status: 200, data: {
  type: "Bearer",
  accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNjgyNjg0MTQ3LCJ1c2VySWQiOjIsInJvbGUiOiJST0xFX1VTRVIifQ.kiXWT2vKMUSmhFbhRMBFVZPMWyrfWTO90xrW5KsUFhqBJHi1VvDuno9QrCq6Mb_w7CGGp14KD6CNrDYCjS-Ufw",
  refreshToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwiZXhwIjoxNjg1Mjc1ODQ3fQ.zRlDaEuUz_CDp--ZpNKz93oeEzZXfBz28mlKGrMBk8D3AUUhWop3vuIej8KHSVzEquQBrMErmeGtEQ4Ira-S4Q"
}, message: ''}
      if(response.status == 200){
        this.$store.commit('auth/SET_TOKEN_USER', response.data.accessToken)
        this.forms.runSucess = true;
        this.$router.push({name: "profile"})
      }
      else{
        this.alert.error.active - true;
        this.alert.message = this.$store.state.message.error;
      }
      this.forms.register.active = false;
    },
    onClickCancelRegister() {
      logR('warn', 'NAVBAR: onClickCancelRegister');
      this.forms.register.active = false;
    },

  },


});
</script>
