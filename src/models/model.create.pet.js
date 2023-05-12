class CreatePet {
  constructor() {
    this.data = {
      id: null,
      name: '',
      breed: '',
      person_id: null,
    };

    this.labels = {
      id: 'Идентификатор питомца',
      name: 'Кличка',
      breed: 'Порода',
      person_id: 'Идентификатор хозяина',
    };

    this.rules = {
      name: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      breed: {
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
      id: {
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

export default CreatePet;
