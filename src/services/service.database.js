// import apiClient from '@/api/main';
import ApiFileStorage from '@/api/api.fileStorage';
import {decorateResponseApi, logR} from './utils';

class ServiceDatabase {
  async getLinkToDatabase(databaseName) {
    logR('warn', 'ServiceDatabase');
    const response = await decorateResponseApi(
      ApiFileStorage.getLink2downloadDatabase,
      databaseName
    );
    console.log(response);
    return response.status == 200 ? response.data.href : '';
  }

  async downloadFile(url) {
    logR('warn', 'ServiceDatabse: downloadFile');
    logR('log', 'URL\n' + url);
    logR(
      'error',
      'TODO: Сообщение пользователю: получено n из 100% и сделать спинер'
    );
    const response = await fetch(url);
    const reader = response.body.getReader();
    // INFO: Получаю длину ответа
    const contentLength = +response.headers.get('Content-Length');
    let receivedLength = 0; // INFO: количество байт, полученных на данный момент
    let chunks = [];
    let work = true;
    while (work) {
      const {done, value} = await reader.read();
      if (done) {
        work = false;
        return chunks;
      }
      chunks.push(value);
      receivedLength += value.length;
      console.log(`Получено ${receivedLength} из ${contentLength}`);
    }
  }
}

export default new ServiceDatabase();
