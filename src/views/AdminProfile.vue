<template>
  <n-modal v-if="render.main" v-model:show="render.main" :mask-closable="false">
    <n-spin size="large"></n-spin
  ></n-modal>
  <div v-else class="page-content">
    <n-layout has-sider v-if="userData">
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
        <n-layout-header class="img-header-profile container-header-profile">
          <div class="header-image">
            <div
              class="profile-story-box story-card story-card-add"
              @click="onClickCreateStory"
            >
              <n-space justify="center" align="center" vertical>
                <span class="font-header-card"> Создать историю </span>
                <n-icon size="50" color="white">
                  <icon-add />
                </n-icon>
              </n-space>
            </div>
            <n-scrollbar>
              <div class="container-card-stories">
                <card-story
                  v-for="story in arrays.stories"
                  :key="story.id"
                  :title="story.title"
                  :description="story.description"
                  :difficulty="story.difficulty"
                >
                  <n-popconfirm :show-icon="false">
                    <template #trigger>
                      <n-icon size="30" color="white" class="card-story-menu">
                        <icon-menu-story />
                      </n-icon>
                    </template>
                    <template #action>
                      <n-button
                        circle
                        size="tiny"
                        ghost
                        @click="onClickUpdateStory(story)"
                      >
                        <n-icon size="20" color="orange">
                          <icon-edit />
                        </n-icon>
                      </n-button>
                      <n-button
                        circle
                        size="tiny"
                        ghost
                        @click="onClickDeleteStory"
                      >
                        <n-icon size="20" color="red">
                          <icon-delete />
                        </n-icon>
                      </n-button>
                    </template>
                  </n-popconfirm>
                </card-story>
              </div>
            </n-scrollbar>
          </div>
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
      </c-form>

      <c-form
        v-if="forms.updateStory.active"
        :isActive="forms.updateStory.active"
        title="Редактирование истории"
        :itemModel="forms.updateStory.model"
        labelApplyButton="Обновить"
        :applyFunction="onClickApplyUpdateStory"
        :cancelFunction="onClickCancelUpdateStory"
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
      </c-form>
    </n-layout>
  </div>
</template>

<script type="text/javascript">
import {defineComponent} from 'vue';
import {mapGetters} from 'vuex';

import {NAvatar} from 'naive-ui';
import CardStory from '@/UI/CardStory.vue';

import {logR, getBinaryFromFile} from '@/services/utils';
import CreateStory from '@/models/model.create.story';
import ServiceStoryImage from '@/services/story.image.service';
import StoryService from '@/services/story.service';

export default defineComponent({
  components: {'n-avatar': NAvatar, 'card-story': CardStory},
  data() {
    return {
      sidebar: {active: false, rows: []},
      render: {main: false},
      forms: {
        createStory: {active: false, model: CreateStory},
        updateStory: {active: false, model: CreateStory, selectedStoryId: null},
      },
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
      this.sidebar.rows = this.$store.state.user.userSidebar.admin;
      const responseStories = await StoryService.getStories();
      this.arrays.stories = responseStories.data;
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
    async onClickApplyCreateStory(dataForm) {
      logR('warn', 'ADMIN PROFILE:onClickApplyCreateStory');

      const response = await this.$store.dispatch(
        'story/createStory',
        dataForm
      );
      if (response.status == 200) {
        console.log(response);
        if (this.arrays.fileList.length > 0) {
          let file = this.arrays.fileList[0].file;
          // TODO: создать запрос на загрузку изображения
          let binaryFile = await getBinaryFromFile(file);
          console.log(binaryFile);
          await ServiceStoryImage.uploadImage(binaryFile);
          // TODO: создать запрос на загрузку изображения
        }
      } else {
        this.$store.commit('notification/SET_ACTIVE_ERROR', response.message);
      }
    },
    onClickCancelCreateStory() {
      logR('warn', 'PROFILE:onClickCancelCreateStory');
      this.forms.createStory.active = false;
    },
    onClickStory() {
      logR('error', 'todo:ADMIN PROFILE:onClickStory');
    },
    onClickUpdateStory(dataStory) {
      console.error('todo: onClickUpdateStory');
      for (let prop in this.forms.updateStory.model.data) {
        this.forms.updateStory.model.data[prop] = dataStory[prop];
      }
      this.forms.updateStory.active = true;
    },
    async onClickApplyUpdateStory(dataStory) {
      logR('warn', 'AdminProfile: onClickApplyUpdateStory');
      console.log(dataStory);
    },
    onClickCancelUpdateStory() {
      logR('warn', 'AdminProfile: onClickCancelUpdateStory');
      this.forms.updateStory.active = false;
    },
    onClickDeleteStory() {
      console.error('todo: onClickDeleteStory');
    },
    onClickToLink(url) {
      url.length > 0 ? this.$router.push(url) : '';
    },
  },
});
</script>
