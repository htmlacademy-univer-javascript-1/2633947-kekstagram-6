// main.js
import { similarPhotoDescriptions } from './data.js';
import { initThumbnails } from './thumbnail-renderer.js';
import { initFullscreenViewer } from './fullscreen-viewer.js';
import { initFormValidator } from './form-validator.js';

// Инициализируем все модули при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  initThumbnails();
  initFullscreenViewer();
  initFormValidator();
});

// Экспортируем данные для использования в других модулях
export { similarPhotoDescriptions };
