class CreateStory {
  constructor() {
    this.data = {
      title: '',
      difficulty: '',
      description: '',
      story_text: '',
      answer: '',
    };

    this.labels = {
      title: 'Название',
      difficulty: 'Уровень сложности',
      description: 'Описание истории',
      story_text: 'Текст истории',
      answer: 'Ответ',
    };

    this.rules = {
      title: {required: true, message: 'Необходимое поле', trigger: 'blur'},
      difficulty: {
        required: true,
        validator: (rule, value) => {
          if (!value) {
            return new Error('Необходимое поле');
          } else if (!/^[1-5]$/.test(value)) {
            return new Error('Необходимо ввести число от 1 до 5 включительно');
          }
          return true;
        },
      },
      description: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      story_text: {
        required: true,
        message: 'Необходимое поле',
        trigger: 'blur',
      },
      answer: {required: true, message: 'Необходимое поле', trigger: 'blur'},
    };
  }
}

export default CreateStory;
