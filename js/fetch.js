const URLS = {
  GET: 'https://29.javascript.htmlacademy.pro/kekstagram/data',
  POST: 'https://29.javascript.htmlacademy.pro/kekstagram/',
};

const makeRequest = (onSuccess, onError, method, body) => {
  fetch(URLS[method], {
    method: method,
    body: body,
  })
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
    })
    .catch((err) => {
      onError(err);
    });
};

const fetchPhotoData = (onSuccess, onError, method = 'GET') => {
  makeRequest(onSuccess, onError, method);
};

const submitPhotoData = (onSuccess, onError, method = 'POST', body) => {
  makeRequest(onSuccess, onError, method, body);
};

export { fetchPhotoData, submitPhotoData };
