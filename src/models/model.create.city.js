class CreateCity {
  constructor() {
    this.data = {
      city_id: null,
      name: '',
    };

    this.labels = {
      city_id: 'Идентификатор города',
      name: 'Название города',
    };

    this.rules = {
      city_id: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      name: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
    };
  }
}

export default CreateCity;
