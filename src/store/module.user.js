import UserService from '@/services/user.service';
import {tabsByRole} from '@/_config';
export const user = {
  namespaced: true,
  state() {
    return {
      userData: null,
      userSidebar: tabsByRole,
    };
  },
  actions: {
    async login(context, loginFormData) {
      const response = await UserService.login(context, loginFormData);
      console.log(response);
      if (response.status == 200) {
        context.commit('SET_USER_DATA', response.data);
      }
    },
  },
  getters: {
    GET_USER_DATA: (state) => {
      return state.userData;
    },
  },
  mutations: {
    SET_USER_DATA: function (state, userData) {
      state.userData = userData;
    },
  },
};
