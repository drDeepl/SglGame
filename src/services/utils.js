import TokenService from './token.service';

import {isDevelop} from '@/_config';
export function logR(type, msg) {
  // INFO: зато забавно
  if (isDevelop) {
    if (type == 'log') {
      console.log(msg);
    } else if (type == 'warn') {
      console.warn(msg);
    } else if (type == 'error') {
      console.error(msg);
    }
  }
}

export const decorateResponseApi = async function (func, context) {
  // let response = {status: 404, data: null, message: ''};
  const token = TokenService.getLocalAccessToken();
  console.log('token\n', token);
  const config = {headers: {Authorization: token}};
  const response = await func(context, config).catch((resp) => {
    console.error('DECORATE RESPONSE API\n', resp);
    if (resp.status) {
      return {status: resp.status};
    } else {
      return {status: resp.response.status};
    }
  });
  if (response.status != 200) {
    return {status: response.status, data: null};
  }
  // if (responseWrap.status == 200) {
  //   response.status = responseWrap.status;
  //   response.data = responseWrap.data;
  //   return response;
  // }
  return response;
};

export const extractJWT = function (token) {
  logR('warn', 'Service.Utils: ExtractJWT');
  console.log('TOKEN', token);
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

export const sqlQueryIsValidate = function (query) {
  let response = {isValid: false, message: []};
  const lowerCaseQuery = query.toLowerCase().trim();
  const arrayQuerys = lowerCaseQuery.split(';');
  const splitedQueryByFrom = lowerCaseQuery.split('from');
  console.log(splitedQueryByFrom);
  if (arrayQuerys.length != 1 && arrayQuerys[1].length > 0) {
    console.log(arrayQuerys);
    response.message = 'выполнено два запроса одновременно';
  } else if (splitedQueryByFrom.at(0).startsWith('select')) {
    response.message = 'Нет ключевого слова SELECT';
  } else if (/(,)/.test(splitedQueryByFrom).at(1)) {
    response.message = 'выполено объединеие таблиц';
  } else {
    response.isValid = true;
  }

  return response;
};

export const prepareDataTable = function (columns, values) {
  let tableHeader = [];
  for (let i = 0; i < columns.length; i++) {
    const column = {title: columns[i], key: columns[i]};

    tableHeader.push(column);
  }
  let array_vals = [];
  values.forEach((row) => {
    const value = {};
    for (let column = 0; column < columns.length; column++) {
      value[columns[column]] = row[column];
    }
    array_vals.push(value);
  });
  const result = {tableHeader: tableHeader, array_vals: array_vals};
  return result;
};

export const getBinaryFromFile = function (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', (err) => reject(err));

    reader.readAsBinaryString(file);
  });
};

export const toChunks = function (arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const blobToUint8Array = function (blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(new Uint8Array(this.result));
    };
    reader.onerror = function () {
      reject(this.error);
    };
    reader.readAsArrayBuffer(blob);
  });
};

export const decorateResponseDataArray = function (response) {
  if (response.status === 200) {
    return response.data;
  } else {
    return [];
  }
};
