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

  async getUsers() {
    logR('warn', 'USER.SERVICE: getUsers');
    const response = await decorateResponseApi(ApiUser.users);
    return response.status === 200 ? response.data : [];
  }

  async updateUser(user) {
    logR('warn', 'USER.SERVICE:updateUser');
    // const data4Update = {username: user.username, password: user.password};
    console.log('DATA USER');

    const response = await decorateResponseApi(ApiUser.update, user);
    return response;
  }

  async deleteUser(userId) {
    logR('warn', 'USER.SERVICE:deleteUser');
    const response = await decorateResponseApi(ApiUser.delete, userId);
    return response;
  }
}

export default new UserService();
