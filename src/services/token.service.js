class TokenService {
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.refresh;
  }

  getLocalAccessToken() {
    console.warn('TOKEN.SERVICE: getLocalAccessToken');
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.access : null;
  }

  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem('user'));
    user.access = token;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  setUser(user) {
    console.log('TOKEN.SERVICE: setUser');
    console.log(JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
  }

  removeUser() {
    localStorage.removeItem('user');
  }
}

export default new TokenService();
