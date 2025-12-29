const API_ENDPOINTS	 = {
  GET: 'https://29.javascript.htmlacademy.pro/kekstagram/data', // URL для получения данных
  POST: 'https://29.javascript.htmlacademy.pro/kekstagram/', // URL для отправки данных
};

const performApiRequest = (onSuccess, onError, method, body) => { // Выполняет HTTP-запрос к API
  fetch(API_ENDPOINTS	[method], {
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
  performApiRequest(onSuccess, onError, method);
};

const submitPhotoData = (onSuccess, onError, method = 'POST', body) => { // Отправляет данные фотографии
  performApiRequest(onSuccess, onError, method, body);
};

export { fetchPhotoData, submitPhotoData };
