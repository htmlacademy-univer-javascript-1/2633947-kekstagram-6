import { initThumbnails } from './thumbnail-renderer.js';
import { initFullscreenViewer } from './fullscreen-viewer.js';
import { initFormValidator } from './form-validator.js';
import { initEffects } from './effects.js';
import { loadPhotos } from './api.js';
import { showAlert } from './message.js';
import { initFilters } from './filters.js';

// Инициализируем все модули
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Инициализируем базовые модули
    initFormValidator();
    initEffects();
    initFullscreenViewer();

    // Загружаем данные
    const photos = await loadPhotos();

    // Сохраняем данные в глобальной переменной для доступа из других модулей
    window.loadedPhotosData = photos;

    // Инициализируем миниатюры
    initThumbnails(photos);

    // Инициализируем фильтры
    initFilters(photos, initThumbnails);

  } catch (error) {
    showAlert('Не удалось загрузить фотографии. Проверьте подключение к интернету.');
  }
});
