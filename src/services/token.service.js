import {logR} from './utils';
class TokenService {
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.refresh;
  }

  getLocalAccessToken() {
    console.warn('TOKEN.SERVICE: getLocalAccessToken');
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.accessToken : null;
  }

  updateLocalAccessToken(token) {
    logR('warn', 'TokenService: updateLocalAccessToken');
    let user = JSON.parse(localStorage.getItem('user'));
    user.accessToken = token;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  getToken() {
    return JSON.parse(localStorage.getItem('token'));
  }

  setUser(user) {
    logR('warn', 'TokenService: setUser');

    console.log(JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
  }

  setToken(token) {
    logR('warn', 'TokenService: setToken');
    console.log(JSON.stringify(token));
    localStorage.setItem('token', JSON.stringify(token));
  }

  removeUser() {
    localStorage.removeItem('user');
  }
}

export default new TokenService();
