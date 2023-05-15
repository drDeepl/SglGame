class User {
  constructor() {
    this.data = {
      id: '',
      username: '',
      role: '',
    };

    this.labels = {
      id: 'id',
      username: 'Имя пользователя',
      role: 'Роль',
    };

    this.rules = {
      username: {required: true, message: 'Необходимое поле', trigger: 'blur'},
      role: {required: true, message: 'Необходимое поле', trigger: 'blur'},
    };
  }
}

export default User;
