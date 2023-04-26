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
  let response = {status: 200, data: null, message: ''};

  const responseWrap = await func(context).catch((resp) => {
    response.status = resp.status;
  });

  console.log('RESPONSE WRAP\n', responseWrap);
  if (responseWrap.status != 200) {
    response.message = 'Что-то пошло не так';
    return response;
  }
  response.data = responseWrap.data;
  return response;
};
