import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Access-Control-Allow-Origin': 'true',
    crossorigin: 'true',
    'Content-Type': 'application/json',
  },
});

export default instance;
