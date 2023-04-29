import ApiAuth from '@/api/api.auth';
import {decorateResponseApi, logR} from './utils';
import TokenService from './token.service';
class AuthService {
  async login(dataForm) {
    logR('AuthService: Login');
    const response = await decorateResponseApi(ApiAuth.login, dataForm);
    if (response.data) {
      TokenService.updateLocalAccessToken(response.data.accessToken);
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
