import AuthService from '@/services/auth.service';
import {extractJWT} from '@/services/utils';
export const auth = {
  namespaced: true,
  state() {
    return {
      tokenUser: null,
      dataLogin: null,
    };
  },

  actions: {
    async login(context, dataForm) {
      const response = await AuthService.login(dataForm);
      const responseData = response.data;
      context.commit('SET_DATA_LOGIN', responseData);
      console.log(responseData);
      const token = extractJWT(responseData.accessToken);
      context.commit('SET_TOKEN_USER', token);
      return token;
    },
  },
  getters: {
    GET_TOKEN_USER: (state) => {
      return state.currentUser;
    },
    GET_DATA_LOGIN: (state) => {
      return state.dataLogin;
    },
  },
  mutations: {
    SET_DATA_LOGIN: function (state, dataLogin) {
      state.dataLogin = dataLogin;
    },
    SET_TOKEN_USER: function (state, tokenUser) {
      state.tokenUser = tokenUser;
    },
  },
};
