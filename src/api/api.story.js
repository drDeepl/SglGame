import {logR} from '@/services/utils';
import instance from './main';
const path = '/userDB/stories';

class ApiStory {
  async createStory(dataForm) {
    logR('warn', 'API.STORY: creating story');
    return instance.post(path + '/create', dataForm);
  }
}

export default new ApiStory();
