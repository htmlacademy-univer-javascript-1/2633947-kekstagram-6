import { initThumbnails } from './thumbnail-renderer.js';
import { initFullscreenViewer } from './fullscreen-viewer.js';
import { initFormValidator } from './form-validator.js';
import { initEffects } from './effects.js';
import { loadPhotos } from './api.js';
import { showAlert } from './message.js';
import { initFilters } from './filters.js';

// Функция для показа сообщения об ошибке загрузки данных
function showDataError() {
  const errorContainer = document.createElement('div');
  errorContainer.classList.add('data-error');
  errorContainer.style.zIndex = '100';
  errorContainer.style.position = 'fixed';
  errorContainer.style.left = '0';
  errorContainer.style.top = '0';
  errorContainer.style.right = '0';
  errorContainer.style.padding = '10px 3px';
  errorContainer.style.fontSize = '16px';
  errorContainer.style.textAlign = 'center';
  errorContainer.style.backgroundColor = 'red';
  errorContainer.style.color = 'white';
  errorContainer.textContent = 'Не удалось загрузить фотографии. Проверьте подключение к интернету.';

  document.body.append(errorContainer);

  // Автоматическое скрытие через 5 секунд
  setTimeout(() => {
    if (errorContainer.parentNode) {
      errorContainer.remove();
    }
  }, 5000);
}

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
    console.error('Ошибка загрузки данных:', error);
    // Показываем сообщение об ошибке
    showDataError();
  }
});
