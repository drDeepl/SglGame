<template>
  <va-navbar color="grey pa-0">
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
          <va-button round size="small" @click.prevent="onClickAvatar">
            <va-avatar color="danger">?</va-avatar>
          </va-button>
        </template>
        <va-dropdown-content class="flex flex-row">
          <va-button @click="onClickLogIn">Войти</va-button>
          <va-button>Зарегистрироваться</va-button>
        </va-dropdown-content>
      </va-dropdown>
    </template>
  </va-navbar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { logR } from "@/service/utils";
export default defineComponent({
  components: {},
  data() {
    return {
      render: {
        main: false,
      },
      activateBlock: {
        avatar: false,
      },
      forms: {
        logIn: {
          active: false,
        },
      },
    };
  },
  methods: {
    onClickAvatar() {
      logR("warn", "NAVBAR: onClickAvatar");
      this.activateBlock.avatar = true;
    },
    onClickLogIn() {
      logR("warn", "NAVBAR: onClickLogIn");
    },
  },
});
</script>
