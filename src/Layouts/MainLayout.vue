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
              <span>{{ userData ? userData.sub.slice(0, 2) : '' }}</span>
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
          Хотите проверить свой уровень знаний SQL? Тогда Вы точно по адресу!
          Вам будут предложены различные сценарии, которые задуманы, как
          самостоятельный урок по изучению концепций и команд SQL. Такая
          увлекательная игра подойдёт как для опытных пользователей SQL, так и
          для новичков.
        </p>
        <n-popover trigger="hover" class="border-left-red">
          <template #trigger>
            <n-button
              color="#ee4540"
              class="preview-btn"
              @click="$router.push({name: 'stories'})"
              >Играть</n-button
            >
          </template>
          <span v-if="userData" class="primary-font-color"> Вперёд! </span>
          <n-space v-else vertical>
            <span class="primary-font-color"
              >Только авторизованные пользователи могут играть</span
            >
            <n-button ghost round type="success" @click="onClickLogIn"
              >Войти</n-button
            >
          </n-space>
        </n-popover>
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
    <n-modal
      v-if="successAlertActive.active"
      v-model:show="successAlertActive.active"
      :title="successAlertActive.message"
      :mask-closable="false"
      preset="dialog"
      @positive-click="onClickCancelSuccessAlert"
      type="success"
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

import {logR, extractJWT} from '@/services/utils';

import UserService from "@/services/user.service";
import AuthService from "@/services/auth.service";

import UserLogin from "@/models/model.user.login";
import UserRegister from "@/models/model.user.register"


export default defineComponent( {
  components: {"n-avatar": NAvatar, "n-navbar": NavbarVertical},
  async created() {
    logR('warn', "MAINLAYOUT: created");
    this.render.main = true;
    let tokenUser = this.$store.state.auth.tokenUser
    console.log("TOKEN USER: ", tokenUser)
    if(tokenUser){

      const currentDate = Date.now();
      // INFO: default userData.exp in seconds, aftetr * 1000 will milliseconds
      const userExp = this.userData.exp *1000
      const differenceTime = userExp - currentDate
      let intervalForUpdateToken = differenceTime;
      console.log(`Difference time${differenceTime}`)
      if((userExp - currentDate) < 0){

        const refreshToken = extractJWT(tokenUser.refreshToken);
        const refreshTokenExp = refreshToken.exp * 1000;
        const differenceTimeRefresh = refreshTokenExp - currentDate;
        if(differenceTimeRefresh < 0){
          console.log('REFRESH MORE CURRUNT DATE');
          this.$store.commit('auth/REMOVE_TOKEN');
        }
        else{
          const accessToken = await AuthService.updateAccessToken();
          const userDataFromAccess = extractJWT(accessToken);
          const lifeTimeToken = userDataFromAccess.exp * 1000;
          console.log(tokenUser.accessToken);

          intervalForUpdateToken = lifeTimeToken - Date.now() - 10000;
          console.error("Access update through: ", intervalForUpdateToken);
        }

          this.timerForUpdateAccessToken = setInterval(() => {
          AuthService.updateAccessToken();
          this.$store.commit("auth/UPDATE_ACCESS_TOKEN");

        }, intervalForUpdateToken);

      }
    }
    this.render.main = false;

  },
  data(){
    return{
      // NOTE: На время теста ===================
      timerForUpdateAccessToken: null,
      isDevelop: false,
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

      errorAlertActive: 'notification/GET_STATE_ERROR',
      successAlertActive: 'notification/GET_STATE_SUCCESS'
    }),
    accessToken(){
      return this.$store.state.auth.tokenUser ? this.$store.state.auth.tokenUser.accessToken : null
    },
    userData(){
      return this.$store.state.auth.tokenData ? this.$store.state.auth.tokenData : null
    },

  },
    methods: {
      onClickToPlay(userData){
        logR("warn", "MainLayout: onClickToPlay");
        if(userData){
          this.$router.push({name: "stories"})
        }
        this.onClickLogIn();


      },
      onClickCancelErrorAlert() {
      this.alert.error.active = false;
      this.alert.error.message = '';
      this.$store.commit('notification/REMOVE_STATE_ERROR');
    },
    onClickCancelSuccessAlert(){
      this.$store.commit('notification/REMOVE_STATE_SUCCESS');

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


      const response = await this.$store.dispatch("auth/login", dataForm);

      if(response.status==200){
        const exp = this.userData.exp * 1000 // to milliseconds
        const differenceBetweenTimestamp = exp - Date.now() - 10000;
        const intervalForUpdateToken =  Math.abs(differenceBetweenTimestamp);


        // TODO: таймер на обновление токена
        this.timerForUpdateAccessToken = setInterval(() => {
          AuthService.updateAccessToken();
          this.$store.commit("auth/UPDATE_ACCESS_TOKEN");

        }, intervalForUpdateToken);

        // TODO: таймер на обновление токена

        this.forms.runSucess = true;


      }

      else{
        this.$store.commit("notification/SET_ACTIVE_ERROR", response.message);
      }
      this.forms.logIn.active = false;
      return response;
    },
    onClickRegister() {
      logR('warn', 'onClickRegister');
      this.forms.register.active = true;
    },
    async onClickApplyRegister(dataForm) {
      logR('warn', 'NAVBAR: onCLickApplyRegister');
      console.log(dataForm);
      console.error("HERE TO FIX in MainLAyout: row 261")
      // FIX: обновление токена ========================================================
      const response = await UserService.createUser({username:dataForm.username, password:dataForm.password})
      // FIX: ================================================================================================

      if(response.status == 200){
        console.log("STATUS: 200\n",dataForm);
        await this.onClickApplyLogIn(dataForm)
        // const responseLogIn = await this.$store.dispatch('auth/login',dataForm);
        // logR('log', "MAINLAYOUT response login\n", responseLogIn)

        // if(responseLogIn.status == 200){
        //   this.forms.runSuccess = true;
        // this.$router.push({name: this.role[this.userData.role]});

        // }
      }
      else{
        this.$store.commit("notification/SET_ACTIVE_ERROR", response.message);
        console.log(this.alert.error)
      }
      this.forms.register.active = false;

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
      clearInterval(this.timerForUpdateAccessToken);
      this.render.main = false;
    }

  },


});
</script>
