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
  let response = {status: 404, data: null, message: ''};
  const responseWrap = await func(context).catch((resp) => {
    console.error('DECORATE RESPONSE API\n', resp);
    return {status: 404};
  });
  if (responseWrap.status == 200) {
    response.status = responseWrap.status;
    response.data = responseWrap.data;
    return response;
  }
  return response;
};

export const extractJWT = function (token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

export const sqlQueryIsValidate = function (query) {
  const lowerCaseQuery = query.toLowerCase();
  const arrayQuerys = lowerCaseQuery.split(';');
  if (arrayQuerys.length > 1) {
    return false;
  } else if (!/^(select)/.test(lowerCaseQuery)) {
    return false;
  } else if (/\s\b[join]\b\s/.test(lowerCaseQuery)) {
    return false;
  } else if (/\bfrom\s+(\w+\.)?\w+\s+(,\s*(\w+\.)?\w+)*/.test(lowerCaseQuery)) {
    return false;
  }
  return true;
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
