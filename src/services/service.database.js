// import apiClient from '@/api/main';
import ApiFileStorage from '@/api/api.fileStorage';
import {decorateResponseApi, logR} from './utils';
import TokenService from './token.service';

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
    const token = TokenService.getToken();
    console.log(token);
    const config = {headers: {Authorization: 'Bearer ' + token.accessToken}};
    const response = await fetch(url, config).catch((error) =>
      console.error(error)
    );
    return response;
  }
}

export default new ServiceDatabase();
