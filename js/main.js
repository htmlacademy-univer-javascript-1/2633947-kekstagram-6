// main.js
import { initThumbnails } from './thumbnail-renderer.js';
import { initFullscreenViewer } from './fullscreen-viewer.js';
import { initFormValidator } from './form-validator.js';
import { initImageEditor } from './image-editor.js';
import { loadPhotos } from './api.js';
import { showAlert } from './messages.js';

// Глобальная переменная для хранения загруженных данных
let photosData = [];

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
