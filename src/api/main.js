import axios from 'axios';
import TokenService from '@/services/token.service';
import {extractJWT} from '@/services/utils';

export const API_URL = 'http://localhost:8080/api';

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
const token = TokenService.getToken();
const accessToken = token ? `${token.type} ${token.accessToken}` : null;
const instance = axios.create({
  baseURL: API_URL,
  headers: {Authorization: accessToken},
});

instance.interceptors.request.use(function (config) {
  let accessToken = TokenService.getLocalAccessToken();
  const lifeTimeAccess = extractJWT(accessToken).exp * 1000;
  const difference = lifeTimeAccess - Date.now();
  console.error('DIFFERENCE', difference);

  // console.warn('API INSTANCE ACCESS TOKEN\n', accessToken);
  let auth = accessToken ? 'Bearer ' + accessToken : null;
  config.headers.Authorization = auth;
  return config;
});

export default instance;
