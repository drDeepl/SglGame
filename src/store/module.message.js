import {createStore} from 'vuex';
const message = createStore({
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

export default message;
