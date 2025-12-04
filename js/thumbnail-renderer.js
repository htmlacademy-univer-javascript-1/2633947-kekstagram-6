const createThumbnailElement = (photoData) => {
  const template = document.querySelector('#picture');

  if (!template) {
    console.error('Шаблон #picture не найден!');
    return document.createDocumentFragment();
  }

  const thumbnailElement = template.content.cloneNode(true);
  const pictureLink = thumbnailElement.querySelector('.picture');
  const imageElement = thumbnailElement.querySelector('.picture__img');
  const likesElement = thumbnailElement.querySelector('.picture__likes');
  const commentsElement = thumbnailElement.querySelector('.picture__comments');

  // Заполняем данные
  imageElement.src = photoData.url;
  imageElement.alt = photoData.description;
  likesElement.textContent = photoData.likes;
  commentsElement.textContent = photoData.comments.length;

  // Добавляем data-атрибут для идентификации
  pictureLink.dataset.id = photoData.id;

  // Обработчик клика
  pictureLink.addEventListener('click', (evt) => {
    evt.preventDefault();

    const event = new CustomEvent('thumbnailClick', {
      detail: { photoData },
      bubbles: true
    });

    pictureLink.dispatchEvent(event);
  });

  return thumbnailElement;
};

const renderThumbnails = (photos) => {
  const picturesContainer = document.querySelector('.pictures');

  if (!picturesContainer) {
    console.error('Контейнер .pictures не найден!');
    return 0;
  }

  // Находим или создаем контейнер для миниатюр
  let thumbnailsContainer = picturesContainer.querySelector('.thumbnails-container');

  if (!thumbnailsContainer) {
    thumbnailsContainer = document.createElement('div');
    thumbnailsContainer.className = 'thumbnails-container';

    // Вставляем после img-upload
    const imgUploadSection = picturesContainer.querySelector('.img-upload');
    if (imgUploadSection) {
      imgUploadSection.insertAdjacentElement('afterend', thumbnailsContainer);
    } else {
      picturesContainer.appendChild(thumbnailsContainer);
    }
  }

  // Очищаем контейнер
  thumbnailsContainer.innerHTML = '';

  // Создаем DocumentFragment
  const fragment = document.createDocumentFragment();

  // Добавляем миниатюры
  photos.forEach((photo) => {
    fragment.appendChild(createThumbnailElement(photo));
  });

  // Вставляем все сразу
  thumbnailsContainer.appendChild(fragment);

  return photos.length;
};

export { renderThumbnails };
