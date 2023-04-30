import AuthService from '@/services/auth.service';
import TokenService from '@/services/token.service';
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
      if (response.status == 200) {
        const responseData = response.data;
        context.commit('SET_DATA_LOGIN', responseData);
        console.log(responseData);
        const token = extractJWT(responseData.accessToken);
        context.commit('SET_TOKEN_USER', token);
        response.data = token;
      }

      return response;
    },
  },
  getters: {
    GET_TOKEN_USER: (state) => {
      return state.currentUser;
    },
    GET_DATA_LOGIN: (state) => {
      return state.dataLogin ? state.dataLogin : TokenService.getUser();
    },

    GET_LOCAL_ACCESS_TOKEN: (state) => {
      return state.tokenUser
        ? state.tokenUser
        : TokenService.getLocalAccessToken();
    },
  },
  mutations: {
    SET_DATA_LOGIN: function (state, dataLogin) {
      state.dataLogin = dataLogin;
      TokenService.setUser(dataLogin);
    },
    SET_TOKEN_USER: function (state, tokenUser) {
      state.tokenUser = tokenUser;
    },
    REMOVE_USER: function (state) {
      TokenService.removeUser();
      state.tokenUser = null;
      state.dataLogin = null;
    },
  },
};
