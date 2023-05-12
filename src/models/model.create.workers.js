class CreateWorkers {
  constructor() {
    this.data = {
      workers_id: null,
      person_id: null,
      organization_id: null,
    };

    this.labels = {
      workers_id: 'Идентификатор работника',
      person_id: 'Идентификатор из таблицы person',
      organization_id: 'Идентификатор организации работодателя',
    };

    this.rules = {
      workers_id: {
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
      organization_id: {
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

export default CreateWorkers;
