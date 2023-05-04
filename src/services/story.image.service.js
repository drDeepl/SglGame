import ApiStoryImage from '@/api/api.story.image';
import ServiceDownloadFIle from './download.service';
import {decorateResponseApi, logR} from './utils';

class ServiceStoryImage {
  async uploadImg(idStory, image) {
    const data = {storyId: idStory, image: image};
    const response = await decorateResponseApi(ApiStoryImage, data);
    return response;
  }

  async downloadFileImg(storyId) {
    const response = await decorateResponseApi(ApiStoryImage.download, storyId);
    if (response.status === 200) {
      const FileImgUing8Array = ServiceDownloadFIle(response.data.href);
      return {status: 200, data: FileImgUing8Array, message: 'Успешно'};
    }
    return response;
  }

  async updateImage(context) {
    logR('error', 'SERVICE.STORY.IMAGE: todo updateImage');
    console.log(context.message);
  }
  async findStoryImageById(storyId) {
    const response = await decorateResponseApi(
      ApiStoryImage.findByStoryId,
      storyId
    );
    if (response.status === 200) {
      logR('error', 'SERVICE.STORY.IMAGE: todo findStoryImageById');
      return new Blob(response.data);
    }
  }

  async uploadImage(file) {
    logR('warn', 'STORY.IMAGE.SERIVCE: uploadImage');
    const response = await decorateResponseApi(ApiStoryImage.upload, file);
    return response;
  }

  async deleteStoryImg(storyId) {
    const response = await decorateResponseApi(ApiStoryImage.delete, storyId);
    return response;
  }
}

export default new ServiceStoryImage();
