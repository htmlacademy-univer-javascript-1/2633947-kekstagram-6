const API_ENDPOINTS = {
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
      errorCallback(requestError);
    });
};


//Загружает данные фотографий с сервера (GET запрос)
const fetchPhotoData = (successCallback, errorCallback, httpMethod = 'GET') => {
  performApiRequest(successCallback, errorCallback, httpMethod);
};

const submitPhotoData = (successCallback, errorCallback, httpMethod = 'POST', requestBody) => {
  performApiRequest(successCallback, errorCallback, httpMethod, requestBody);
};

// Экспорт функций для использования в других модулях
export { fetchPhotoData, submitPhotoData };
