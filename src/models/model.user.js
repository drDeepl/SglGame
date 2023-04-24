class User {
  constructor() {
    this.data = {
      username: '',
      password: '',
      role: ''
    };

    this.labels = {
      username: 'Имя пользователя',
      password: 'Пароль',
      role: 'Роль'
    };

    this.rules = {
      username: {required: true, message: 'Необходимое поле', trigger: 'blur'},
      password: {
        required: true,
        validator(rule, value) {
          if (!value) {
            return new Error('Необходимое поле');
          } else if (value.length < 6) {
            return new Error('Пароль должен содержать больше 6-ти символов');
          }
          return true;
        }
      },
      role: {required: true, message: 'Необходимое поле', trigger: 'blur'}
    };
  }
}

export default new User();
