class CreatePerson {
  constructor() {
    this.data = {
      person_id: null,
      firstname: '',
      lastname: '',
      gender: '',
      age: '',
      eye_color: '',
      hair_color: '',
      address_id: null,
    };

    this.labels = {
      person_id: 'Идентификатор человека',
      firstname: 'Имя',
      lastname: 'Фамилия',
      gender: 'Пол',
      age: 'Возраст',
      eye_color: 'Цвет глаз',
      hair_color: 'Цвет волос',
      address_id: 'Идентификатор адреса',
    };

    this.rules = {
      firstname: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      lastname: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      gender: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      age: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      eye_color: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      hair_color: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      person_id: {
        required: true,
        validator(rule, value) {
          if (!value) {
            return new Error('Необходимое поле');
          } else if (!/^-?\d+$/.test(value)) {
            return new Error('Необходимо ввести число');
          }
          return true;
        },
      },
      address_id: {
        required: true,
        validator(rule, value) {
          if (!value) {
            return new Error('Необходимое поле');
          } else if (!/^-?\d+$/.test(value)) {
            return new Error('Необходимо ввести число');
          }
          return true;
        },
      },
    };
  }
}

export default CreatePerson;
