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
                  userData.role.split('_')[1].toLowerCase() == 'user'
                    ? 'игрок'
                    : 'администратор'
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
                <n-spin
                  v-if="
                    forms.updateStory.active ||
                    forms.createStory.active ||
                    states.delete.story
                  "
                ></n-spin>
                <div v-else class="container-card-stories">
                  <div
                    v-for="story in arrays.stories[
                      storiesBlock.currentPage - 1
                    ]"
                    :key="story.id"
                  >
                    <card-story
                      v-if="!storiesBlock.render"
                      :title="story.title"
                      :storyId="story.id"
                      :description="story.description"
                      :difficulty="story.difficulty"
                    >
                      <n-popconfirm :show-icon="false">
                        <template #trigger>
                          <n-icon
                            size="30"
                            color="white"
                            class="card-story-menu"
                          >
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
            :action="`${API_URL}/userDB/stories_images/create?story_id=${currentStoryId}`"
            :headers="{Authorization: accessToken}"
            :default-upload="true"
            :file-list="arrays.fileList"
            list-type="image-card"
            :max="1"
            @finish="onUploadFileFinish"
            @remove="onClickRemoveImage"
          >
            Загрузить обложку
          </n-upload>
          <n-button
            v-if="arrays.fileList.length > 0"
            @click="onClickCancelCreateStory"
            >Готово!</n-button
          >
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
        <n-space justify="center">
          <n-upload
            :action="`${API_URL}/userDB/stories_images/${
              currentStoryHasImg ? 'update' : 'create'
            }?story_id=${currentStoryId}`"
            :headers="{Authorization: accessToken}"
            v-model:file-list="arrays.fileList"
            :default-upload="true"
            :file-list="arrays.fileList"
            list-type="image-card"
            :max="1"
            @finish="onUploadFileFinish"
            @remove="onClickRemoveImage"
          >
            {{ currentStoryHasImg ? 'Обновить обложку' : 'Добавить обложку' }}
          </n-upload>
          <n-alert
            type="warning"
            title="После выбора картинки обложка будет автоматически обновлена"
          ></n-alert>
        </n-space>
      </c-form>
    </n-layout>
  </div>
</template>

<script type="text/javascript">
import {defineComponent} from 'vue';

import {NAvatar} from 'naive-ui';
import CardStory from '@/components/CardStory.vue';

import {logR, toChunks} from '@/services/utils';
import CreateStory from '@/models/model.create.story';
import ServiceStoryImage from '@/services/story.image.service';
import StoryService from '@/services/story.service';
import {API_URL} from '@/api/main';

export default defineComponent({
  components: {
    'n-avatar': NAvatar,
    'card-story': CardStory,
  },
  data() {
    return {
      API_URL,
      sidebar: {active: false, rows: []},
      render: {main: false},
      states: {delete: {story: false}},
      currentStoryId: null,
      currentStoryHasImg: false,
      storiesBlock: {
        render: false,
        countPage: 1,

        currentPage: 1,
        countStoriesPage: 4,
      },
      forms: {
        createStory: {active: false, model: {}},
        updateStory: {active: false, model: {}, selectedStory: {}},
        isSuccess: {active: false, message: ''},
      },
      arrays: {
        fileList: [],
        stories: [],
        idsImagesStories: [],
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
  },
  async created() {
    // TODO: Подгрузка историй с бека
    this.render.main = true;
    if (!this.userData) {
      this.$router.push({name: 'home'});
    } else {
      this.sidebar.rows = this.$store.state.user.userSidebar.admin;
      this.forms.createStory.model = new CreateStory();
      const stories = await StoryService.getStories();
      const idsImagesStories = await ServiceStoryImage.getIdsImagesStories();

      console.log('STORIES\n', stories);
      const chunksStories = toChunks(stories, 4);
      console.log('CHUNKS\n', chunksStories);
      this.arrays.stories = chunksStories.reverse();
      this.arrays.idsImagesStories = idsImagesStories;

      this.storiesBlock.countPage = chunksStories.length;
    }
    this.render.main = false;
  },

  methods: {
    clearCurrentStoryId() {
      this.currentStoryId = null;
    },
    updateCountPageInStoriesBox() {
      const lengthStories = this.arrays.stories.length;
      this.storiesBlock.countPage = lengthStories;
    },
    onUploadFileFinish() {
      logR('warn', 'onUploadFile');
      console.log(this.currentStoryId);
      this.arrays.idsImagesStories.push(this.currentStoryId);
    },
    async onClickRemoveImage() {
      logR('warn', 'OnClickRemove');
      await ServiceStoryImage.deleteStoryImg(this.currentStoryId);
    },
    onClickCreateStory() {
      logR('ADMIN PROFILE:onCLickCreateStory');
      this.forms.createStory.active = true;
    },
    onClickCancelCreateStory() {
      logR('warn', 'PROFILE:onClickCancelCreateStory');
      this.forms.createStory.active = false;
      this.forms.createStory.model = new CreateStory();
      this.arrays.fileList = [];
      this.clearSuccessForm();
    },
    async onClickApplyCreateStory(dataForm) {
      logR('warn', 'ADMIN PROFILE:onClickApplyCreateStory');
      console.log(dataForm);

      const response = await this.$store.dispatch(
        'story/createStory',
        dataForm
      );
      if (response.status == 200) {
        let firstPageStories = this.arrays.stories[0];
        const splitResponse = response.data.split(':');
        const storyId = Number(splitResponse.at(1));
        dataForm['id'] = storyId;

        this.currentStoryId = storyId;
        this.forms.isSuccess.active = true;
        if (this.arrays.stories.length == 0) {
          this.arrays.stories.push([dataForm]);
        } else {
          console.log('ARRAYS STORIES\n', this.arrays.stories);
          const firstArrayLength = firstPageStories.length;
          console.log('LAST ELEMENT LENGTH\n', firstArrayLength);
          if (firstArrayLength < this.storiesBlock.countStoriesPage) {
            console.log('laste element lestt');
            firstPageStories.push(dataForm);
            this.arrays.stories[0] = firstPageStories;
          } else {
            this.arrays.stories.push([dataForm]);
          }
        }

        // this.onClickCancelCreateStory();
        this.updateCountPageInStoriesBox();
      } else {
        this.$store.commit('notification/SET_ACTIVE_ERROR', response.message);
      }
    },
    clearSuccessForm() {
      this.forms.isSuccess.active = false;
      this.forms.isSuccess.message = '';
    },

    onClickStory() {
      logR('error', 'todo:ADMIN PROFILE:onClickStory');
    },
    onClickUpdateStory(dataStory) {
      console.error('todo: onClickUpdateStory');

      const model = new CreateStory();
      for (let prop in model.data) {
        model.data[prop] = dataStory[prop];
      }

      this.forms.updateStory.model = model;
      const idsImagesStories = this.arrays.idsImagesStories;
      console.log(idsImagesStories);
      this.currentStoryHasImg = idsImagesStories.find(
        (element) => element == dataStory.id
      )
        ? true
        : false;
      this.currentStoryId = dataStory.id;
      this.forms.updateStory.active = true;
    },
    async onClickApplyUpdateStory(dataStory) {
      logR('warn', 'AdminProfile: onClickApplyUpdateStory');
      dataStory['id'] = this.currentStoryId;
      const response = await StoryService.updateStory(dataStory);
      if (response.status != 200) {
        this.$store.commit('notification/SET_ACTIVE_ERROR', response.message);
      }

      const stories = this.arrays.stories[this.storiesBlock.currentPage - 1];
      const idUpdateStory = stories.findIndex(
        (story) => story.id == this.currentStoryId
      );
      stories.splice(idUpdateStory, 1, dataStory);
      this.onClickCancelUpdateStory();
    },
    onClickCancelUpdateStory() {
      logR('warn', 'AdminProfile: onClickCancelUpdateStory');
      this.forms.updateStory.active = false;
      this.arrays.fileList = [];
    },
    async onClickDeleteStory(storyData) {
      this.states.delete.story = true;
      console.error('todo: onClickDeleteStory');
      console.log(storyData);

      const storyId = storyData.id;

      const response = await StoryService.storyDelete(storyId);
      console.log(response);
      if (response.status == 200) {
        const stories = await StoryService.getStories();
        const storiesChunks = toChunks(
          stories,
          this.storiesBlock.countStoriesPage
        );

        this.arrays.stories = storiesChunks;
        this.updateCountPageInStoriesBox();
      }
      this.states.delete.story = false;
    },
    onClickToLink(url) {
      url.length > 0 ? this.$router.push(url) : '';
    },

    onClickNextPageStory() {
      logR('warn', 'AdminProfile: onClickNextPageStory');
      this.storiesBlock.currentPage += 1;
    },

    onClickPrevPageStory() {
      logR('warn', 'AdminProfile: onClickPrevPageStory');
      this.storiesBlock.currentPage -= 1;
    },
  },
});
</script>
