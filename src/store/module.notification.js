export const notification = {
  namespaced: true,
  state() {
    return {
      error: {active: false, message: ''},
      info: {active: false, message: ''},
    };
  },

  actions: {},
  getters: {
    GET_STATE_ERROR: (state) => {
      return state.error;
    },
  },
  mutations: {
    SET_ACTIVE_ERROR: (state, message) => {
      state.error.message = message;
      state.error.active = true;
    },
    REMOVE_STATE_ERROR: (state) => {
      state.error.active = false;
      state.error.message = '';
    },
  },
};
