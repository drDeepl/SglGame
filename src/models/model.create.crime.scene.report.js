class CreateCrimeSceneReport {
  constructor() {
    this.data = {
      description: '',
      type: '',
      city_id: null,
      csr_id: null,
    };

    this.labels = {
      description: 'Описание',
      type: 'Тип',
      city_id: 'Идентификатор города',
      csr_id: 'Идентификатор отчета о месте преступления',
    };

    this.rules = {
      description: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      type: {
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
      csr_id: {
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

export default CreateCrimeSceneReport;
