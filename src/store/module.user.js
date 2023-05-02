import UserService from '@/services/user.service';

export const user = {
  namespaced: true,
  state() {
    return {
      userData: null,
      userSidebar: {
        admin: [
          {
            id: 0,
            title: 'Панель администратора',
            lock: false,
            url: '/admin',
          },
          {
            id: 1,
            title: 'Редактирование таблиц',
            lock: false,
            url: '/database',
          },
          {id: 0, title: 'К историям', lock: false, url: '/stories'},
        ],
        user: [{id: 0, title: 'К историям', lock: false, url: '/stories'}],
      },
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
