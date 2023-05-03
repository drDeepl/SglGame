import {logR} from './utils';
class TokenService {
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.refresh;
  }

  getLocalAccessToken() {
    console.warn('TOKEN.SERVICE: getLocalAccessToken');
    const token = JSON.parse(localStorage.getItem('token'));
    return token ? token.accessToken : null;
  }

  updateLocalAccessToken(accessTtoken) {
    logR('warn', 'TokenService: updateLocalAccessToken');
    let token = JSON.parse(localStorage.getItem('token'));
    console.log(token);
    token.accessToken = accessTtoken;
    localStorage.setItem('token', JSON.stringify(token));
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
