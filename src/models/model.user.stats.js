class UserStats {
  constructor() {
    this.data = {
      game_end_date: '',
      checks_answer: '',
      scores: '',
      is_completed: '',
    };

    this.labels = {
      game_end_date: 'Дата начала игры',
      checks_answer: 'Проверок ответа',
      scores: 'Очки',
      is_completed: 'Пройдена',
    };
  }
}

export default UserStats;
