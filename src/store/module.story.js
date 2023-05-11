import StoryService from '@/services/story.service';
import {logR} from '@/services/utils';
export const story = {
  namespaced: true,
  state() {
    return {
      errors: [],
    };
  },

  actions: {
    async createStory(context, formData) {
      logR('warn', 'MODULE.STORY: creating story');
      const response = await StoryService.storyCreate(formData);
      return response;
    },
  },
  getters: {
    GET_ERRORS: (state) => {
      return state.errors;
    },
  },
  mutations: {
    SET_ERRORS: function (state, errors) {
      state.errors = errors;
    },
    CLEAR_ERRORS: function (state) {
      state.errors = [];
    },
  },
};
