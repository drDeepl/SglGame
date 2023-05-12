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

          <n-space justify="center">
            <n-scrollbar>
              <div class="container-card-stories container-header-profile">
                <n-card
                  v-for="(table, id) in arrays.tables"
                  :key="id"
                  class="database-add-table"
                  hoverable
                  @click="onClickTableCard(table)"
                >
                  <!-- <template #footer> -->
                  <n-space justify="center" align="center" vertical>
                    <span class="database-add-table-header">{{ table }}</span>
                    <!-- <n-icon size="35" color="black" class="database-icon-table">
                  <icon-add-plus />
                </n-icon> -->
                  </n-space>
                  <!-- </template> -->
                </n-card>
              </div>
            </n-scrollbar>
          </n-space>
        </n-layout-header>
        <n-layout-content>
          <n-table v-if="tableBlock.dataTable.length > 0">
            <thead>
              <th v-for="header in tableBlock.headersTable" :key="header">
                {{ header }}
              </th>
              <th>
                <n-icon size="18" color="grey" class="database-icon-table">
                  <icon-add-plus />
                </n-icon>
              </th>
            </thead>
            <tbody>
              <tr
                v-for="(row, id) in tableBlock.dataTable"
                :key="`row_${id}`"
                class="hover-container"
              >
                <td v-for="(columnValue, id) in row" :key="`columnValue_${id}`">
                  {{ columnValue }}
                </td>
                <td>
                  <n-popconfirm :show-icon="false">
                    <template #trigger>
                      <n-icon size="28" color="grey" class="card-story-menu">
                        <icon-menu-story />
                      </n-icon>
                    </template>
                    <template #action>
                      <n-button
                        circle
                        size="tiny"
                        ghost
                        @click="onClickUpdateTableCard(row)"
                      >
                        <n-icon size="20" color="orange">
                          <icon-edit />
                        </n-icon>
                      </n-button>
                      <n-button
                        circle
                        size="tiny"
                        ghost
                        @click="onClickDeleteTableCard(row)"
                      >
                        <n-icon size="20" color="red">
                          <icon-delete />
                        </n-icon>
                      </n-button>
                    </template>
                  </n-popconfirm>
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-layout-content>
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

import TableService from '@/services/tables.service';

export default defineComponent({
  components: {'n-avatar': NAvatar},
  data() {
    return {
      db: null,
      sidebar: {active: false, rows: []},
      render: {main: false},
      forms: {createRow: {active: false, model: null}},
      tableBlock: {
        managerTable: null,
        dataTable: [],
        headersTable: [],
      },

      arrays: {
        tables: [
          'address',
          'city',
          'crime_scene_report',
          'driver_license',
          'educational_institution',
          'event_checkin',
          'interview',
          'organization',
          'person',
          'pet',
          'students',
          'workers',
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

      // FIX: ===================================================

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
    async onClickTableCard(tableController) {
      logR('warn', 'ManageDatabase:onClickTableCard');
      const tableService = new TableService(tableController);
      const data = await tableService.getRows();
      this.tableBlock.dataTable = data;
      this.tableBlock.headersTable = Object.keys(data[0]);
    },

    onClickUpdateTableCard(rowData) {
      logR('warn', 'ManageDatabase:onClickApplyTableCard');
      console.log(rowData);
    },

    onClickApplyTableCard() {
      logR('warn', 'ManageDatabase:onClickUpdateTableCard');
    },

    onClickCancelTableCard() {
      logR('warn', 'ManageDatabase:onClickCancelTableCard');
    },

    onClickDeleteTableCard(rowData) {
      logR('warn', 'ManageDatabase:onClickDeleteTableCard');
      console.log(rowData);
    },
  },
});
</script>
