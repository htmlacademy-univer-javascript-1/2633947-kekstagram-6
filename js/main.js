<<<<<<< HEAD
import { fetchPhotoData } from './api.js';
import { imageRender } from './gallery-manager.js';
import './image-filter.js';
import './upload-form-manager.js';

// Массив для хранения загруженных фотографий
let photos = [];

// Обработчик успешной загрузки данных
const onSuccess = (data) => {
  photos = data.slice();
  imageRender(photos);
  document.querySelector('.img-filters').classList.remove('img-filters--inactive');
};

// Обработчик ошибки загрузки данных
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

// Инициализация загрузки данных приложения
fetchPhotoData(onSuccess, onFail);

// Функция получения копии массива фотографий
const getPhotos = () => photos.slice();

export { getPhotos };
=======
import { initThumbnails } from './thumbnail-renderer.js';
import { initFullscreenViewer } from './fullscreen-viewer.js';
import { initFormValidator } from './form-validator.js';
import { initImageEditor } from './image-editor.js';
import { loadPhotos } from './api.js';
import { showAlert } from './messages.js';
import { initFilters } from './filters.js';
import { renderThumbnails } from './thumbnail-renderer.js';

// Глобальная переменная для хранения загруженных данных
let photosData = [];

// Функция для отрисовки миниатюр через фильтры
function renderPhotosWithFilters(photos) {
  renderThumbnails(photos);
}

// Загружаем данные с сервера
async function loadDataFromServer() {
  try {
    photosData = await loadPhotos();
    // Сохраняем данные в глобальную переменную для использования другими модулями
    window.loadedPhotosData = photosData;

    // Инициализируем отрисовку с загруженными данными
    if (typeof initThumbnails === 'function') {
      initThumbnails(photosData);
    }

    // Инициализируем фильтры
    initFilters(photosData, renderPhotosWithFilters);

  } catch (error) {
    showAlert('Не удалось загрузить фотографии. Попробуйте обновить страницу');
    // Используем пустой массив, чтобы не ломать существующий функционал
    photosData = [];
    window.loadedPhotosData = photosData;
  }
}

// Инициализируем все модули при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
  // Загружаем данные с сервера
  await loadDataFromServer();

  // Инициализируем остальные модули
  initFullscreenViewer();
  initFormValidator();
  initImageEditor();
});

// Экспортируем данные для использования в других модулях
export { photosData };
>>>>>>> 5b08c58b69231c934818936e0997605e6f8312c9
