<template>
  <n-modal v-if="render.main" v-model:show="render.main" :mask-closable="false">
    <n-spin size="large"></n-spin
  ></n-modal>
  <div v-else class="page-content">
    <n-layout has-sider v-if="userData">
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
                <span class="profile_username">{{
                  userData ? userData.sub : ''
                }}</span>
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
        <!--  $router.currentRoute._value.name -->
        <n-layout-header class="img-header-profile">
          <n-space justify="center" align="center">
            <n-popover trigger="hover">
              <template #trigger>
                <div class="profile-story" @click="onClickCreateStory">
                  <n-space justify="center" align="center">
                    <n-icon size="50" color="white" class="profile-icon-story">
                      <icon-add />
                    </n-icon>
                  </n-space>
                </div>
              </template>
              <span> Создать историю </span>
            </n-popover>
          </n-space>
        </n-layout-header>
        <n-layout-content></n-layout-content>
      </n-layout>
      <c-form
        v-if="forms.createStory.active"
        :isActive="forms.createStory.active"
        title="Создание истории"
        :itemModel="forms.createStory.model"
        labelApplyButton="Создать"
        :applyFunction="onClickApplyCreateStory"
        :cancelFunction="onClickCancelCreateStory"
      >
        <n-upload
          v-model:file-list="arrays.fileList"
          @preview="onUploadFile"
          :default-upload="true"
          :file-list="arrays.fileList"
          list-type="image-card"
          :max="1"
          :data="dataImage"
        >
          Загрузить картинку
        </n-upload>
        {{ arrays.fileList }}
      </c-form>
    </n-layout>
  </div>
</template>

<script type="text/javascript">
import {defineComponent} from 'vue';
import {mapGetters} from 'vuex';
import {NAvatar} from 'naive-ui';
import {logR, getBinaryFromFile} from '@/services/utils';
import CreateStory from '@/models/model.create.story';

export default defineComponent({
  components: {'n-avatar': NAvatar},
  data() {
    return {
      sidebar: {active: false, rows: []},
      render: {main: false},
      forms: {createStory: {active: false, model: CreateStory}},
      dataImage: {},
      arrays: {
        fileList: [],
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
    }),
    userData() {
      return this.$store.state.auth.tokenData
        ? this.$store.state.auth.tokenData
        : null;
    },
  },
  async created() {
    // TODO: Подгрузка историй с бека
    this.render.main = true;
    if (!this.userData) {
      this.$router.push({name: 'home'});
    } else {
      // const dataUser = this.$store.state.auth.dataLogin;

      this.sidebar.rows = this.$store.state.user.userSidebar.admin;
    }
    this.render.main = false;
  },

  methods: {
    async onUploadFile(data) {
      logR('warn', 'onUploadFile');
      console.log(data);
      console.log(this.dataImage);
      console.log(this.fileList);
      const file = data.file;
      const binary = await getBinaryFromFile(file);
      console.log(binary);
    },
    onClickCreateStory() {
      logR('ADMIN PROFILE:onCLickCreateStory');
      this.forms.createStory.active = true;
      console.log(this.createStory);
    },
    onClickInfoStory() {
      logR('ADMIN PROFILE:onClickInfoStory');
    },
    onClickStory() {
      logR('warn', 'ADMIN PROFILE:onClickStory');
    },
    onClickToLink(url) {
      url.length > 0 ? this.$router.push(url) : '';
    },
    async onClickApplyCreateStory(dataForm) {
      logR('warn', 'ADMIN PROFILE:onClickApplyCreateStory');
      if (this.arrays.fileList.length > 0) {
        let file = this.arrays.fileList[0].file;
        let binary = await getBinaryFromFile(file);
        console.log(binary);
        // TODO: создать запрос на загрузку изображения
      }

      const response = await this.$store.dispatch(
        'story/createStory',
        dataForm
      );
      if (response.status == 200) {
        console.log(response);
      } else {
        this.$store.commit('notification/SET_ACTIVE_ERROR', response.message);
      }
    },

    onClickCancelCreateStory() {
      logR('warn', 'PROFILE:onClickCancelCreateStory');
      this.forms.createStory.active = false;
    },
  },
});
</script>
