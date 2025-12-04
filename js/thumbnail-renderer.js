// thumbnail-renderer.js

// Функция для создания одного DOM-элемента фотографии
const createThumbnailElement = (photoData) => {
  // Находим шаблон в документе
  const template = document.querySelector('#picture');
  const thumbnailElement = template.content.cloneNode(true);

  // Находим элементы внутри шаблона
  const pictureElement = thumbnailElement.querySelector('.picture');
  const imageElement = thumbnailElement.querySelector('.picture__img');
  const likesElement = thumbnailElement.querySelector('.picture__likes');
  const commentsElement = thumbnailElement.querySelector('.picture__comments');

  // Заполняем данные
  imageElement.src = photoData.url;
  imageElement.alt = photoData.description;
  likesElement.textContent = photoData.likes;
  commentsElement.textContent = photoData.comments.length;

  // Можно добавить data-атрибуты для идентификации
  pictureElement.dataset.id = photoData.id;

  return thumbnailElement;
};

// Функция для отрисовки всех миниатюр
const renderThumbnails = (photos) => {
  const picturesContainer = document.querySelector('.pictures');

  // Очищаем контейнер (если нужно)
  picturesContainer.innerHTML = '';

  // Создаем DocumentFragment для оптимизации
  const fragment = document.createDocumentFragment();

  // Создаем и добавляем элементы миниатюр
  photos.forEach((photo) => {
    const thumbnailElement = createThumbnailElement(photo);
    fragment.appendChild(thumbnailElement);
  });

  // Вставляем все элементы за одну операцию
  picturesContainer.appendChild(fragment);
};

// Экспортируем функции
export { renderThumbnails };
