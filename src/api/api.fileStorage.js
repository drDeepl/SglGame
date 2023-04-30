import axios from 'axios';

const storageBaseUrl = 'https://cloud-api.yandex.net/v1/disk/resources';
const path2Database = 'disk:/sqlgame/database';

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
const apiFileStore = axios.create({
  baseURL: `${storageBaseUrl}`,
  headers: {
    Authorization: process.env.VUE_APP_TOKEN_STORAGE,
  },
});

class ApiFileStorage {
  async getLink2downloadDatabase(filename) {
    return apiFileStore.get(
      `${storageBaseUrl}/download?path=${path2Database}/${filename}.db`
    );
  }

  async;
}

export default new ApiFileStorage();
