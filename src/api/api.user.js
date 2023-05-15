import {logR} from '@/services/utils';
import instance from './main';

const path = '/userDB/user';

class ApiUser {
  async createUser(dataRegistration) {
    logR('warn', 'ApiUser: createUser');
    const response = await instance.post(
      `${path}/registration`,
      dataRegistration
    );
    console.log(response);
    return response;
  }

  async users() {
    logR('warn', 'API.USERS: userss');
    return instance.get(`${path}/index`);
  }
}

export default new ApiUser();
