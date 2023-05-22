<template>
  <div>
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
            @click="onClickStory(story)"
            class="cursor-layout preview-story-card-container"
            v-if="!render.storiesBlock"
            :title="story.title"
            :storyId="story.id"
            :description="story.description"
            :difficulty="story.difficulty"
          >
            <div class="story-info-container">
              <!-- <span class="font-bold">{{ story.title }}</span> -->
              <n-rate :value="Number(story.difficulty)" readonly></n-rate>
            </div>
          </card-story>
        </div>
      </div>
      <n-space justify="end" align="center" class="pagination-container">
        <n-button
          class="icon-layout-pagination soft-shadow cursor-layout"
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
  </div>

  <n-modal
    v-if="story.active"
    v-model:show="story.active"
    :mask-closable="false"
  >
    <n-card
      id="scrollingCard"
      class="card-main-layer-history border-top-yellow"
      :title="story.data.title"
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
        <n-space justify="center" align="center" vertical>
          <collapsed-card
            v-for="prop in ['description', 'story_text']"
            :key="prop"
            :title="story.model.labels[prop]"
          >
            {{ story.data[prop] }}
          </collapsed-card>
          <collapsed-card title="Схема базы данных">
            <n-image
              object-fit="cover"
              class="story-image-container"
              :src="require('@/assets/img/schema_db.jpg')"
            ></n-image>
          </collapsed-card>
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
          <div style="margin-top: 1em">
            <n-data-table
              id="data-table"
              ref="table"
              v-if="codemirror.isWork"
              :columns="codemirror.columns"
              :data="codemirror.data"
              :pagination="codemirror.pagination"
            ></n-data-table>
          </div>
          <n-code-block
            :onClickRunCodeFunc="onClickRunCode"
            :onClickClearCodeFunc="onClickClearCode"
            :loadApply="render.story.runCode"
          >
          </n-code-block>

          <n-space justify="space-between">
            <n-form-item
              :validation-status="story.validateAnswer.status"
              :feedback="story.validateAnswer.message"
            >
              <!-- :status="story.validateAnswer.status" -->
              <n-input
                v-model:value="story.answer"
                placeholder="Ответ:"
              ></n-input>
              <n-button @click="onClickSendAnswer">Отправить</n-button>
            </n-form-item>
          </n-space>
        </n-space>
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

import CreateStory from '@/models/model.create.story';
import {API_URL} from '@/api/main';

import {logR, prepareDataTable, toChunks} from '@/services/utils';
import {defineComponent} from 'vue';

import CardStory from '@/components/CardStory.vue';
import CollapsedCard from '@/UI/CollapsedCard.vue';
import {changeColor} from 'seemly';
import {useThemeVars} from 'naive-ui';

export default defineComponent({
  components: {'card-story': CardStory, 'collapsed-card': CollapsedCard},
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
        data: {},
        loadData: false,
        loadProgress: 0,
        db: null,
        model: new CreateStory(),
        answer: '',
        validateAnswer: {status: '', message: ''},
      },
      codemirror: {
        columns: [],
        data: [],
        pagination: {pageSize: 5},
        isWork: false,
        error: {active: false, message: []},
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

    const stories = await StoryService.getStoriesForUser();
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
    getErrors() {
      return this.$store.state.story.errors;
    },
  },

  watch: {
    getErrors(value) {
      if (value.length > 0) {
        this.onClickClearCode();
      }
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
        // console.log(
        //   `Получено ${receivedLength} из ${contentLength} = ${percentage}%`
        // );
      }
    },
    async onClickStory(story) {
      logR('warn', 'NAVBAR: onClickStory');
      this.story.data = story;
      this.story.loadData = true;
      this.story.active = true;
      console.log(story);
      try {
        const urlToDb = `${API_URL}/fileDB/get`;
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
        this.story.loadData = false;
      }
    },
    onClickClearCode() {
      this.codemirror.data = [];
      this.codemirror.columns = [];
      this.codemirror.isWork = false;
    },
    async onClickRunCode(query) {
      logR('warn', 'NAVBAR: onClickRunCode');
      this.render.story.runCode = true;
      let errors = this.getErrors;
      try {
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
        const scrollTable = document.getElementById('scrollingCard');
        scrollTable.scrollTop = scrollTable.scrollHeight;
      } catch (e) {
        if (/(no such table)/.test(e)) {
          errors.push('Такой таблицы не существует');
        }
      } finally {
        this.render.story.runCode = false;
      }
    },

    async onClickSendAnswer() {
      logR('warn', 'StoryView: onClickSendAnswer');
      const answer = this.story.answer;
      const payload = {storyId: this.story.data.id, answer: answer};
      const response = await StoryService.checkStoryAnswer(payload);
      console.log('RESPONSE FROM CHECK STORY ANSWER\n');
      console.log(response);
      if (response.status == 200) {
        this.$store.commit(
          'notification/SET_ACTIVE_SUCCESS',
          `${response.data}`
        );
        // this.story.validateAnswer.status = 'success';
        // this.story.validateAnswer.message = 'Ответ верный!';
        this.story.answer = '';
        return;
      }

      this.story.validateAnswer.status = 'error';
      this.story.validateAnswer.message = 'Неправильный ответ';
    },
    onClickCloseHistory() {
      logR('warn', 'MainLayout: onClickCloseHistory');
      this.story.active = false;
      this.story.validateAnswer.status = '';
      this.story.validateAnswer.message = '';
      this.story.answer = '';
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
    onClickInputAnswer() {
      logR('warn', 'StoryView: onClickInputAnswer');
      this.story.answerIsValid = '';
    },
  },
});
</script>
