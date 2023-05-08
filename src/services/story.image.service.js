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
    const result = {status: 200, data: null, type: null, message: ''};
    const response = await ApiStoryImage.findByStoryId(storyId, options).catch(
      (error) => {
        console.log(error);
        if (error.status) {
          result.status = error.status;
        }
        if (error.code) {
          result.status = error.response.status;
        }
      }
    );
    if (result.status === 200) {
      result.type = response.headers['content-type'];
      result.data = Buffer.from(response.data, 'binary').toString('base64');
    }
    console.error('findStoryImageById', result);
    return result;
  }

  async updateImage(context) {
    logR('error', 'SERVICE.STORY.IMAGE: todo updateImage');
    console.log(context.message);
  }

  async deleteStoryImg(storyId) {
    const response = await decorateResponseApi(ApiStoryImage.delete, storyId);
    return response;
  }

  async getIdsImagesStories() {
    const response = await decorateResponseApi(
      ApiStoryImage.getIdsImagesStories
    );

    if (response.status === 200) {
      return response.data;
    } else {
      return [];
    }
  }
}

export default new ServiceStoryImage();
