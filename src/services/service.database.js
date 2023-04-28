// import apiClient from '@/api/main';
import ApiFileStorage from '@/api/api.fileStorage';
import axios from 'axios';
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
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    const instance = axios.create({baseUrl: url, headers: headers});
    const response = await instance
      .get(url)
      .catch((error) => console.log(error));
    return response;
  }
}

export default new ServiceDatabase();
