// thumbnail-renderer.js

// Функция для создания одного DOM-элемента фотографии
const createThumbnailElement = (photoData) => {
  // Находим шаблон в документе
  const template = document.querySelector('#picture');
  const thumbnailElement = template.content.cloneNode(true);

  // Находим элементы внутри шаблона
  const pictureLink = thumbnailElement.querySelector('.picture');
  const imageElement = thumbnailElement.querySelector('.picture__img');
  const likesElement = thumbnailElement.querySelector('.picture__likes');
  const commentsElement = thumbnailElement.querySelector('.picture__comments');

  // Заполняем данные
  imageElement.src = photoData.url;
  imageElement.alt = photoData.description;
  likesElement.textContent = photoData.likes;
  commentsElement.textContent = photoData.comments.length;

  // Можно добавить data-атрибуты для идентификации
  pictureLink.dataset.id = photoData.id;

  // Добавляем обработчик клика
  pictureLink.addEventListener('click', (evt) => {
    evt.preventDefault();
    // Здесь можно вызвать функцию открытия полноразмерного фото
    console.log('Открываем фото ID:', photoData.id);

    // Генерируем событие для открытия полноэкранного просмотра
    const event = new CustomEvent('thumbnailClick', {
      detail: { photoData }
    });
    document.dispatchEvent(event);
  });

  return thumbnailElement;
};

// Функция для отрисовки всех миниатюр
const renderThumbnails = (photos) => {
  // Находим контейнер для миниатюр
  // В вашем HTML это <section class="pictures container">
  const picturesContainer = document.querySelector('.pictures');

  if (!picturesContainer) {
    console.error('Контейнер .pictures не найден!');
    return 0;
  }

  // Находим место для вставки - после img-upload, перед комментарием
  const imgUploadSection = picturesContainer.querySelector('.img-upload');
  const commentNode = Array.from(picturesContainer.childNodes)
    .find(node => node.nodeType === Node.COMMENT_NODE &&
                  node.textContent.includes('Здесь будут изображения'));

  // Создаем контейнер для миниатюр
  let thumbnailsContainer = picturesContainer.querySelector('.thumbnails-container');

  if (!thumbnailsContainer) {
    thumbnailsContainer = document.createElement('div');
    thumbnailsContainer.className = 'thumbnails-container';

    // Вставляем контейнер в нужное место
    if (commentNode) {
      picturesContainer.insertBefore(thumbnailsContainer, commentNode);
    } else if (imgUploadSection) {
      imgUploadSection.insertAdjacentElement('afterend', thumbnailsContainer);
    } else {
      picturesContainer.appendChild(thumbnailsContainer);
    }
  }

  // Очищаем контейнер (если нужно)
  thumbnailsContainer.innerHTML = '';

  // Создаем DocumentFragment для оптимизации
  const fragment = document.createDocumentFragment();

  // Создаем и добавляем элементы миниатюр
  photos.forEach((photo) => {
    const thumbnailElement = createThumbnailElement(photo);
    fragment.appendChild(thumbnailElement);
  });

  // Вставляем все элементы за одну операцию
  thumbnailsContainer.appendChild(fragment);

  return photos.length;
};

// Экспортируем функции
export { renderThumbnails };
