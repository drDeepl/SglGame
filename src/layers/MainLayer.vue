<template>
  <va-progress-circle v-if="render.main" indeterminate />
  <va-navbar
    color="grey pa-0"
    @mouseleave="() => ($data.activateBlock.avatar = false)"
  >
    <template #left>
      <v-navbar-item>SQL Game</v-navbar-item>
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
          <va-button @click="onClickLogIn">Войти</va-button>
          <va-button @click="onClickRegister">Зарегистрироваться</va-button>
        </va-dropdown-content>
      </va-dropdown>
    </template>
  </va-navbar>
  <Form
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
  />
</template>

<script lang="ts">
import ModelCreateUser from '@/models/model.user.create';
import {defineComponent} from 'vue';
import {logR} from '@/service/utils';
import Form from '@/components/Form.vue';
export default defineComponent({
  components: {Form},
  data() {
    return {
      render: {
        main: false
      },
      activateBlock: {
        avatar: false
      },
      forms: {
        logIn: {
          model: new ModelCreateUser(),
          active: false
        },
        register: {
          model: new ModelCreateUser(),
          active: true
        }
      }
    };
  },
  async created() {
    this.render.main = true;
    this.render.main = false;
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
    onClickApplyRegister() {
      logR('warn', 'NAVBAR: onCLickApplyRegister');
      this.forms.register.active = false;
    },
    onClickCancelRegister() {
      logR('warn', 'NAVBAR: onClickCancelRegister');
      this.forms.register.active = false;
    }
  }
});
</script>
