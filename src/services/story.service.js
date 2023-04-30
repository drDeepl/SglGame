import ApiStory from '@/api/api.story';
import {decorateResponseApi, logR} from './utils';
class StoryService {
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
}

export default new StoryService();
