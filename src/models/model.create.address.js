class CreateAddress {
  constructor() {
    this.data = {
      address_id: null,
      street: '',
      number: '',
      city_id: null,
    };

    this.labels = {
      address_id: 'Идентификатор адреса',
      street: 'Улица',
      number: 'Номер',
      city_id: 'Идентификатор города',
    };

    this.rules = {
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
      street: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      number: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      city_id: {
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

export default CreateAddress;
