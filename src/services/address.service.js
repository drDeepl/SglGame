import ApiTables from '@/api/api.tables';
import {decorateResponseApi} from './utils';
import {logR} from './utils';

class AddressService {
  async getRows() {
    logR('warn', 'Adress.Service:getRows');
    const response = decorateResponseApi(ApiTables.getRows);
    if (response.status === 200) {
      return response.data;
    } else {
      return [];
    }
  }

  async createRow(data) {
    logR('warn', 'Adress.Service:createRow');
    const response = await decorateResponseApi(ApiTables.create, data);
    return response;
  }
  async updateRow(modelUpdate) {
    logR('warn', 'Adress.Service:updateRow');
    const response = await decorateResponseApi(ApiTables.update, modelUpdate);
    return response;
  }

  async deleteRow(modelDelete) {
    logR('warn', 'Adress.Service:deleteRow');
    const response = await decorateResponseApi(ApiTables.delete, modelDelete);
    return response;
  }
}

export default new AddressService();
