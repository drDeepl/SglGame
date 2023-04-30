<template>
  <n-navbar>
    <n-space justify="space-between" align="center">
      <n-space justify="start">
        <router-link to="/">
          <n-button text>
            <span style="color: whitesmoke">На главную</span>
          </n-button>
        </router-link>
      </n-space>
      <n-space justify="end">
        <n-popconfirm
          v-if="!userData"
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
        <n-popconfirm
          v-else
          class="navbar-popconfirm"
          :show-icon="false"
          positive-text="Личный кабинет"
          :on-positive-click="onClickToProfile"
          negative-text="Выйти"
          :on-negative-click="onClickToExitProfile"
        >
          <template #trigger>
            <n-avatar
              @click="onClickAvatar"
              class="user__avatar"
              size="large"
              round
              :style="{backgroundColor: '#ee4540'}"
            >
              <span>{{ userData.sub.slice(0, 2) }}</span>
            </n-avatar>
          </template>
        </n-popconfirm>
      </n-space>
    </n-space>
  </n-navbar>
  <div class="main-content">
    <div
      v-if="$router.currentRoute._value.name == 'home'"
      class="main-preview-layout"
    >
      <div class="preview-description">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <n-button
          color="#ee4540"
          class="preview-btn"
          @click="$router.push('/stories')"
          >Играть</n-button
        >
      </div>
      <div class="main-preview"></div>
    </div>
    <router-view> </router-view>
    <n-modal
      v-if="errorAlertActive.active"
      v-model:show="errorAlertActive.active"
      :title="errorAlertActive.message"
      :mask-closable="false"
      preset="dialog"
      @positive-click="onClickCancelErrorAlert"
      type="error"
    >
    </n-modal>
  </div>

  <!-- // NOTE: блок с всплывающими оповещениями -->

  <!-- // NOTE: блок с формами -->
  <c-form
    v-if="forms.logIn.active"
    :isActive="forms.logIn.active"
    title="Вход"
    :itemModel="forms.logIn.model"
    :toValidate="false"
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
import {mapGetters} from "vuex";

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
      isDevelop: true,
      todos: false,
      role: {"ROLE_ADMIN": 'admin', "ROLE_USER": 'user'},
      // NOTE: На время теста ===================
      render: {main: false},
      menubar: {},
      alert: {
        success: {active: false, message: ''},
        info: {active: false, message: ''},
        error: {active: false, message: ''},
      },
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
  computed: {
    ...mapGetters({
      getUserToken: 'auth/GET_TOKEN_USER',
      userData: 'auth/GET_DATA_LOGIN',
      errorAlertActive: 'notification/GET_STATE_ERROR'
    }),
  },
    methods: {
      onClickCancelErrorAlert() {
      this.alert.error.active = false;
      this.alert.error.message = '';
      this.$store.commit('notification/REMOVE_STATE_ERROR');
    },
      onClickToProfile(){
        const role = this.userData.role
        this.$router.push({name: this.role[role]})
      },
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
      const response = await this.$store.dispatch("auth/login", dataForm);
      console.log(response)
      if(response.status==200){
        const token = response.data.accessToken;
        let userData = extractJWT(token);
        console.log(userData);

        this.$store.commit("auth/SET_TOKEN_USER", token);
        // userData.role = "ROLE_ADMIN"
        this.$store.commit("auth/SET_DATA_LOGIN", userData);
        if(userData.role == "ROLE_USER"){
          this.$router.push({name:"user"})
          }
        else if(userData.role== "ROLE_ADMIN"){
            this.$router.push({name:"admin"})
        }
      }
      else if(this.isDevelop){
        const response = {status: 200, data: {
          type: "Bearer",
          accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNjgyNjg0MTQ3LCJ1c2VySWQiOjIsInJvbGUiOiJST0xFX1VTRVIifQ.kiXWT2vKMUSmhFbhRMBFVZPMWyrfWTO90xrW5KsUFhqBJHi1VvDuno9QrCq6Mb_w7CGGp14KD6CNrDYCjS-Ufw",
          refreshToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwiZXhwIjoxNjg1Mjc1ODQ3fQ.zRlDaEuUz_CDp--ZpNKz93oeEzZXfBz28mlKGrMBk8D3AUUhWop3vuIej8KHSVzEquQBrMErmeGtEQ4Ira-S4Q"
          }, message: ''};
          let dataUser = extractJWT(response.data.accessToken);
          dataUser.role = "ROLE_ADMIN";
          this.$store.commit("auth/SET_DATA_LOGIN", dataUser);
          this.$store.commit('auth/SET_TOKEN_USER', response.data.accessToken);
          this.forms.runSucess = true;
          this.$router.push({name: this.role[dataUser.role]});
      }else{
        this.$store.commit("notification/SET_ACTIVE_ERROR", response.message);
      }
      this.forms.logIn.active = false;

    },
    onClickRegister() {
      logR('warn', 'onClickRegister');
      this.forms.register.active = true;
    },
    async onClickApplyRegister(dataForm) {
      logR('warn', 'NAVBAR: onCLickApplyRegister');
      console.log(dataForm);
      // TODO: исправить после внесения правок на бэке ========================================================
      const response = await UserService.createUser({username:dataForm.username, password:dataForm.password})
      console.error("todo: userService.createUser", UserService)
      // TODO: ================================================================================================
//       const response = {status: 200, data: {
//   type: "Bearer",
//   accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNjgyNjg0MTQ3LCJ1c2VySWQiOjIsInJvbGUiOiJST0xFX1VTRVIifQ.kiXWT2vKMUSmhFbhRMBFVZPMWyrfWTO90xrW5KsUFhqBJHi1VvDuno9QrCq6Mb_w7CGGp14KD6CNrDYCjS-Ufw",
//   refreshToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwiZXhwIjoxNjg1Mjc1ODQ3fQ.zRlDaEuUz_CDp--ZpNKz93oeEzZXfBz28mlKGrMBk8D3AUUhWop3vuIej8KHSVzEquQBrMErmeGtEQ4Ira-S4Q"
// }, message: ''}
      if(response.status == 200){
        this.$store.commit('auth/SET_TOKEN_USER', response.data.accessToken)
        this.forms.runSucess = true;
        this.$router.push({name: "profile"});
        this.forms.register.active = false;
      }
      else if(this.isDevelop){
        const response = {status: 200, data: {
          type: "Bearer",
          accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNjgyNjg0MTQ3LCJ1c2VySWQiOjIsInJvbGUiOiJST0xFX1VTRVIifQ.kiXWT2vKMUSmhFbhRMBFVZPMWyrfWTO90xrW5KsUFhqBJHi1VvDuno9QrCq6Mb_w7CGGp14KD6CNrDYCjS-Ufw",
          refreshToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwiZXhwIjoxNjg1Mjc1ODQ3fQ.zRlDaEuUz_CDp--ZpNKz93oeEzZXfBz28mlKGrMBk8D3AUUhWop3vuIej8KHSVzEquQBrMErmeGtEQ4Ira-S4Q"
          }, message: ''};
          let dataUser = extractJWT(response.data.accessToken);
          dataUser.role = "ROLE_ADMIN";
          this.$store.commit("auth/SET_DATA_LOGIN", dataUser);
          this.$store.commit('auth/SET_TOKEN_USER', response.data.accessToken);
          this.forms.runSucess = true;
          this.$router.push({name: this.role[dataUser.role]});
          this.forms.register.active = false;
      }
      else{
        // this.alert.error.active = true;
        // this.alert.error.message = response.message;
        this.$store.commit("notification/SET_ACTIVE_ERROR", response.message);
        console.log(this.alert.error)
      }

    },
    onClickCancelRegister() {
      logR('warn', 'NAVBAR: onClickCancelRegister');
      this.forms.register.active = false;
    },

    onClickToExitProfile(){
      logR('warn', 'MainLayout: onClickToExitProfile');
      this.render.main = true;
      this.$store.commit("auth/REMOVE_USER");
      this.$router.push({name: "home"});
      this.$router.removeRoute();
      this.render.main = false;
    }

  },


});
</script>
