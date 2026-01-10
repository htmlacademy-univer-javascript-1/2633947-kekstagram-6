import { expandImage } from './image-detail-view.js'; // Импорт функции открытия полноэкранного просмотра

const pictures = document.querySelector('.pictures'); // Контейнер для галереи изображений
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture'); // Шаблон миниатюры изображения

const renderPicture = (picture) => { // Создает DOM-элемент миниатюры изображения
  const { url, description, comments, likes } = picture; // Деструктуризация данных изображения
  const pictureElement = pictureTemplate.cloneNode(true); // Клонирование шаблона

  pictureElement.querySelector('.picture__img').src = url; // Установка URL изображения
  pictureElement.querySelector('.picture__img').alt = description; // Установка альтернативного текста
  pictureElement.querySelector('.picture__comments').textContent = comments.length; // Установка количества комментариев
  pictureElement.querySelector('.picture__likes').textContent = likes; // Установка количества лайков

  pictureElement.addEventListener('click', (evt) => { // Обработчик клика по миниатюре
    evt.preventDefault();
    expandImage(picture);
  });

  return pictureElement;
};

const imageRender = (objects) => { // Отрисовывает коллекцию изображений в галерее
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < objects.length; i++) {
    fragment.appendChild(renderPicture(objects[i]));
  }
  pictures.appendChild(fragment);
};

const photos = pictures.getElementsByClassName('picture'); // Получение всех миниатюр в галерее

const clearPictures = () => { // Очищает все изображения из галереи
  if (photos) {
    [...photos].forEach((photo) => photo.remove());
  }
};

export { imageRender, clearPictures };
