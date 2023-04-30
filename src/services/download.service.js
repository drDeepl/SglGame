import {logR} from './utils';

class ServiceDownloadFile {
  async downloadFileInUint8Array(url) {
    // NOTE: функция скачивает файл и возвращает массив Uint8Array

    logR('warn', 'ServiceDownload: downloadFile');
    logR('log', 'URL\n' + url);
    const response = await fetch(url).catch((error) => console.log(error));
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
        break;
      }
      chunks.push(value);
      receivedLength += value.length;
      const percentage = (receivedLength * 100) / contentLength;
      console.log(
        `Получено ${receivedLength} из ${contentLength} = ${percentage}%`
      );
    }
    const fileUint8Array = new Uint8Array(receivedLength);
    let position = 0;
    for (let chunk of chunks) {
      fileUint8Array.set(chunk, position);
      position += chunk.length;
    }
    // FIXME: prepare chunksAll in file
    return fileUint8Array;
  }
}

export default new ServiceDownloadFile();
