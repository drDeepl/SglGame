import {logR} from '@/services/utils';
import instance from './main';
const path = '/userDB/stories';
// FIX: /api/userDB/stories/delete/{id}

class ApiStory {
  async getStories() {
    logR('warn', 'API.STORY:getStories');
    return instance.get(path + '/index');
  }

  async getStoryById(id) {
    logR('warn', 'API.STORY:getStoryById');
    return instance.get(path + '/getById/' + id);
  }

  async createStory(dataForm) {
    logR('warn', 'API.STORY: creating story');
    return instance.post(path + '/create', dataForm);
  }
  async update(dataForm) {
    logR('warn', 'API.STORY: updating story');
    return instance.post(path + '/update', dataForm);
  }
  async delete(storyId) {
    logR('warn', 'API.STORY: deleting story');
    return instance.delete(path + '/delete/' + storyId);
  }
}

export default new ApiStory();
