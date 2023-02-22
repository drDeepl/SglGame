export default class ModelCreateUser {
  username: string;
  password: string;
  label: Object = {
    username: "Имя пользовтеля",
    password: "Пароль",
  };

  constructor() {
    this.username = "";
    this.password = "";
  }
}
