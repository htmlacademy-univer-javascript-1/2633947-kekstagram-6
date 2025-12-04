// thumbnail-renderer.js
import { similarPhotoDescriptions } from './data.js';

// Функция для создания миниатюры на основе шаблона
function createThumbnailElement(photoData) {
  const template = document.querySelector('#picture');
  const thumbnailElement = template.content.querySelector('.picture').cloneNode(true);

  const imgElement = thumbnailElement.querySelector('.picture__img');
  imgElement.src = photoData.url;
  imgElement.alt = photoData.description;

  thumbnailElement.querySelector('.picture__likes').textContent = photoData.likes;
  thumbnailElement.querySelector('.picture__comments').textContent = photoData.comments.length;

  // Добавляем данные фотографии в элемент для дальнейшего использования
  thumbnailElement.dataset.photoId = photoData.id;

  return thumbnailElement;
}

// Функция для отрисовки всех миниатюр
function renderThumbnails(photosData, containerSelector = '.pictures') {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error('Контейнер для миниатюр не найден');
    return;
  }

  // Очищаем существующие миниатюры (кроме элементов формы загрузки)
  const existingPictures = container.querySelectorAll('.picture');
  existingPictures.forEach(picture => picture.remove());

  // Создаем DocumentFragment для оптимизации
  const fragment = document.createDocumentFragment();

  // Создаем и добавляем миниатюры
  photosData.forEach(photo => {
    const thumbnail = createThumbnailElement(photo);
    fragment.appendChild(thumbnail);
  });

  // Вставляем все миниатюры в контейнер (перед формой загрузки)
  const uploadSection = container.querySelector('.img-upload');
  if (uploadSection) {
    container.insertBefore(fragment, uploadSection);
  } else {
    container.appendChild(fragment);
  }
}

// Основная функция инициализации
function initThumbnails() {
  try {
    renderThumbnails(similarPhotoDescriptions);
    console.log(`Отрисовано ${similarPhotoDescriptions.length} миниатюр`);
  } catch (error) {
    console.error('Ошибка при отрисовке миниатюр:', error);
  }
}

// Экспортируем функции
export { createThumbnailElement, renderThumbnails, initThumbnails };
