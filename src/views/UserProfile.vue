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
              <div class="info-user-container">
                <span class="profile_username">{{
                  userData ? userData.sub : ''
                }}</span>
                <span class="profile_role">{{
                  userData.role.split('_')[1].toLowerCase() == 'user'
                    ? 'игрок'
                    : 'администратор'
                }}</span>
              </div>
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
    logR('warn', 'USER.PROFILE: created');
    this.render.main = true;
    if (!this.userData) {
      this.$router.push({name: 'home'});
    } else {
      console.log(this.userData);
      this.sidebar.rows = this.$store.state.user.userSidebar.user;
      this.forms.createStory.model = new CreateStory();
      const stories = await StoryService.getStoriesForUser();
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

    clearSuccessForm() {
      this.forms.isSuccess.active = false;
      this.forms.isSuccess.message = '';
    },

    onClickStory() {
      logR('error', 'todo:ADMIN PROFILE:onClickStory');
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
