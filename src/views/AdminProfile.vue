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
              <div v-if="arrays.stories.length > 0" class="container-cards">
                <div class="container-card-stories">
                  <card-story
                    v-for="story in arrays.stories.slice(
                      getSliceStoriesForView.start,
                      getSliceStoriesForView.end
                    )"
                    :key="story.id"
                    :title="story.title"
                    :storyId="story.id"
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
                          @click="onClickDeleteStory(story)"
                        >
                          <n-icon size="20" color="red">
                            <icon-delete />
                          </n-icon>
                        </n-button>
                      </template>
                    </n-popconfirm>
                  </card-story>
                </div>
                <n-space justify="center" align="center">
                  <n-button
                    class="icon-layout-pagination"
                    :disabled="storiesBlock.currentPage == 1"
                    @click="onClickPrevPageStory"
                  >
                    <n-icon size="20" color="black">
                      <icon-arrow-left />
                    </n-icon>
                  </n-button>
                  <span class="font-bold font-color-white">{{
                    storiesBlock.currentPage + '/' + storiesBlock.countPage
                  }}</span>
                  <n-button
                    class="icon-layout-pagination icon-right-arrow"
                    text
                    :disabled="
                      storiesBlock.currentPage >= storiesBlock.countPage
                    "
                    @click="onClickNextPageStory"
                  >
                    <n-icon size="20" color="black">
                      <icon-arrow-left />
                    </n-icon>
                  </n-button>
                </n-space>
              </div>
              <div v-else class="container-empty">
                <n-empty description="Список историй пуст" class=""> </n-empty>
              </div>
            </n-scrollbar>
          </div>
        </n-layout-header>
        <n-layout-content></n-layout-content>
      </n-layout>

      <c-form
        v-if="forms.createStory.active"
        :isActive="forms.createStory.active"
        :isSuccess="forms.isSuccess.active"
        title="Создание истории"
        successTitle="История создана"
        successDescription="Добавить к истории обложку?"
        :itemModel="forms.createStory.model"
        labelApplyButton="Создать"
        :applyFunction="onClickApplyCreateStory"
        :cancelFunction="onClickCancelCreateStory"
      >
        <n-space justify="center">
          <!--   -->
          <n-upload
            v-if="forms.isSuccess.active"
            v-model:file-list="arrays.fileList"
            :action="`http://localhost:8080/api/userDB/stories_images/create?story_id=${currentStoryId}`"
            :headers="{Authorization: accessToken}"
            :default-upload="true"
            :file-list="arrays.fileList"
            list-type="image-card"
            :max="1"
            @finish="onUploadFileFinish"
          >
            Загрузить обложку
          </n-upload>
        </n-space>
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
          Добавить обложку
        </n-upload>
      </c-form>
    </n-layout>
  </div>
</template>

<script type="text/javascript">
import {defineComponent} from 'vue';

import {NAvatar} from 'naive-ui';
import CardStory from '@/UI/CardStory.vue';

import {logR} from '@/services/utils';
import CreateStory from '@/models/model.create.story';
import ServiceStoryImage from '@/services/story.image.service';
import StoryService from '@/services/story.service';

export default defineComponent({
  components: {'n-avatar': NAvatar, 'card-story': CardStory},
  data() {
    return {
      sidebar: {active: false, rows: []},
      render: {main: false},
      currentStoryId: null,
      storiesBlock: {
        countPage: 1,
        currentStartIdEl: 0,
        currentPage: 1,
        countStoriesPage: 4,
      },
      forms: {
        createStory: {active: false, model: CreateStory},
        updateStory: {active: false, model: CreateStory, selectedStoryId: null},
        isSuccess: {active: false, message: ''},
      },
      arrays: {
        fileList: [],
        stories: [],
      },
    };
  },

  computed: {
    accessToken() {
      return 'Bearer ' + this.$store.state.auth.tokenUser.accessToken;
    },
    tokenUser() {
      return this.$store.state.auth.tokenUser;
    },
    userData() {
      return this.$store.state.auth.tokenData
        ? this.$store.state.auth.tokenData
        : null;
    },
    getSliceStoriesForView() {
      return {
        start: this.storiesBlock.currentStartIdEl,
        end:
          this.storiesBlock.currentStartIdEl +
          this.storiesBlock.countStoriesPage,
      };
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
      // const responseStoriesImage = await ServiceStoryImage.get
      if (responseStories.status == 200) {
        const countPage = Math.ceil(
          responseStories.data.length / this.storiesBlock.countStoriesPage
        );
        this.storiesBlock.countPage = countPage;
        this.arrays.stories = responseStories.data;
      }
    }
    this.render.main = false;
  },

  methods: {
    clearCurrentStoryId() {
      this.currentStoryId = null;
    },
    updateCountPageInStoriesBox() {
      const countPageStories = Math.ceil(
        this.arrays.stories.length / this.storiesBlock.countStoriesPage
      );
      console.error('COUNT PAGES\n', countPageStories);
      this.storiesBlock.countPage = countPageStories;
    },
    onUploadFileFinish() {
      logR('warn', 'onUploadFile');
    },
    onClickCreateStory() {
      logR('ADMIN PROFILE:onCLickCreateStory');
      this.forms.createStory.active = true;
      console.log(this.createStory);
    },
    async onClickApplyCreateStory(dataForm) {
      logR('warn', 'ADMIN PROFILE:onClickApplyCreateStory');
      console.log(ServiceStoryImage);
      console.log(dataForm);

      const response = await this.$store.dispatch(
        'story/createStory',
        dataForm
      );
      if (response.status == 200) {
        const splitResponse = response.data.split(':');
        const storyId = Number(splitResponse.at(1));
        dataForm['id'] = storyId;

        this.arrays.stories.splice(this.arrays.stories.length, 0, dataForm);
        this.currentStoryId = storyId;
        this.forms.isSuccess.active = true;
        this.updateCountPageInStoriesBox();
      } else {
        this.$store.commit('notification/SET_ACTIVE_ERROR', response.message);
      }
    },
    clearSuccessForm() {
      this.forms.isSuccess.active = false;
      this.forms.isSuccess.message = '';
    },
    onClickCancelCreateStory() {
      logR('warn', 'PROFILE:onClickCancelCreateStory');
      this.forms.createStory.active = false;
      this.clearSuccessForm();
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
    async onClickDeleteStory(storyData) {
      console.error('todo: onClickDeleteStory');
      console.log(storyData);
      const stories = this.arrays.stories;
      const storyId = storyData.id;

      const response = await StoryService.storyDelete(storyId);
      console.log(response);
      if (response.status == 200) {
        const filteredStories = await stories.filter((story) => {
          return story.id != storyId;
        });
        this.arrays.stories = filteredStories;
        this.updateCountPageInStoriesBox();
      }
    },
    onClickToLink(url) {
      url.length > 0 ? this.$router.push(url) : '';
    },

    onClickNextPageStory() {
      logR('warn', 'AdminProfile: onClickNextPageStory');
      // storiesBlock: {
      //   countPage: 1,
      //   currentStartIdEl: 0,
      //   currentPage: 1,
      //   countStoriesPage: 4,
      // },

      this.storiesBlock.currentPage += 1;
      const idElStarted =
        this.storiesBlock.currentStartIdEl + this.storiesBlock.countStoriesPage;
      this.storiesBlock.currentStartIdEl = idElStarted;
    },

    onClickPrevPageStory() {
      logR('warn', 'AdminProfile: onClickPrevPageStory');
      this.storiesBlock.currentPage -= 1;
      this.storiesBlock.currentStartIdEl -= this.storiesBlock.countStoriesPage;
    },
  },
});
</script>
