import axios from 'axios';
import {baseUrl} from '@/_config';
const apiClient = axios.create({
  baseURL: `${baseUrl}/api`,
  headers: {
    'Content-type': 'application/json',
  },
});

export default apiClient;
