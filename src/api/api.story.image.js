import instance from './main';

const API_PATH = '/userDB/stories_images';

class ApiStoryImage {
  async upload(dataForm) {
    const storyId = dataForm.storyId;
    const image = dataForm.image;
    const payload = {file: image};
    return instance.post(API_PATH + '/create', payload, {
      params: {story_id: storyId},
    });
  }

  async update(dataForm) {
    return instance.post(API_PATH + '/update', dataForm);
  }

  async findByStoryId(storyId) {
    return instance.get(API_PATH + '/findByStoryId/' + storyId, {
      responseType: 'arraybuffer',
    });
  }

  async getIdsImagesStories() {
    return instance.get(API_PATH + '/listID');
  }
  async delete(imageId) {
    return instance.delete(API_PATH + '/delete/' + imageId);
  }
}

export default new ApiStoryImage();
