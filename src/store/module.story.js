import StoryService from '@/services/story.service';
import {logR} from '@/services/utils';
export const story = {
  namespaced: true,
  state() {
    return {};
  },

  actions: {
    async createStory(context, formData) {
      logR('warn', 'MODULE.STORY: creating story');
      const response = await StoryService.storyCreate(formData);
      return response;
    },
  },
  getters: {},
  mutations: {},
};
