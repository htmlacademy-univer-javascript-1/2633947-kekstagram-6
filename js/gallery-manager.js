import { openFullscreenView } from './image-detail-view.js'; // Модуль полноэкранного просмотра

// Основной контейнер для галереи фотографий
const galleryContainer = document.querySelector('.pictures');

// Шаблон для создания миниатюр фотографий (берется из template в HTML)
const photoThumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');

const createPhotoThumbnail = (photoData) => {
  // Деструктуризация данных фотографии для удобства доступа
  const { url, description, comments, likes } = photoData;

  // Клонируем шаблон для создания новой миниатюры
  const thumbnailElement = photoThumbnailTemplate.cloneNode(true);

  // Заполняем миниатюру данными
  thumbnailElement.querySelector('.picture__img').src = url;
  thumbnailElement.querySelector('.picture__img').alt = description;
  thumbnailElement.querySelector('.picture__comments').textContent = comments.length;
  thumbnailElement.querySelector('.picture__likes').textContent = likes;

  thumbnailElement.addEventListener('click', (evt) => {
    evt.preventDefault(); // Предотвращаем стандартное поведение ссылки
    openFullscreenView(photoData);
  });

  return thumbnailElement;
};

const displayPhotoGallery = (photosCollection) => {
  // Создаем документ-фрагмент для оптимизации вставки множества элементов
  const galleryFragment = document.createDocumentFragment();

  // Итерируем по коллекции и создаем миниатюры
  for (let i = 0; i < photosCollection.length; i++) {
    galleryFragment.appendChild(createPhotoThumbnail(photosCollection[i]));
  }

  galleryContainer.appendChild(galleryFragment);
};

const galleryThumbnails = galleryContainer.getElementsByClassName('picture');


const clearGallery = () => {
  // Проверяем, есть ли миниатюры для удаления
  if (galleryThumbnails.length > 0) {
    [...galleryThumbnails].forEach((thumbnail) => {
      thumbnail.remove();
    });
  }
};

// Экспорт функций для использования в других модулях
export { displayPhotoGallery, clearGallery };
