class CreateDriverLicence {
  constructor() {
    this.data = {
      license_id: null,
      person_id: null,
      plate_number: '',
      car_make: '',
      car_model: '',
    };

    this.labels = {
      license_id: 'Идентификатор лицензии',
      person_id: 'Идентификатор обладателя лицензии',
      plate_number: 'Номерной знак',
      car_make: 'Марка автомобиля',
      car_model: 'Модель автомобиля',
    };

    this.rules = {
      plate_number: {
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
      license_id: {
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
      car_model: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      car_make: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
    };
  }
}

export default CreateDriverLicence;
