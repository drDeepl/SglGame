export function authHeader() {
  let headers = {
    Authorization: null,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };
  return headers;
}
