import AuthService from '@/services/auth.service';
import TokenService from '@/services/token.service';
import {extractJWT} from '@/services/utils';
const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? {status: {loggedIn: true}, user}
  : {status: {loggedIn: false}, user: null};

export const auth = {
  namespaced: true,
  state() {
    return {
      initState: initialState,
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
        context.commit('LOGIN_SECCESS');
      } else {
        context.commit('LOGIN_FAILED');
      }

      return response;
    },
  },
  getters: {
    GET_INIT_STATE: (state) => {
      return state.initState;
    },
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
      state.user;
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
    LOGIN_SUCCESS: function (state, user) {
      state.initState.status.loggedIn = true;
      state.initState.user = user;
    },

    LOGIN_FAILED: function (state) {
      state.initState.status.loggedIn = false;
      state.initState.user = null;
    },
    refresh(state, access) {
      state.initState.status.loggedIn = true;
      state.initState.user.accessToken = access;
    },
  },
};
