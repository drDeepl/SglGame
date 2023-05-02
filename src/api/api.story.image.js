import instance from './main';

const API_PATH = '/userDB/stories_images/';

class ApiStoryImage {
  async upload(dataForm) {
    const storyId = dataForm.storyId;
    const image = dataForm.image;
    return instance.post(API_PATH + '/upload?id_stories=' + storyId, {
      file: image,
    });
  }

  async update(dataForm) {
    return instance.post(API_PATH + '/update', dataForm);
  }

  async findByStoryId(storyId) {
    return instance.get(API_PATH + '/findByStoryId/' + storyId);
  }

  async download(storyId) {
    return instance.get(API_PATH + '/download/' + storyId);
  }

  async delete(imageId) {
    return instance.delete(API_PATH + '/delete/' + imageId);
  }
}

export default new ApiStoryImage();
