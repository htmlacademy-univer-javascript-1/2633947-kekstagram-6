// main.js
import { similarPhotoDescriptions } from './data.js';
import { initThumbnails } from './thumbnail-renderer.js';

// Инициализируем отрисовку миниатюр при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  initThumbnails();
});

// Экспортируем данные для использования в других модулях
export { similarPhotoDescriptions };
