import axios from 'axios';
import TokenService from '@/services/token.service';
const API_URL = 'http://localhost:8080/api';

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
const token = TokenService.getToken();
const accessToken = token ? `${token.type} ${token.accessToken}` : null;
const instance = axios.create({
  baseURL: API_URL,
  headers: {Authorization: accessToken},
});

export default instance;
