// main.js
import { similarPhotoDescriptions } from './data.js';
import { initThumbnails } from './thumbnail-renderer.js';

// Инициализируем отрисовку миниатюр при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  console.log('Данные фотографий загружены:', similarPhotoDescriptions.length, 'шт.');
  initThumbnails();
});

// Экспортируем данные для использования в других модулях
export { similarPhotoDescriptions };
