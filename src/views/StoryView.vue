<template>
  <div class="choice-history mb-5">
    <div
      class="card-history-main-layer"
      v-for="history in arrays.history"
      :key="history"
      @click="onClickHistory(history)"
    >
      <n-popover trigger="hover">
        <template #trigger>
          <div>
            <div class="card-title-history">
              <span> history {{ history.title.replace('_', ' ') }} </span>
            </div>
            <img
              class="card-history-img"
              :src="require('@/assets/img/history_' + history.title + '.jpg')"
            />
          </div>
        </template>
        <n-rate readonly :default-value="history.difficulty"></n-rate
      ></n-popover>
    </div>
    <div class="history-content__wrapper">
      <!-- // TODO: Добавить в отдельный компонент -->
    </div>
  </div>

  <n-modal
    v-if="history.active"
    v-model:show="history.active"
    :mask-closable="false"
  >
    <n-card
      class="card-main-layer-history border-top-yellow"
      :title="history.title"
      role="dialog"
      size="huge"
    >
      <template #header-extra>
        <n-button
          :disabled="render.history.runCode"
          quaternary
          circle
          type="error"
          @click="onClickCloseHistory"
        >
          <icon-close style="width: 1.7em" />
        </n-button>
      </template>
      <n-space v-if="history.loadData" justify="center">
        <n-progress
          v-if="history.loadProgress != 100"
          style="margin: 0 8px 12px 0"
          type="circle"
          :percentage="history.loadProgress"
          :color="themeVars.successColor"
          :rail-color="changeColor(themeVars.successColor, {alpha: 0.2})"
          :indicator-text-color="themeVars.successColor"
        >
        </n-progress>
        <n-spin v-if="history.loadProgress == 100 && history.loadData"></n-spin>
      </n-space>
      <div v-else class="history-card-content">
        <p>
          {{ history.description }}
        </p>

        <n-code-block
          :onClickRunCodeFunc="onClickRunCode"
          :onClickClearCodeFunc="onClickClearCode"
          :loadApply="render.history.runCode"
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
      <!-- </n-space> -->
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
import DatabaseManager from '@/database/DatabaseManager';
import ServiceDatabase from '@/services/service.database';

import {logR, prepareDataTable} from '@/services/utils';
import {defineComponent} from 'vue';

// import CodeBlock from '@/UI/CodeBlock.vue';
import {changeColor} from 'seemly';
import {useThemeVars} from 'naive-ui';

export default defineComponent({
  coponents: {},
  data() {
    return {
      changeColor: changeColor,
      themeVars: useThemeVars(),
      alert: {
        success: {active: false, message: ''},
        info: {active: false, message: ''},
        error: {active: false, message: ''},
      },
      history: {
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
      },
      render: {
        main: false,
        history: {runCode: false},
      },
      tab: 0,
      arrays: {
        history: [
          {
            title: 'murder_mystery',
            description:
              'Произошло преступление, и детективу нужна ваша помощь. Детектив дал вам отчет о месте преступления, но вы каким-то образом потеряли его. Вы смутно помните, что преступление было убийством, которое произошло где-то 15 января 2018 года, и что оно произошло в SQL City. Начните с поиска соответствующего отчета о месте преступления в базе данных полицейского управления.',
            difficulty: 3,
            story_text: '',
            answer: '',
          },
          {title: '2', description: 'Description history 2'},
          {title: '3', description: 'Description history 3'},
        ],
      },
      game: {
        step: '',
      },
    };
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
        this.history.loadProgress = Math.round(percentage);
        console.log(
          `Получено ${receivedLength} из ${contentLength} = ${percentage}%`
        );
      }
    },
    async onClickHistory(history) {
      // FIX: =========================================
      logR('warn', 'NAVBAR: onClickHistory');
      this.history.loadData = true;
      this.history.active = true;
      console.log(history);
      try {
        const urlToDb = await ServiceDatabase.getLinkToDatabase(history.title);
        if (urlToDb.length <= 0) {
          this.$store.commit(
            'notification/SET_ACTIVE_ERROR',
            'Ошибка при загрузке базы данных'
          );
          this.history.active = false;
          this.history.loadData = false;
          return;
        }
        const response2DownloadDb = await ServiceDatabase.downloadFile(
          urlToDb
        ).catch((error) => {
          console.log(error + '\n');
          console.log(Object.keys(error));
        });
        // const body = response2DownloadDb.body.getReader();
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
        this.history.db = await DatabaseManager.createDatabase(chunksAll);
      } catch (e) {
        this.createErrorAlert('Что-то пошло не так');
        this.history.active = false;
      } finally {
        this.history.title = history.title;
        this.history.description = history.description;
        this.history.loadData = false;
      }

      // FIX: =========================================
    },
    onClickClearCode() {
      this.codemirror.data = [];
      this.codemirror.columns = [];
      this.codemirror.isWork = false;
    },
    async onClickRunCode(code) {
      logR('warn', 'NAVBAR: onClickRunCode');
      this.render.history.runCode = true;
      try {
        const data = this.history.db.exec(code);
        console.log(data);
        // TODO: parse response ============================================
        const columns = data[0].columns;
        const values = data[0].values;
        const result = prepareDataTable(columns, values);
        this.codemirror.columns = result.tableHeader;
        this.codemirror.data = result.array_vals;
        this.codemirror.isWork = true;
        this.render.history.runCode = false;
      } catch (e) {
        this.alert.error.active = true;
        this.alert.error.message = 'Что-то пошло не так...';
      } finally {
        this.render.history.runCode = false;
      }
    },
    onClickCloseHistory() {
      logR('warn', 'MainLayout: onClickCloseHistory');
      this.history.active = false;
      this.onClickClearCode();
    },
  },
});
</script>
