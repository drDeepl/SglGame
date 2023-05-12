<template>
  <n-modal v-if="render.main" v-model:show="render.main" :mask-closable="false">
    <n-spin size="large"></n-spin
  ></n-modal>
  <div v-else class="page-content">
    <n-layout has-sider>
      <n-layout-sider
        :style="sidebar.active ? 'min-width: 25em' : 'min-width: 10em'"
      >
        <n-card>
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

          <div
            class="profile-sidebar-link"
            v-for="row in sidebar.rows"
            :key="row.id"
            @click="onClickToLink(row.url)"
          >
            <span class="profile-sidebar-row-border"></span>
            <span class="profile-sidebar-row-text">{{ row.title }}</span>
          </div>
        </n-card>
      </n-layout-sider>
      <n-layout>
        <n-layout-header>
          {{ $router.currentRoute._value.name }}
          <n-space justify="start">
            <n-card
              class="database-add-table"
              hoverable
              @click="onClickCreateTable"
            >
              <!-- <template #footer> -->
              <n-space justify="center" align="center" vertical>
                <span class="database-add-table-header">Добавить таблицу</span>
                <n-icon size="35" color="black" class="database-icon-table">
                  <icon-add-plus />
                </n-icon>
              </n-space>
              <!-- </template> -->
            </n-card>
          </n-space>
        </n-layout-header>
        <n-layout-content></n-layout-content>
      </n-layout>
    </n-layout>

    <c-form
      v-if="forms.createTable.active"
      :isActive="forms.createTable.active"
      title="Создание таблицы"
      :itemModel="forms.createTable.model"
      labelApplyButton="Создать"
      :applyFunction="onClickApplyCreateTable"
      :cancelFunction="onClickCancelCreateTable"
    >
    </c-form>
  </div>
</template>

<script type="text/javascript">
import {defineComponent} from 'vue';
import {mapGetters} from 'vuex';
import {NAvatar} from 'naive-ui';
import {logR} from '@/services/utils';
import CreateStory from '@/models/model.create.story';
import ServiceDownloadFile from '@/services/download.service';
import DatabaseManager from '@/database/DatabaseManager';

export default defineComponent({
  components: {'n-avatar': NAvatar},
  data() {
    return {
      db: null,
      sidebar: {active: false, rows: []},
      render: {main: false},
      forms: {createTable: {active: false, model: CreateStory}},
      arrays: {
        stories: [
          {
            id: 0,
            title: 'Murder_Mystery',
            difficulty: 'Some difficultys',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            story_text: 'Some text',
            answer: 'answer1',
          },
        ],
      },
    };
  },

  computed: {
    ...mapGetters({
      getUserToken: 'auth/GET_TOKEN_USER',
      userData: 'auth/GET_DATA_LOGIN',
    }),
  },
  async created() {
    // TODO: Подгрузка историй с бека
    this.render.main = true;
    if (!this.userData) {
      this.$router.push({name: 'home'});
    } else {
      // const dataUser = this.$store.state.auth.dataLogin;
      // FIX: ===================================================
      const fileDb = await ServiceDownloadFile.donwloadFile();
      const db = await DatabaseManager.createDatabase(fileDb.data);

      this.db = db;
      const tablesGame = db.exec('SELECT * FROM interview;');
      // FIX: ===================================================
      console.log('TABLES\n', tablesGame);
      this.sidebar.rows = this.sidebar.rows =
        this.$store.state.user.userSidebar.admin;
    }
    this.render.main = false;
  },

  methods: {
    onClickToLink(url) {
      logR('warn', 'onClickToLink');
      url.length > 0 ? this.$router.push(url) : '';
    },

    onClickApplyCreateTable() {
      logR('warn', 'ManageDatabase:onClickApplyCreateTable');
    },

    onClickCancelCreateTable() {
      logR('warn', 'ManageDatabase:onClickCancelCreate');
    },
    onClickCreateTable() {
      logR('warn', 'ManageDatabase:onClickCreateTable');
    },
  },
});
</script>
