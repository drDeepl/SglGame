import ApiUser from '@/api/api.user';
import {decorateResponseApi} from './utils';
import {logR} from './utils';

class UserService {
  async createUser(dataForm) {
    logR('warn', 'service.user: creating user');
    let response = {status: 404, message: 'Такой пользователь уже существует'};
    const responseCreateUser = await decorateResponseApi(
      ApiUser.createUser,
      dataForm
    );
    if (responseCreateUser.status == 200) {
      response = responseCreateUser;
    }
    return response;
  }

  async login(dataForm) {
    return decorateResponseApi(ApiUser.login, dataForm);
  }
}

export default new UserService();
