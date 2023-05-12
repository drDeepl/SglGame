import ApiAddress from '@/api/api.address';
import {decorateResponseApi} from './utils';
import {logR} from './utils';

class AddressService {
  async getRows() {
    logR('warn', 'Adress.Service:getRows');
    const response = decorateResponseApi(ApiAddress.getRows);
    if (response.status === 200) {
      return response.data;
    } else {
      return [];
    }
  }

  async createRow(data) {
    logR('warn', 'Adress.Service:createRow');
    const response = await decorateResponseApi(ApiAddress.create, data);
    return response;
  }
  async 
}

export default new AddressService();
