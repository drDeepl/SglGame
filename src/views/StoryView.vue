<template>
  <div>
    <!-- <n-image
          class="carousel-img"
          preview-disabled
          lazy
          v-for="story in arrays.story"
          :key="story.id"
          :src="require('@/assets/img/history_' + story.title + '.jpg')"
        >
          <n-upload></n-upload>
        </n-image> -->
    <n-empty
      v-if="arrays.stories.length == 0"
      size="huge"
      description="Готовых историй ещё нет.."
      class="empty-stories-container"
    ></n-empty>
    <div v-else class="preview-story-container">
      <div class="preview-story-content">
        <div
          v-for="story in arrays.stories[storiesBlock.currentPage - 1]"
          :key="story.id"
        >
          <card-story
            @click="onClickHistory(story)"
            class="cursor-layout"
            v-if="!render.storiesBlock"
            :title="story.title"
            :storyId="story.id"
            :description="story.description"
            :difficulty="story.difficulty"
          >
          </card-story>
        </div>
      </div>
      <n-space justify="end" align="center" class="pagination-container">
        <n-button
          class="icon-layout-pagination soft-shadow"
          :disabled="storiesBlock.currentPage == 1"
          @click="onClickPrevPageStory"
        >
          <n-icon size="20" color="black">
            <icon-arrow-left />
          </n-icon>
        </n-button>
        <n-button class="font-bold soft-shadow">{{
          storiesBlock.currentPage + '/' + storiesBlock.countPage
        }}</n-button>
        <n-button
          class="icon-layout-pagination icon-right-arrow soft-shadow"
          text
          :disabled="storiesBlock.currentPage >= storiesBlock.countPage"
          @click="onClickNextPageStory"
        >
          <n-icon size="20" color="black">
            <icon-arrow-left />
          </n-icon>
        </n-button>
      </n-space>
    </div>

    <!-- <n-carousel show-arrow>
      <div
        class="card-story-main-layer"
        v-for="story in arrays.story"
        :key="story"
        @click="onClickHistory(story)"
      >
        <n-popover trigger="hover">
          <template #trigger>
            <div>
              <div class="card-title-story">
                <span> story {{ story.title.replace('_', ' ') }} </span>
              </div>
              <img
                class="card-history-img"
                :src="require('@/assets/img/history_' + history.title + '.jpg')"
              />
            </div>
          </template>
          <n-rate readonly :default-value="story.difficulty"></n-rate
        ></n-popover>
      </div> -->
  </div>

  <n-modal
    v-if="story.active"
    v-model:show="story.active"
    :mask-closable="false"
  >
    <n-card
      class="card-main-layer-history border-top-yellow"
      :title="story.title"
      role="dialog"
      size="huge"
    >
      <template #header-extra>
        <n-button
          :disabled="render.story.runCode"
          quaternary
          circle
          type="error"
          @click="onClickCloseHistory"
        >
          <icon-close style="width: 1.7em" />
        </n-button>
      </template>
      <n-space v-if="story.loadData" justify="center">
        <n-progress
          v-if="story.loadProgress != 100"
          style="margin: 0 8px 12px 0"
          type="circle"
          :percentage="story.loadProgress"
          :color="themeVars.successColor"
          :rail-color="changeColor(themeVars.successColor, {alpha: 0.2})"
          :indicator-text-color="themeVars.successColor"
        >
        </n-progress>
        <n-spin v-if="story.loadProgress == 100 && story.loadData"></n-spin>
      </n-space>
      <div v-else class="history-card-content">
        <n-descriptions>
          <n-descriptions-item label-align="center">
            {{ story.description }}
          </n-descriptions-item>
        </n-descriptions>
        <div class="history-schema-img">Тут будет схема бд</div>
        <n-alert
          width="100%"
          v-if="codemirror.error.active"
          :title="codemirror.error.message"
          closable
          type="warning"
          :on-close="
            () => {
              (codemirror.error.active = false),
                (codemirror.error.message = '');
            }
          "
        >
        </n-alert>
        <n-code-block
          :onClickRunCodeFunc="onClickRunCode"
          :onClickClearCodeFunc="onClickClearCode"
          :loadApply="render.story.runCode"
        >
          <!-- <n-button @click="fakeData()">Случайные данные</n-button>  -->
        </n-code-block>

        <!-- <n-space justify="space-around"> -->
        <n-space justify="space-between">
          <n-input
            v-model:value="codemirror.answer"
            placeholder="Ответ:"
          ></n-input>

          <n-button>Отправить</n-button>
        </n-space>
      </div>
      <div style="margin-top: 1em">
        <n-data-table
          ref="table"
          v-if="codemirror.isWork"
          :columns="codemirror.columns"
          :data="codemirror.data"
          :pagination="codemirror.pagination"
        ></n-data-table>
      </div>
    </n-card>
  </n-modal>
  <n-modal
    v-if="alert.error.active"
    v-model:show="alert.error.active"
    :title="alert.error.message"
    :mask-closable="false"
    preset="dialog"
    @positive-click="onClickCancelErrorAlert"
    type="error"
  >
  </n-modal>
</template>

<script>
import {mapGetters} from 'vuex';
import DatabaseManager from '@/database/DatabaseManager';
import ServiceDatabase from '@/services/service.database';
import StoryService from '@/services/story.service';
// import ServiceDownloadFile from '@/services/download.service';

import {
  logR,
  prepareDataTable,
  sqlQueryIsValidate,
  toChunks,
} from '@/services/utils';
import {defineComponent} from 'vue';

// import CodeBlock from '@/UI/CodeBlock.vue';
import CardStory from '@/components/CardStory.vue';
import {changeColor} from 'seemly';
import {useThemeVars} from 'naive-ui';

export default defineComponent({
  components: {'card-story': CardStory},
  data() {
    return {
      render: {
        main: false,
        story: {runCode: false},
        storiesBlock: false,
      },
      changeColor: changeColor,
      themeVars: useThemeVars(),
      alert: {
        success: {active: false, message: ''},
        info: {active: false, message: ''},
        error: {active: false, message: ''},
      },
      storiesBlock: {
        render: false,
        countPage: 1,
        currentPage: 1,
        countStoriesPage: 4,
      },
      story: {
        active: false,
        title: '',
        description: '',
        loadData: false,
        loadProgress: 0,
        db: null,
      },
      codemirror: {
        columns: [],
        data: [],
        pagination: {pageSize: 5},
        answer: '',
        isWork: false,
        error: {active: false, message: ''},
      },

      tab: 0,
      arrays: {
        stories: [],
      },
      game: {
        step: '',
      },
    };
  },
  async created() {
    logR('warn', 'STORY VIEW: created');
    this.render.main = true;

    const user = this.userData;
    if (!user) {
      this.$router.push({name: 'home'});
      return;
    }

    const stories = await StoryService.getStories();
    console.log('CREATED: stories\n', stories);
    const chunksStories = toChunks(stories, 4);
    console.log('CHUNKS\n', chunksStories);
    this.arrays.stories = chunksStories;
    this.storiesBlock.countPage = chunksStories.length;

    this.render.main = false;
  },
  computed: {
    ...mapGetters({
      errorAlertActive: 'notification/GET_STATE_ERROR',
    }),
    tokenUser() {
      return this.$store.state.auth.tokenUser;
    },
    userData() {
      return this.$store.state.auth.tokenData
        ? this.$store.state.auth.tokenData
        : null;
    },
  },

  methods: {
    createErrorAlert(message) {
      this.alert.error.active = true;
      this.alert.error.message = message;
    },
    onClickCancelErrorAlert() {
      this.alert.error.active = false;
      this.alert.error.message = '';
    },
    async changeProgressDownloadFile(response) {
      const reader = response.body.getReader();
      // INFO: Получаю длину ответа
      // TODO: Вынести в отдельную функцию =================================================================
      const contentLength = +response.headers.get('Content-Length');
      let receivedLength = 0; // INFO: количество байт, полученных на данный момент
      console.log(reader);
      let chunks = [];
      let work = true;
      while (work) {
        const {done, value} = await reader.read();
        if (done) {
          work = false;
          return {chunks: chunks, length: receivedLength};
        }
        chunks.push(value);
        receivedLength += value.length;
        const percentage = (receivedLength * 100) / contentLength;
        this.story.loadProgress = Math.round(percentage);
        console.log(
          `Получено ${receivedLength} из ${contentLength} = ${percentage}%`
        );
      }
    },
    async onClickHistory(story) {
      // FIX: =========================================
      logR('warn', 'NAVBAR: onClickHistory');
      this.story.loadData = true;
      this.story.active = true;
      console.log(story);
      try {
        const urlToDb = 'http://localhost:8080/api/fileDB/get';
        const response2DownloadDb = await ServiceDatabase.downloadFile(
          urlToDb
        ).catch((error) => {
          console.log(error + '\n');
          console.log(Object.keys(error));
        });
        console.log('Downloaded BD\n', response2DownloadDb);
        const chunkDb = await this.changeProgressDownloadFile(
          response2DownloadDb
        );
        const chunksAll = new Uint8Array(chunkDb.length);
        let position = 0;
        for (let chunk of chunkDb.chunks) {
          chunksAll.set(chunk, position);
          position += chunk.length;
        }
        // INFO: Create db from chunksAll
        this.story.db = await DatabaseManager.createDatabase(chunksAll);
      } catch (e) {
        this.createErrorAlert('Что-то пошло не так');
        this.story.active = false;
      } finally {
        this.story.title = story.title;
        this.story.description = story.description;
        this.story.loadData = false;
      }

      // FIX: =========================================
    },
    onClickClearCode() {
      this.codemirror.data = [];
      this.codemirror.columns = [];
      this.codemirror.isWork = false;
    },
    async onClickRunCode(query) {
      logR('warn', 'NAVBAR: onClickRunCode');
      this.render.story.runCode = true;
      try {
        const responseQueryValidate = sqlQueryIsValidate(query);
        console.log('RESPONSE VALIDATE QUERY\n', responseQueryValidate);

        if (responseQueryValidate.isValid) {
          const data = this.story.db.exec(query);

          console.log(data);
          // TODO: parse response ============================================
          const columns = data[0].columns;
          const values = data[0].values;
          const result = prepareDataTable(columns, values);
          this.codemirror.columns = result.tableHeader;
          this.codemirror.data = result.array_vals;
          this.codemirror.isWork = true;
          this.render.story.runCode = false;
        } else {
          this.codemirror.error.active = true;
          this.codemirror.error.message = responseQueryValidate.message;
        }
      } catch (e) {
        console.log(e);
        // this.alert.error.active = true;
        // this.alert.error.message = 'Что-то пошло не так...';
      } finally {
        this.render.story.runCode = false;
      }
    },
    onClickCloseHistory() {
      logR('warn', 'MainLayout: onClickCloseHistory');
      this.story.active = false;
      this.onClickClearCode();
    },
    onClickNextPageStory() {
      logR('warn', 'StoryView: onClickNextPageStory');
      this.storiesBlock.currentPage += 1;
    },

    onClickPrevPageStory() {
      logR('warn', 'StoryView: onClickPrevPageStory');
      this.storiesBlock.currentPage -= 1;
    },
  },
});
</script>
