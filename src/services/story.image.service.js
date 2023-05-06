import ApiStoryImage from '@/api/api.story.image';
import ServiceDownloadFIle from './download.service';
import {decorateResponseApi, logR} from './utils';

class ServiceStoryImage {
  async uploadImage(idStory, image) {
    const data = {storyId: idStory, image: image};
    const response = await decorateResponseApi(ApiStoryImage.upload, data);
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
      const data = response.data;
      let bytes = new Uint8Array(data.length / 2);
      for (var i = 0; i < data.length; i += 2) {
        bytes[i / 2] = parseInt(data.substring(i, i + 2), /* base = */ 16);
      }
      // Make a Blob from the bytes
      let blob = new Blob([bytes], {type: 'image/jpg'});
      response.data = blob;
      // Use createObjectURL to make a URL for the blob
    }
    return response;
  }

  async deleteStoryImg(storyId) {
    const response = await decorateResponseApi(ApiStoryImage.delete, storyId);
    return response;
  }
}

export default new ServiceStoryImage();
