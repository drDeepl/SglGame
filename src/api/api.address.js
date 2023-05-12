import instance from './main';

const API_PATH = '/gameDB/address';

class ApiAddress {
  async getRows() {
    return instance.get(`${API_PATH}/index`);
  }
  async create(modelCreate) {
    return instance.post(`${API_PATH}/create`, modelCreate);
  }

  async update(modelUpdate) {
    return instance.put(`${API_PATH}/update`, modelUpdate);
  }

  async delete(idRow) {
    return instance.delete(`${API_PATH}/delete/${idRow}`);
  }
}

export default new ApiAddress();
