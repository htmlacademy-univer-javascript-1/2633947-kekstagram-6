const API_ENDPOINTS = {
<<<<<<< HEAD
  DATA_FETCH: 'https://29.javascript.htmlacademy.pro/kekstagram/data',
  DATA_SUBMIT: 'https://29.javascript.htmlacademy.pro/kekstagram/',
};


const performApiRequest = (successCallback, errorCallback, httpMethod, requestBody) => {
  // Выполняем fetch запрос к указанному endpoint
  fetch(API_ENDPOINTS[httpMethod], {
    method: httpMethod,
    body: requestBody,
  })
    .then((apiResponse) => {
      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }
      return apiResponse.json();
    })
    .then((responseData) => {
      // При успешном получении данных вызываем колбэк успеха
      successCallback(responseData);
    })
    .catch((requestError) => {
      // При ошибке вызываем колбэк ошибки
      console.error('API request failed:', requestError);
=======
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
>>>>>>> origin/master
      errorCallback(requestError);
    });
};

<<<<<<< HEAD

//Загружает данные фотографий с сервера (GET запрос)
=======
// Загружает данные фотографий
>>>>>>> origin/master
const fetchPhotoData = (successCallback, errorCallback, httpMethod = 'GET') => {
  performApiRequest(successCallback, errorCallback, httpMethod);
};

<<<<<<< HEAD
const submitPhotoData = (successCallback, errorCallback, httpMethod = 'POST', requestBody) => {
  performApiRequest(successCallback, errorCallback, httpMethod, requestBody);
};

// Экспорт функций для использования в других модулях
=======
// Отправляет данные фотографии
const submitPhotoData = (successCallback, errorCallback, httpMethod = 'POST', body) => {
  performApiRequest(successCallback, errorCallback, httpMethod, body);
};

>>>>>>> origin/master
export { fetchPhotoData, submitPhotoData };
