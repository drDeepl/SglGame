import ApiStory from '@/api/api.story';
import {decorateResponseApi, logR} from './utils';
class StoryService {
  async getStories() {
    logR('warn', 'STORY.SERVICE.getStories');
    let response = await decorateResponseApi(ApiStory.getStories);
    if (response.status != 200) {
      return [];
    }
    console.log(response);
    return response.data;
  }

  async getStoryById(storyId) {
    logR('warn', 'STORY.SERVICE.createStory');
    let response = await decorateResponseApi(
      ApiStory.getStoryById,
      storyId
    ).catch((resp) => {
      console.log(resp);
    });
    response.status == 200
      ? (response.message = 'Успешно')
      : (response.message = 'Произошла ошибка при получении истории');
    console.log(response);
    return response;
  }

  async storyCreate(formData) {
    logR('warn', 'STORY.SERVICE.createStory');
    let response = await decorateResponseApi(
      ApiStory.createStory,
      formData
    ).catch((resp) => {
      console.log(resp);
    });
    response.status == 200
      ? (response.message = 'Успешно')
      : (response.message = 'Произошла ошибка при создании истории');
    console.log(response);
    return response;
  }

  async updateStory(formData) {
    logR('warn', 'STORY.SERVICE.Update');
    let response = await decorateResponseApi(ApiStory.update, formData);
    response.status == 200
      ? (response.message = 'Успешно')
      : (response.message = 'Произошла ошибка во время обновления истории');
    console.log(response);
    return response;
  }

  async checkStoryAnswer(payload) {
    logR('warn', 'STORY.SERVICE: checkStoryAnswer');
    const response = await decorateResponseApi(ApiStory.checkAnswer, payload);
    return response;
  }

  async storyDelete(storyId) {
    logR('warn', 'STORY.SERVICE.Delete');
    let response = await decorateResponseApi(ApiStory.delete, storyId).catch(
      (resp) => {
        console.log(resp);
      }
    );
    response.status == 200
      ? (response.message = 'Успешно')
      : (response.message = 'Произошла ошибка во время удаления истории');
    console.log(response);
    return response;
  }
}

export default new StoryService();
