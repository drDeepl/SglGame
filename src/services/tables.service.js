import ApiTables from '@/api/api.tables';
import {decorateResponseApi} from './utils';
import {logR} from './utils';

class TableService {
  constructor(controllerName) {
    this.controllerName = controllerName;
  }
  async getRows() {
    logR('warn', 'Table.Service:getRows');
    let result = {status: null, message: 'Что-то пошло не так...'};
    const response = await ApiTables.getRows(this.controllerName).catch(
      (error) => {
        if (error.status) {
          result.status = error.status;
        } else {
          result.status = error.response.status;
        }
      }
    );
    if (response.status === 200) {
      return response.data;
    }
    return result;
  }

  async createRow(data) {
    logR('warn', 'Table.Service:createRow');
    const response = await decorateResponseApi(ApiTables.create, data);
    return response;
  }
  async updateRow(modelUpdate) {
    logR('warn', 'Table.Service:updateRow');
    const response = await decorateResponseApi(ApiTables.update, modelUpdate);
    return response;
  }

  async deleteRow(modelDelete) {
    logR('warn', 'Table.Service:deleteRow');
    const response = await decorateResponseApi(ApiTables.delete, modelDelete);
    return response;
  }
}

export default TableService;
