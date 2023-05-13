import ApiTables from '@/api/api.tables';

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
          return {status: error.status};
        } else {
          result.status = error.response.status;
          return {status: error.response.status};
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
    let result = {status: null, message: 'Что-то пошло не так...'};
    const response = await ApiTables.create(this.controllerName, data).catch(
      (error) => {
        if (error.status) {
          result.status = error.status;
          return {status: error.status};
        } else {
          result.status = error.response.status;
          return {status: error.response.status};
        }
      }
    );
    if (response.status === 200) {
      return response.data;
    }
    return result;
  }
  async updateRow(modelUpdate) {
    logR('warn', 'Table.Service:updateRow');
    let result = {status: null, message: 'Что-то пошло не так...'};
    const response = await ApiTables.update(
      this.controllerName,
      modelUpdate
    ).catch((error) => {
      if (error.status) {
        result.status = error.status;
        return {status: error.status};
      } else {
        result.status = error.response.status;
        return {status: error.response.status};
      }
    });
    if (response.status === 200) {
      return response.data;
    }
    return result;
  }

  async deleteRow(modelDelete) {
    logR('warn', 'Table.Service:deleteRow');
    let result = {status: null, message: 'Что-то пошло не так...'};
    const response = await ApiTables.delete(
      this.controllerName,
      modelDelete
    ).catch((error) => {
      console.log('ERROR REQUEST', error);
      if (error.status) {
        result.status = error.status;
        return {status: error.status};
      } else {
        result.status = error.response.status;
        return {status: error.response.status};
      }
    });
    if (response.status === 200) {
      return response.data;
    }
    console.log(response);
    return result;
  }
}

export default TableService;
