class UserRegister {
  constructor() {
    this.data = {
      username: '',
      password: '',
      role: '',
    };

    this.labels = {
      username: 'Имя пользователя',
      password: 'Пароль',
      role: 'Роль',
    };

    this.rules = {
      username: {required: true, message: 'Необходимое поле', trigger: 'blur'},
      password: {
        required: true,
        validator: (rule, value) => {
          if (!value) {
            return new Error('Необходимое поле');
          } else if (value.length <= 2) {
            return new Error('Пароль должен содержать больше 2-ти символов');
          }
          return true;
        },
      },
      role: {required: true, message: 'Необходимое поле', trigger: 'blur'},
    };
  }
}

export default UserRegister;
