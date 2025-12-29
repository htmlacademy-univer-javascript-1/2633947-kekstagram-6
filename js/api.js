const URLS = { // Объект с конечными точками API сервера
  GET: 'https://29.javascript.htmlacademy.pro/kekstagram/data', // URL для получения данных
  POST: 'https://29.javascript.htmlacademy.pro/kekstagram/', // URL для отправки данных
};

const makeRequest = (onSuccess, onError, method, body) => { // Выполняет HTTP-запрос к API
  fetch(URLS[method], { // Отправка запроса с помощью Fetch API
    method: method, // HTTP-метод (GET или POST)
    body: body, // Тело запроса (для POST-запросов)
  })
    .then((response) => response.json()) // Преобразование ответа в JSON формат
    .then((data) => { // Обработка успешного ответа
      onSuccess(data); // Вызов callback-функции при успехе
    })
    .catch((err) => { // Обработка ошибок запроса
      onError(err); // Вызов callback-функции при ошибке
    });
};

const fetchPhotoData = (onSuccess, onError, method = 'GET') => { // Загружает данные фотографий
  makeRequest(onSuccess, onError, method); // Вызов основного метода запроса
};

const submitPhotoData = (onSuccess, onError, method = 'POST', body) => { // Отправляет данные фотографии
  makeRequest(onSuccess, onError, method, body); // Вызов основного метода запроса с телом
};

export { fetchPhotoData, submitPhotoData }; // Экспорт функций для использования в других модулях
