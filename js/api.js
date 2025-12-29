const URLS = {
  GET: 'https://29.javascript.htmlacademy.pro/kekstagram/data', // URL для получения данных
  POST: 'https://29.javascript.htmlacademy.pro/kekstagram/', // URL для отправки данных
};

const makeRequest = (onSuccess, onError, method, body) => { // Выполняет HTTP-запрос к API
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

const fetchPhotoData = (onSuccess, onError, method = 'GET') => { // Загружает данные фотографий
  makeRequest(onSuccess, onError, method);
};

const submitPhotoData = (onSuccess, onError, method = 'POST', body) => { // Отправляет данные фотографии
  makeRequest(onSuccess, onError, method, body);
};

export { fetchPhotoData, submitPhotoData };
