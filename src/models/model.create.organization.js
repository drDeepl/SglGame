class CreateOrganization {
  constructor() {
    this.data = {
      organization_id: null,
      name: '',
      address_id: null,
    };

    this.labels = {
      organization_id: 'Идентификатор организации',
      name: 'Название организации',
      address_id: 'Идентификатор адреса',
    };

    this.rules = {
      name: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
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

export default CreateOrganization;
