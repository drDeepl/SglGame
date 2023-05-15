import {logR} from '@/services/utils';
import instance from './main';
const path = '/userDB/stories';
// FIX: /api/userDB/stories/delete/{id}

class ApiStory {
  async getStories() {
    logR('warn', 'API.STORY:getStories');
    return instance.get(path + '/index');
  }

  async getStoriesForUser() {
    logR('warn', 'getStoriesForUser');
    return instance.get(path + '/listStory');
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
  async checkAnswer(dataForm) {
    const storyId = dataForm.storyId;
    const answer = dataForm.answer;
    logR('warn', 'API.STORY: checking answer');
    console.log('PAYLOAD');
    console.log(dataForm);
    return instance.post(
      `${path}/checkAnswer/${storyId}`,
      {answer: answer}
      // {params: {storyId: storyId}}
    );
  }
}

export default new ApiStory();
