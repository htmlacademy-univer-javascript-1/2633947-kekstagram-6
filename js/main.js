import { loadData } from './fetch.js';
import { imageRender } from './picture.js';
import './filters.js';
import './form.js';

let photos = [];

const onSuccess = (data) => {
  photos = data.slice();
  imageRender(photos);
  document.querySelector('.img-filters').classList.remove('img-filters--inactive');
};

// Функция ошибки загрузки
const onFail = () => {
  const messageAlert = document.createElement('div');
  messageAlert.className = 'data-error';
  messageAlert.style.position = 'fixed';
  messageAlert.style.top = '20px';
  messageAlert.style.left = '50%';
  messageAlert.style.transform = 'translateX(-50%)';
  messageAlert.style.backgroundColor = '#ee3939ff';
  messageAlert.style.color = 'white';
  messageAlert.style.padding = '30px 50px';
  messageAlert.style.borderRadius = '8px';
  messageAlert.style.zIndex = '10000';
  messageAlert.style.textAlign = 'center';
  messageAlert.style.fontSize = '20px';
  messageAlert.style.fontFamily = 'Arial, sans-serif';
  messageAlert.textContent = 'Ошибка загрузки фотографий!';
  document.body.append(messageAlert);
};

// Загружаем данные с сервера
loadData(onSuccess, onFail);

const getPhotos = () => photos.slice();

export { getPhotos };
