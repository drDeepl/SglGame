import ApiUser from '@/api/api.user';
import {decorateResponseApi} from './utils';
import {logR} from './utils';

class UserService {
  async createUser(dataForm) {
    logR('warn', 'service.user: creating user');
    let response = {
      status: 400,
      data: null,
      message: 'Произошла ошибка во время регистрации',
    };
    try {
      response = await decorateResponseApi(ApiUser.createUser, dataForm);
    } catch (e) {
      console.log(e);
    } finally {
      console.log(response);
    }
    return response;
  }

  async login(dataForm) {
    return decorateResponseApi(ApiUser.login, dataForm);
  }
}

export default new UserService();
