// Функция для создания миниатюры на основе шаблона
function createThumbnailElement(photoData) {
  const template = document.querySelector('#picture');
  const thumbnailElement = template.content.querySelector('.picture').cloneNode(true);

  const imgElement = thumbnailElement.querySelector('.picture__img');
  imgElement.src = photoData.url;
  imgElement.alt = photoData.description;

  thumbnailElement.querySelector('.picture__likes').textContent = photoData.likes;
  thumbnailElement.querySelector('.picture__comments').textContent = photoData.comments.length;

  // Добавляем данные фотографии для полноэкранного просмотра
  thumbnailElement.dataset.photoId = photoData.id;
  thumbnailElement.href = '#';

  return thumbnailElement;
}

// Функция для отрисовки всех миниатюр
function renderThumbnails(photosData, containerSelector = '.pictures') {
  const container = document.querySelector(containerSelector);
  if (!container) {
    return;
  }

  // Очищаем существующие миниатюры (кроме элементов формы загрузки)
  const existingPictures = container.querySelectorAll('.picture');
  existingPictures.forEach((picture) => {
    picture.remove();
  });

  // Если нет данных, не рисуем ничего
  if (!photosData || photosData.length === 0) {
    return;
  }

  // Создаем DocumentFragment для оптимизации
  const fragment = document.createDocumentFragment();

  // Создаем и добавляем миниатюры
  photosData.forEach((photo) => {
    const thumbnail = createThumbnailElement(photo);
    fragment.appendChild(thumbnail);
  });

  // Вставляем все миниатюры в контейнер
  container.appendChild(fragment);
}

// Основная функция инициализации
function initThumbnails(photosData = []) {
  renderThumbnails(photosData);
}

// Экспортируем функции
export { initThumbnails };
