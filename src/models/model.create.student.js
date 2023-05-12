class CreateStudent {
  constructor() {
    this.data = {
      students_id: null,
      edu_id: null,
      person_id: null,
      enrollment_date: '',
      expulsion_date: '',
    };

    this.labels = {
      students_id: 'Идентификатор студента',
      edu_id: 'Идентификатор образовательного учреждения',
      person_id: 'Идентификатор из таблицы person',
      enrollment_date: 'Дата зачисления',
      expulsion_date: 'Дата отчисления',
    };

    this.rules = {
      students_id: {
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
      enrollment_date: {
        required: true,
        validator(rule, value) {
          if (!value) {
            return new Error('Необходимое поле');
          } else if (!/\d{1,2}:\d{1,2}:\d{4}$/.test(value)) {
            return new Error('Необходимо ввести дату в формате ДД:ММ:ГГГГ');
          }
          return true;
        },
      },
      expulsion_date: {
        required: true,
        validator(rule, value) {
          if (!value) {
            return new Error('Необходимое поле');
          } else if (!/\d{1,2}:\d{1,2}:\d{4}$/.test(value)) {
            return new Error('Необходимо ввести дату в формате ДД:ММ:ГГГГ');
          }
          return true;
        },
      },
    };
  }
}

export default CreateStudent;
