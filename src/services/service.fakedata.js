import apiClient from '@/api/main';

class FakeData {
  baseUrl = 'http://jsonplaceholder.typicode.com';
  async getUsers() {
    return apiClient.get(`${this.baseUrl}/users`);
  }
}

export default new FakeData();
