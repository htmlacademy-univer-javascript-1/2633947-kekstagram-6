// main.js
import { similarPhotoDescriptions } from './data.js';
import { initThumbnails } from './thumbnail-renderer.js';
import { initFullscreenViewer } from './fullscreen-viewer.js';

// Инициализируем модули при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  initThumbnails();
  initFullscreenViewer();
});

// Экспортируем данные для использования в других модулях
export { similarPhotoDescriptions };
