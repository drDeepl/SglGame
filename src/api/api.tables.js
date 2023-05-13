import instance from './main';

const API_PATH = '/gameDB';

class ApiTables {
  async getRows(controllerName) {
    return instance.get(`${API_PATH}/${controllerName}/index`);
  }
  async create(controllerName, modelCreate) {
    return instance.post(`${API_PATH}/${controllerName}/create`, modelCreate);
  }

  async update(controllerName, modelUpdate) {
    return instance.post(`${API_PATH}/${controllerName}/update`, modelUpdate);
  }

  async delete(controllerName, idRow) {
    return instance.delete(`${API_PATH}/${controllerName}/delete/${idRow}`);
  }
}

export default new ApiTables();
