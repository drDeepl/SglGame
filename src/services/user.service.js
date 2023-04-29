import ApiUser from '@/api/api.user';
import {decorateResponseApi} from './utils';
import {logR} from './utils';

class UserService {
  async createUser(dataForm) {
    logR('warn', 'service.user: creating user');
    const response = await decorateResponseApi(ApiUser.createUser, dataForm);

    console.log(response);
    return response;
  }

  async login(dataForm) {
    return decorateResponseApi(ApiUser.login, dataForm);
  }
}

export default new UserService();
