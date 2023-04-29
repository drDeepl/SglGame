<template>
  <div class="choice-history mb-5">
    <div
      class="card-history-main-layer"
      v-for="history in arrays.history"
      :key="history"
      @click="onClickHistory(history)"
    >
      <div class="card-title-history">
        history {{ history.title.replace('_', ' ') }}
      </div>
      <img
        class="card-history-img"
        :src="require('@/img/history_' + history.title + '.jpg')"
      />
    </div>
  </div>
  <div class="history-content__wrapper">
    <!-- // TODO: Добавить в отдельный компонент -->
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

      <template #footer> </template>
    </n-card>
  </n-modal>
</template>

<script>
import DatabaseManager from '@/database/DatabaseManager';
import ServiceDatabase from '@/services/service.database';

import {logR} from '@/services/utils';
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
      const urlToDb = await ServiceDatabase.getLinkToDatabase(history.title);
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
      this.history.title = history.title;
      this.history.description = history.description;
      this.history.loadData = false;
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
      const data = this.history.db.exec(code);
      console.log(data);
      // this.codemirror.columns = data.columns;
      // TODO: parse response ============================================
      const columns = data[0].columns;
      const values = data[0].values;
      console.log(columns);
      let tableHeader = [];
      for (let i = 0; i < columns.length; i++) {
        const column = {title: columns[i], key: columns[i]};

        tableHeader.push(column);
        // TODO: prepare data for column;
      }
      this.codemirror.columns = tableHeader;
      // TODO: parse response =============================================
      let array_vals = [];
      values.forEach((row) => {
        const value = {};
        for (let column = 0; column < columns.length; column++) {
          value[columns[column]] = row[column];
        }
        array_vals.push(value);
      });
      this.codemirror.data = array_vals;
      this.codemirror.isWork = true;
      this.render.history.runCode = false;
    },
    onClickCloseHistory() {
      logR('warn', 'MainLayout: onClickCloseHistory');
      this.history.active = false;
      this.onClickClearCode();
    },
  },
});
</script>