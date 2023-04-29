import {createStore} from 'vuex';
export const message = createStore({
  namespace: true,
  state() {
    return {
      succes: 'Готово!',
      error: 'Что-то пошло не так...',
    };
  },
  getters: {},
  mutations: {},
});
