import ApiStory from '@/api/api.story';
import {decorateResponseApi, logR} from './utils';
class StoryService {
  async storyCreate(formData) {
    logR('warn', 'STORY.SERVICE.createStory');
    return await decorateResponseApi(ApiStory.createStory, formData);
  }
}

export default new StoryService();
