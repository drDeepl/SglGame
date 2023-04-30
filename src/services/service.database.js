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
    const response = await fetch(url).catch((error) => console.log(error));
    return response;
  }
}

export default new ServiceDatabase();
