const API_ENDPOINTS = {
  GET: 'https://29.javascript.htmlacademy.pro/kekstagram/data', // URL для получения данных
  POST: 'https://29.javascript.htmlacademy.pro/kekstagram/', // URL для отправки данных
};

// Выполняет HTTP-запрос к API
const performApiRequest = (successCallback, errorCallback, httpMethod, body) => {
  fetch(API_ENDPOINTS[httpMethod], {
    httpMethod: httpMethod,
    body: body,
  })
    .then((response) => response.json())
    .then((requestError) => {
      successCallback(requestError);
    })
    .catch((requestError) => {
      errorCallback(requestError);
    });
};

// Загружает данные фотографий
const fetchPhotoData = (successCallback, errorCallback, httpMethod = 'GET') => {
  performApiRequest(successCallback, errorCallback, httpMethod);
};

// Отправляет данные фотографии
const submitPhotoData = (successCallback, errorCallback, httpMethod = 'POST', body) => {
  performApiRequest(successCallback, errorCallback, httpMethod, body);
};

export { fetchPhotoData, submitPhotoData };
