import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

export default instance;
