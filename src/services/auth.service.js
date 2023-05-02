import ApiAuth from '@/api/api.auth';
import {decorateResponseApi, logR} from './utils';
import TokenService from './token.service';
class AuthService {
  async login(dataForm) {
    logR('warn', 'AuthService: Login');
    let response = await decorateResponseApi(ApiAuth.login, dataForm);
    if (response.status == 200) {
      console.log('AUTH.SERVICE.login: response', response);
      TokenService.setUser(response.data);
    } else {
      response = {status: 404, data: null, message: 'Ошибка при входе'};
    }
    return response;
  }

  async refreshToken(accessToken) {
    logR('warn', 'AuthService: Refresh Token');
    const response = await decorateResponseApi(
      ApiAuth.refreshToken,
      accessToken
    );
    if (response.data) {
      TokenService.updateLocalAccessToken(response.data.accessToken);
    }
  }
}

export default new AuthService();
