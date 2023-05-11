import axios from 'axios';
import TokenService from '@/services/token.service';
import {extractJWT} from '@/services/utils';

export const API_URL = 'http://194.67.121.7:8080/api';

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
const token = TokenService.getToken();
const accessToken = token ? `${token.type} ${token.accessToken}` : null;
const instance = axios.create({
  baseURL: API_URL,
  headers: {Authorization: accessToken},
});

instance.interceptors.request.use(async function (config) {
  const token = TokenService.getToken();

  if (token) {
    let accessToken = token.accessToken;
    const lifeTimeAccess = extractJWT(accessToken).exp * 1000;
    const difference = lifeTimeAccess - Date.now() - 10000;
    console.log('DIFFERENCE', difference);
    let auth = accessToken ? 'Bearer ' + accessToken : null;
    if (difference < 0) {
      const newTokenResponse = await axios.post(
        `${API_URL}/auth/getNewAccessToken`,
        {
          refreshToken: token.refreshToken,
        }
      );
      const accessTokenJSON = newTokenResponse.data;
      auth = accessTokenJSON.type + ' ' + accessTokenJSON.accessToken;
      TokenService.updateLocalAccessToken(accessTokenJSON.accessToken);
    }
    config.headers.Authorization = auth;
  }

  return config;
});

export default instance;
