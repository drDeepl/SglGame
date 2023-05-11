export const notification = {
  namespaced: true,
  state() {
    return {
      error: {active: false, message: ''},
      info: {active: false, message: ''},
      success: {active: false, message: ''},
    };
  },

  actions: {},
  getters: {
    GET_STATE_ERROR: (state) => {
      return state.error;
    },
    GET_STATE_SUCCESS: (state) => {
      return state.success;
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
    SET_ACTIVE_SUCCESS: (state, message) => {
      state.success.message = message;
      state.success.active = true;
    },
    REMOVE_STATE_SUCCESS: (state) => {
      state.success.active = false;
      state.success.message = '';
    },
  },
};
