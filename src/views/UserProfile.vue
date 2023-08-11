<template>
  <n-modal v-if="render.main" v-model:show="render.main" :mask-closable="false">
    <n-spin size="large"></n-spin
  ></n-modal>
  <div v-else class="page-content">
    <n-layout has-sider v-if="userData">
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed="collapsed"
        :collapsed-width="collapsed ? '.5em' : '6em'"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-card v-if="!collapsed">
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
          <span class="font-bold">Пройдено</span>
          <n-progress
            class="user-progress-container"
            type="line"
            :percentage="sidebar.userInfo.progress"
          ></n-progress>

          <div
            class="profile-sidebar-link"
            v-for="row in sidebar.rows"
            :key="row.id"
            @click="onClickToLink(row.url)"
            @mouseover="onTextHover[row.url] = true"
            @mouseleave="onTextHover[row.url] = false"
          >
            <span class="profile-sidebar-row-border"></span>
            <span
              :class="`profile-sidebar-row-text ${
                onTextHover[row.url] ? 'font-red' : ''
              }`"
            >
              {{ row.title }}
            </span>
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
                    <n-popover trigger="click" overlap placement="top">
                      <template #trigger>
                        <card-story
                          @click="onClickStory(story.id)"
                          class="cursor-layout"
                          v-if="!storiesBlock.render"
                          :title="story.title"
                          :storyId="story.id"
                          :description="story.description"
                          :difficulty="story.difficulty"
                        >
                        </card-story>
                      </template>
                      <n-select
                        v-if="storyStats.selectedStatsStory.length > 0"
                        :consistent-menu-width="false"
                        :options="storyStats.selectedStatsStory"
                        v-model:value="storyStats.selectedStats"
                      >
                      </n-select>
                      <div v-else>Статистика по истории отсутствует</div>
                      <!-- <div v-if="dicts.stats[story.id]"></div> -->
                      <n-skeleton v-if="storyStats.render"></n-skeleton>
                      <div
                        v-else-if="
                          storyStats.currentStoryStats[storyStats.selectedStats]
                        "
                      >
                        <n-space vertical justify="center">
                          <div
                            class="stats-row-container"
                            v-for="(stat, id) in Object.keys(
                              forms.showStats.model.labels
                            )"
                            :key="id"
                          >
                            <span class="label-row">
                              {{ forms.showStats.model.labels[stat] }}
                            </span>

                            <span class="value-row">
                              {{
                                storyStats.currentStoryStats[
                                  storyStats.selectedStats
                                ][stat]
                              }}
                            </span>
                          </div>
                        </n-space>
                      </div>
                    </n-popover>
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
                <n-empty description="Список историй пуст" class="empty-block">
                </n-empty>
              </div>
            </n-scrollbar>
          </div>
        </n-layout-header>

        <n-layout-content class="user-profile-content-container">
          <n-space justify="center" align="center">
            <n-card title="Cтатистика баллов" class="stats-block-container">
              <template #header-extra>
                <n-icon
                  size="15"
                  :class="`cursor-layout ${
                    statsBlock.active ? 'rotate-0-deg' : 'rotate-180-deg'
                  }`"
                  @click="onClickChart"
                  ><icon-triangle-up color="black"
                /></n-icon>
              </template>

              <canvas id="acquisitions"></canvas>
            </n-card>
          </n-space>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script type="text/javascript">
import {defineComponent} from 'vue';

import {NAvatar} from 'naive-ui';
import CardStory from '@/components/CardStory.vue';

import CreateStory from '@/models/model.create.story';
import UserStats from '@/models/model.user.stats';

import ServiceStoryImage from '@/services/story.image.service';
import StoryService from '@/services/story.service';
import {logR, toChunks} from '@/services/utils';
import UserStatsService from '@/services/user.stats.service';

import {API_URL} from '@/api/main';

import Chart from 'chart.js/auto';

export default defineComponent({
  components: {
    'n-avatar': NAvatar,
    'card-story': CardStory,
  },
  data() {
    return {
      API_URL,
      onTextHover: {},
      collapsed: false,
      sidebar: {
        active: false,
        rows: [],
        userInfo: {progress: 0},
      },
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
      storyStats: {
        render: false,
        selectedStats: 'Прохождение',
        selectedStatsStory: [],
        currentStoryStats: {},
      },
      forms: {
        createStory: {active: false, model: {}},
        updateStory: {active: false, model: {}, selectedStory: {}},
        isSuccess: {active: false, message: ''},
        showStats: {active: false, model: new UserStats()},
      },
      // INFO: Блок со статистикой===============
      statsBlock: {
        active: false,
        chart: null,
        state: {createChart: false, clearChart: false},
        labels: [],
        datasets: [
          {
            label: 'Распределение баллов по историям',
            data: [],
            borderWidth: 1,
          },
        ],
      },
      // INFO: =================================
      arrays: {
        fileList: [],
        stories: [],
        idsImagesStories: [],
      },
      dicts: {
        stories: {},
        stats: {},
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
      const usersStats = await UserStatsService.getStatsCurrentUser();
      const stories = await StoryService.getStoriesForUser();
      // INFO: DictsStories==========================================
      // let dictsStats = {};
      stories.forEach((story) => {
        this.dicts.stories[story.id] = story;
      });

      // INFO: DictsStories==========================================
      const labelsStats = usersStats.map((stats) => {
        this.dicts.stats[stats.story_id] = stats;
        return this.dicts.stories[stats.story_id].title;
      });

      const dataStats = usersStats.map((stats) => stats.scores);
      console.log('DATASTATS\n', dataStats);
      this.statsBlock.datasets[0].data = dataStats;
      this.statsBlock.labels = labelsStats;
      const countStories = stories.length;
      let completeStories = 0;
      console.error('USERS STATS:\n', usersStats);
      usersStats.forEach((stats) => {
        const iscompleteToNumber = Number(stats.is_completed);
        console.error(iscompleteToNumber);
        completeStories += iscompleteToNumber;
      });

      this.sidebar.rows = this.$store.state.user.userSidebar.user;
      this.forms.createStory.model = new CreateStory();
      console.log(`COMPLETE STORIES:${completeStories}`);
      const progress = Number(completeStories / countStories);
      this.sidebar.userInfo.progress = Number.isNaN(progress)
        ? 0
        : Math.round(progress * 100);

      console.log(`COUNT STORIES\n${countStories}`);
      const idsImagesStories = await ServiceStoryImage.getIdsImagesStories();

      const chunksStories = toChunks(stories, 4);

      this.arrays.stories = chunksStories;
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

    async onClickStory(storyId) {
      logR('error', 'todo:ADMIN PROFILE:onClickStory');
      this.storyStats.selectedStats = 'Прохождение';
      this.storyStats.render = true;
      this.storyStats.selectedStatsStory = [];
      this.storyStats.currentStoryStats = {};

      const storyStats = await UserStatsService.getStatsForUsersByStoryId(
        storyId
      );
      let selectedStatsStory = [];
      for (let i in storyStats) {
        let statsOfStory = storyStats[i];
        if (statsOfStory.is_completed) {
          statsOfStory.game_end_date = statsOfStory.game_end_date.split('T')[0];
          statsOfStory.is_completed = 'Да';
        } else {
          statsOfStory.is_completed = 'Нет';
          statsOfStory.scores = 0;
          statsOfStory.game_end_date = '';
        }
        console.error(statsOfStory);
        selectedStatsStory.push({
          label: `Прохождение ${Number(i) + 1}`,
          value: statsOfStory.id,
        });

        this.storyStats.currentStoryStats[statsOfStory.id] = statsOfStory;
      }
      this.storyStats.selectedStatsStory = selectedStatsStory;
      console.log(storyStats);
      this.storyStats.render = false;
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

    async createChart() {
      logR('warn', 'AdminProfile: createChart');
      const data = this.statsBlock;
      this.statsBlock.chart = new Chart(
        document.getElementById('acquisitions'),
        {
          type: 'bar',
          data: data,
        }
      );
    },
    async onClickChart() {
      logR('warn', 'UserProfile: onClickChart');
      this.statsBlock.active = !this.statsBlock.active;

      if (this.statsBlock.active) {
        console.log('CREATE CHART');

        await this.createChart();
      } else {
        console.log('DESTROYED CHART');
        if (!this.statsBlock.chart.id) {
          this.statsBlock.chart.destroy();
        }
      }
    },
  },
});
</script>
