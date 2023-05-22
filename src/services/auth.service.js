import ApiAuth from '@/api/api.auth';
import {decorateResponseApi, logR} from './utils';
import TokenService from './token.service';
class AuthService {
  async login(dataForm) {
    logR('warn', 'AuthService: Login');
    const response = await ApiAuth.login(dataForm).catch((error) => {
      const resp = {status: null};
      console.log(error);
      if (error.status) {
        resp.status = error.status;
      } else {
        resp.status = error.response.status;
      }
      return resp;
    });
    return response;
  }

  async updateAccessToken() {
    logR('warn', 'Auth.Service.updateAccessToken');
    const token = TokenService.getToken();
    console.log('UpdateAccessToken\n' + token.refreshToken);
    ApiAuth.getAccessToken(token.refreshToken).then(function (response) {
      const accessToken = response.data.accessToken;
      TokenService.updateLocalAccessToken(accessToken);
      return accessToken;
    });
  }

  async refreshToken(accessToken) {
    logR('warn', 'AuthService: Refresh Token');
    const response = await decorateResponseApi(
      ApiAuth.getRefreshToken,
      accessToken
    );
    if (response.data) {
      TokenService.setToken(response.data);
    }
  }
}

export default new AuthService();
