class CreateInterview {
  constructor() {
    this.data = {
      interview_id: null,
      transcript: '',
      person_id: null,
      csr_id: null,
    };

    this.labels = {
      interview_id: 'Идентификатор интервью',
      transcript: 'Текст',
      person_id: 'Идентификатор сотрудника',
      csr_id: 'Идентификатор отчета',
    };

    this.rules = {
      transcript: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      interview_id: {
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
    };
  }
}

export default CreateInterview;
