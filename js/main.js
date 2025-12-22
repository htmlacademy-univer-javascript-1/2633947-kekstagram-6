import { initThumbnails } from './thumbnail-renderer.js';
import { initFullscreenViewer } from './fullscreen-viewer.js';
import { initFormValidator } from './form-validator.js';
import { initImageEditor } from './image-editor.js';
import { loadPhotos } from './api.js';
import { showAlert } from './messages.js';
import { initFilters } from './filters.js';
import { initEffects } from './effects.js';

// Инициализируем все модули
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Инициализируем базовые модули
    initFormValidator();
    initImageEditor();
    initEffects();
    initFullscreenViewer();

    // Загружаем данные
    const photos = await loadPhotos();
    window.loadedPhotosData = photos;

    // Инициализируем миниатюры
    initThumbnails(photos);

    // Инициализируем фильтры
    initFilters(photos, initThumbnails);

  } catch (error) {
    showAlert('Не удалось загрузить фотографии. Проверьте подключение к интернету.');
  }
});
