import {logR} from '@/services/utils';
import instance from './main';

const path = '/auth';

class ApiAuth {
  async login(dataLogin) {
    logR('warn', 'ApiAuth: login');
    return instance.post(`${path}/login`, dataLogin);
  }

  getAccessToken(refreshToken) {
    return instance.post(`${path}/getNewAccessToken`, {
      refreshToken: refreshToken,
    });
  }

  getRefreshToken(accessToken) {
    return instance.post(`${path}/getNewRefreshToken`, {
      accessToken: accessToken,
    });
  }

  async refreshToken(token) {
    logR('warn', 'ApiAuth: refreshToken');
    return instance.post(`${path}/token`, token);
  }
}

export default new ApiAuth();
