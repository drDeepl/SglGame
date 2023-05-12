class CreateEventCheckIn {
  constructor() {
    this.data = {
      event_name: '',
      person_id: null,
      date: '',
      ec_id: null,
    };

    this.labels = {
      event_name: 'Название мероприятия',
      person_id: 'Идентификатор человека',
      date: 'Дата',
      ec_id: 'Идентификатор регистрации мероприятия',
    };

    this.rules = {
      event_name: {
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
      ec_id: {
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
      date: {
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

export default CreateEventCheckIn;
