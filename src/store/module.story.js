import StoryService from '@/services/story.service';
import {logR} from '@/services/utils';

export const story = {
  namespaced: true,
  state() {
    return {};
  },

  actions: {
    async getStories(context) {
      logR('warn', 'MODULE.STORY: creating story');
      console.log(context);
      const response = await StoryService.getStories();
      return response;
    },
    async getStoryById(context, storyID) {
      logR('warn', 'MODULE.STORY: creating story');
      const response = await StoryService.getStoryById(storyID);
      return response;
    },
    async createStory(context, formData) {
      logR('warn', 'MODULE.STORY: creating story');
      const response = await StoryService.storyCreate(formData);
      return response;
    },
    async storyUpdate(context, formData) {
      logR('warn', 'MODULE.STORY: creating story');
      const response = await StoryService.storyUpdate(formData);
      return response;
    },
    async storyDelete(context, storyId) {
      logR('warn', 'MODULE.STORY: creating story');
      const response = await StoryService.storyDelete(storyId);
      return response;
    },
  },
  getters: {},
  mutations: {},
};
