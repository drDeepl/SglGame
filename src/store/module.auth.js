import AuthService from '@/services/auth.service';
import TokenService from '@/services/token.service';
import {logR, extractJWT} from '@/services/utils';
const initialTokenUser = TokenService.getToken();
export const auth = {
  namespaced: true,
  state() {
    return {
      tokenUser: initialTokenUser,
      tokenData: null,
    };
  },

  actions: {
    async login(context, dataForm) {
      logR('warn', 'MODULE.AUTH: login');
      const response = await AuthService.login(dataForm);
      if (response.status == 200) {
        const responseData = response.data;
        logR('log', 'MODULE.AUTH: responseData\n', responseData);
        context.commit('SET_TOKEN_USER', responseData);
        console.log(responseData);
        const userData = extractJWT(responseData.accessToken);
        logR('log', 'MODULE.AUTH: token\n', userData);
        context.commit('SET_DATA_LOGIN', userData);
      }

      if (response.status == 404) {
        response.message = 'Такого пользователя не существует';
      }
      return response;
    },
  },
  getters: {
    GET_ACCESS_TOKEN: (state) => {
      return state.tokenUser
        ? state.tokenUser.access
        : TokenService.getLocalAccessToken();
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
      state.tokenData = dataLogin;
      TokenService.setUser(dataLogin);
    },
    SET_TOKEN_USER: function (state, tokenUser) {
      state.tokenUser = tokenUser;
      TokenService.setToken(tokenUser);
    },
    SET_ACCESS_TOKEN: function (state, accessToken) {
      state.tokenUser.accessToken = accessToken;
    },
    UPDATE_TOKEN_USER: function (state, token) {
      state.tokenUser = token;
    },
    UPDATE_ACCESS_TOKEN: function (state) {
      logR('warn', 'MODULE.AUTH: updating access token');
      const accessToken = TokenService.getLocalAccessToken();
      console.log(accessToken);
      state.tokenData.accessToken = accessToken;
    },
    REMOVE_USER: function (state) {
      state.tokenUser = null;
      state.tokenData = null;
      TokenService.removeUser();
    },
    REMOVE_TOKEN: function (state) {
      state.userToken = null;
      TokenService.removeToken();
    },
  },
};
