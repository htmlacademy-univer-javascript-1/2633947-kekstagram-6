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
  try {
    return await request(Route.GET_DATA);
  } catch (error) {
    // Перебрасываем ошибку для обработки в main.js
    throw error;
  }
}

async function sendForm(formData) {
  try {
    return await request(Route.SEND_DATA, Method.POST, formData);
  } catch (error) {
    // Перебрасываем ошибку для обработки в form-validator.js
    throw error;
  }
}

export { loadPhotos, sendForm };
