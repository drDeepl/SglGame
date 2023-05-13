class CreateEducationInstitution {
  constructor() {
    this.data = {
      edu_id: null,
      name: '',
      address_id: null,
    };

    this.labels = {
      edu_id: 'Идентификатор образовательного учреждения',
      name: 'Название образовательного учреждения',
      address_id: 'Идентификатор адреса',
    };

    this.rules = {
      name: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      edu_id: {
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

export default CreateEducationInstitution;
