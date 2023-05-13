<template>
  <n-modal v-if="render.main" v-model:show="render.main" :mask-closable="false">
    <n-spin size="large"></n-spin
  ></n-modal>
  <div v-else class="page-content">
    <n-layout has-sider>
      <!-- :style="sidebar.active ? 'min-width: 25em' : 'min-width: 10em'" -->
      <n-layout-sider>
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
          <n-table v-if="tableBlock.dataTable.length > 0 && !tableBlock.render">
            <thead>
              <th v-for="header in tableBlock.headersTable" :key="header">
                {{ header }}
              </th>
              <th>
                <n-icon
                  size="18"
                  color="grey"
                  class="database-icon-table"
                  @click="onClickCreateRow"
                >
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
                        @click="onClickUpdateRow(row)"
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
          <n-space justify="center">
            <n-spin v-if="tableBlock.render"></n-spin>
          </n-space>
        </n-layout-content>
      </n-layout>
    </n-layout>

    <c-form
      v-if="forms.createRow.active"
      :isActive="forms.createRow.active"
      title="Создание таблицы"
      :itemModel="forms.createRow.model"
      :isLoading="forms.createRow.load"
      labelApplyButton="Создать"
      :applyFunction="onClickApplyCreateRow"
      :cancelFunction="onClickCancelCreateRow"
      :hideProps="forms.createRow.hideRow"
    >
    </c-form>
    <c-form
      v-if="forms.updateRow.active"
      :isActive="forms.updateRow.active"
      title="Создание таблицы"
      :itemModel="forms.updateRow.model"
      :isLoading="forms.updateRow.load"
      labelApplyButton="Создать"
      :applyFunction="onClickApplyUpdateRow"
      :cancelFunction="onClickCancelUpdateRow"
      :hideProps="forms.updateRow.hideRow"
    >
    </c-form>
  </div>
</template>

<script type="text/javascript">
import {defineComponent} from 'vue';
import {mapGetters} from 'vuex';
import {NAvatar} from 'naive-ui';
import {logR} from '@/services/utils';
import CreateAddress from '@/models/model.create.address';
import CreateCity from '@/models/model.create.city';
import CreateCrimeSceneReport from '@/models/model.create.crime.scene.report';
import CreateDriveLicence from '@/models/model.create.driver.licence';
import CreateEducationInstitution from '@/models/model.create.education.institution';
import CreateEventCheckIn from '@/models/model.create.event.checkin';
import CreateInterview from '@/models/model.create.interview';
import CreateOrganization from '@/models/model.create.organization';
import CreatePerson from '@/models/model.create.person';
import CreatePet from '@/models/model.create.pet';
import CreateStudent from '@/models/model.create.student';
import CreateWorkers from '@/models/model.create.workers';

import TableService from '@/services/tables.service';

export default defineComponent({
  components: {'n-avatar': NAvatar},
  data() {
    return {
      db: null,
      sidebar: {active: false, rows: []},
      render: {main: false},
      forms: {
        createRow: {active: false, load: false, model: null, hideRow: null},
        updateRow: {
          active: false,
          load: false,
          model: null,
          hideRow: null,
          selectedData: {},
        },
      },
      tableBlock: {
        render: false,
        serviceTable: null,
        currentTableName: '',
        dataTable: [],
        headersTable: [],
        modelsTable: {
          address: CreateAddress,
          city: CreateCity,
          crime_scene_report: CreateCrimeSceneReport,
          driver_license: CreateDriveLicence,
          educational_institution: CreateEducationInstitution,
          event_checkin: CreateEventCheckIn,
          interview: CreateInterview,
          organization: CreateOrganization,
          person: CreatePerson,
          pet: CreatePet,
          students: CreateStudent,
          workers: CreateWorkers,
        },
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
    createErrorNotificationIfNonOk(response) {
      logR('warn', 'createErrorNotificationIfNonOk');
      console.log(response);
      if (response != 'OK') {
        this.$store.commit('notification/SET_ACTIVE_ERROR', response.message);
        return true;
      } else {
        return false;
      }
    },
    onClickToLink(url) {
      logR('warn', 'onClickToLink');
      url.length > 0 ? this.$router.push(url) : '';
    },
    async updateDataTable() {
      logR('warn', 'updateDataTable');
      this.tableBlock.render = true;
      const data = await this.tableBlock.serviceTable.getRows();
      this.tableBlock.dataTable = data;
      this.tableBlock.headersTable = Object.keys(data[0]);
      this.tableBlock.render = false;
    },
    async onClickTableCard(tableController) {
      logR('warn', 'ManageDatabase:onClickTableCard');

      this.tableBlock.currentTableName = tableController;
      console.log(tableController);
      let hideRow = {};
      if (tableController === 'educational_institution') {
        hideRow[`edu_id`] = true;
      } else if (tableController === 'crime_scene_report') {
        hideRow[`csr_id`] = true;
      } else if (tableController === 'event_checkin') {
        hideRow[`ec_id`] = true;
      } else if (tableController === 'driver_license') {
        hideRow[`license_id`] = true;
      } else if (tableController === 'pet') {
        hideRow[`id`] = true;
      } else {
        hideRow[`${tableController}_id`] = true;
      }

      this.forms.createRow.hideRow = hideRow;
      this.forms.updateRow.hideRow = hideRow;
      const modelTable = this.tableBlock.modelsTable[tableController];
      this.forms.createRow.model = new modelTable();
      // this.forms.updateRow.model = new modelTable();
      const tableService = new TableService(tableController);
      this.tableBlock.serviceTable = tableService;
      this.tableBlock.currentTableName = tableController;
      await this.updateDataTable();
    },

    onClickUpdateTableCard(rowData) {
      logR('warn', 'ManageDatabase:onClickApplyTableCard');
      console.log(rowData);
    },

    onClickCreateRow() {
      logR('warn', 'ManageDatabase:onClickCreateRow');
      this.forms.createRow.active = true;
    },

    async onClickApplyCreateRow(dataForm) {
      logR('warn', 'ManageDatabase:onClickApplyCreateRow');
      this.forms.createRow.load = true;
      console.log(dataForm);

      const response = await this.tableBlock.serviceTable.createRow(dataForm);
      console.log(response);
      this.createErrorNotificationIfNonOk(response);
      await this.updateDataTable();
      this.forms.createRow.load = false;
    },

    onClickCancelCreateRow() {
      logR('warn', 'ManageDatabase:onClickCancelCreateRow');
      this.forms.createRow.active = false;
    },

    onClickUpdateRow(dataRow) {
      logR('warn', 'ManageDatabase:onClickUpdateRow');
      console.log(dataRow);
      const tableController = this.tableBlock.currentTableName;
      const modelTable = this.tableBlock.modelsTable[tableController];
      const model = new modelTable();
      console.log(model);
      for (let prop in model.data) {
        model.data[prop] = dataRow[prop];
      }
      this.forms.updateRow.model = model;
      this.forms.updateRow.active = true;
    },

    async onClickApplyUpdateRow(dataForm) {
      logR('warn', 'ManageDatabase:onClickApplyUpdateRow');
      this.forms.updateRow.load = true;
      console.log(dataForm);

      const response = await this.tableBlock.serviceTable.updateRow(dataForm);
      console.log(response);
      this.createErrorNotificationIfNonOk(response);
      this.forms.updateRow.load = false;
      await this.updateDataTable();
      this.forms.updateRow.active = false;
    },

    onClickCancelUpdateRow() {
      logR('warn', 'ManageDatabase:onClickCancelUpdateRow');
      this.forms.updateRow.active = false;
    },

    async onClickDeleteTableCard(rowData) {
      logR('warn', 'ManageDatabase:onClickDeleteTableCard');
      this.tableBlock.render = true;
      let itemId = null;
      const tableController = this.tableBlock.currentTableName;
      if (tableController === 'educational_institution') {
        itemId = rowData[`edu_id`];
      } else if (tableController === 'crime_scene_report') {
        itemId = rowData[`csr_id`];
      } else if (tableController === 'event_checkin') {
        itemId = rowData[`ec_id`];
      } else if (tableController === 'driver_license') {
        itemId = rowData[`license_id`];
      } else if (tableController === 'pet') {
        itemId = rowData[`id`];
      } else {
        itemId = rowData[`${tableController}_id`];
      }
      const response = await this.tableBlock.serviceTable.deleteRow(itemId);
      await this.updateDataTable();
      this.createErrorNotificationIfNonOk(response);

      this.tableBlock.render = false;
    },
  },
});
</script>
