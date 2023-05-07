import ApiStoryImage from '@/api/api.story.image';
import TokenService from './token.service';
import {decorateResponseApi, logR} from './utils';

class ServiceStoryImage {
  async uploadImage(idStory, image) {
    const data = {storyId: idStory, image: image};
    const response = await decorateResponseApi(ApiStoryImage.upload, data);
    return response;
  }

  async findStoryImageById(storyId) {
    logR('warn', 'SERVICE.STORY.IMAGE: findStoryImageById');
    const options = {
      headers: {Authorization: 'Bearer ' + TokenService.getLocalAccessToken()},
    };
    const response = await ApiStoryImage.findByStoryId(storyId, options);
    return response;
  }

  async updateImage(context) {
    logR('error', 'SERVICE.STORY.IMAGE: todo updateImage');
    console.log(context.message);
  }

  async deleteStoryImg(storyId) {
    const response = await decorateResponseApi(ApiStoryImage.delete, storyId);
    return response;
  }
}

export default new ServiceStoryImage();
