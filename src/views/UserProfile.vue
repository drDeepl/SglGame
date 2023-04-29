<template>
  <n-modal v-if="render.main" v-model:show="render.main" :mask-closable="false">
    <n-spin size="large"></n-spin
  ></n-modal>
  <div v-else class="page-content">
    <n-button @click="sidebar.active = true">OpenSidebar</n-button>
    <n-drawer
      class="sidebar-layout"
      v-model:show="sidebar.active"
      placement="left"
    >
      <n-drawer-content>
        <template #header>
          <n-space horizontal align="center">
            <n-avatar
              class="user__avatar"
              size="large"
              round
              :style="{backgroundColor: '#ee4540'}"
            >
              <span>{{ userData.sub.slice(0, 2) }}</span>
            </n-avatar>
            <n-space vertical>
              <span class="profile_username">{{ userData.sub }}</span>
              <span class="profile_role">{{
                userData.role.split('_')[1].toLowerCase()
              }}</span>
            </n-space>
          </n-space>
        </template>
        <template #footer>
          <n-button>Footer</n-button>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script type="text/javascript">
import {defineComponent} from 'vue';
import {mapGetters} from 'vuex';
import {NAvatar} from 'naive-ui';

export default defineComponent({
  components: {'n-avatar': NAvatar},
  data() {
    return {
      sidebar: {active: false, rows: []},
      render: {main: false},
    };
  },

  computed: {
    ...mapGetters({
      getUserToken: 'auth/GET_TOKEN_USER',
      userData: 'auth/GET_DATA_LOGIN',
    }),
  },
  async created() {
    this.render.main = true;
    const tokenUser = this.$store.state.auth.tokenUser;
    if (!tokenUser) {
      this.$router.push({name: 'home'});
    }
    this.render.main = false;
  },
});
</script>
