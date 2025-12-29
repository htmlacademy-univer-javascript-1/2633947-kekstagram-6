<<<<<<< HEAD
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
=======
const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/'
};

const Method = {
  GET: 'GET',
  POST: 'POST'
};

const ErrorText = {
  [Method.GET]: 'Не удалось загрузить данные. Попробуйте обновить страницу',
  [Method.POST]: 'Ошибка загрузки файла'
};

async function request(url, method = Method.GET, body = null) {
  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    body
  });

  if (!response.ok) {
    throw new Error(ErrorText[method]);
  }

  return response.json();
}

async function loadPhotos() {
  return request(Route.GET_DATA);
}

async function sendForm(formData) {
  return request(Route.SEND_DATA, Method.POST, formData);
}

export { loadPhotos, sendForm };
>>>>>>> 5b08c58b69231c934818936e0997605e6f8312c9
