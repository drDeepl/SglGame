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
        message: 'Необходимое поле',
        trigger: 'blur',
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

export default new CreateStory();
