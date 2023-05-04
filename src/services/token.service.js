class TokenService {
  getLocalRefreshToken() {
    const token = JSON.parse(localStorage.getItem('token'));
    return token?.refreshToken;
  }

  getLocalAccessToken() {
    const token = JSON.parse(localStorage.getItem('token'));
    return token ? token.accessToken : null;
  }

  updateLocalAccessToken(accessTtoken) {
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
    console.log(JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
  }

  setToken(token) {
    localStorage.setItem('token', JSON.stringify(token));
  }

  removeUser() {
    localStorage.removeItem('user');
  }
  removeToken() {
    localStorage.removeItem('token');
  }
}

export default new TokenService();
