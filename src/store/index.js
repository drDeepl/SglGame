import {createStore} from 'vuex';
// import message from './module.message';
import {auth} from './module.auth';
import {user} from './module.user';
import instance from '@/api/main';

const userInfo = localStorage.getItem('user');
if (userInfo) {
  console.warn('TOKEN EXIST');
  instance.defaults.headers.common['Authorization'] = userInfo.access;
}

export default createStore({
  modules: {auth, user},
});
