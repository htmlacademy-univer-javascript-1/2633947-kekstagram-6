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
    evt.preventDefault(); // Предотвращение стандартного поведения ссылки
    expandImage(picture); // Открытие полноэкранного просмотра
  });

  return pictureElement; // Возврат созданного элемента
};

const imageRender = (objects) => { // Отрисовывает коллекцию изображений в галерее
  const fragment = document.createDocumentFragment(); // Создание фрагмента документа
  for (let i = 0; i < objects.length; i++) { // Итерация по массиву объектов
    fragment.appendChild(renderPicture(objects[i])); // Добавление миниатюры во фрагмент
  }
  pictures.appendChild(fragment); // Добавление фрагмента в контейнер галереи
};

const photos = pictures.getElementsByClassName('picture'); // Получение всех миниатюр в галерее

const clearPictures = () => { // Очищает все изображения из галереи
  if (photos) { // Проверка наличия миниатюр
    [...photos].forEach((photo) => photo.remove()); // Удаление каждой миниатюры
  }
};

export { imageRender, clearPictures }; // Экспорт функций для использования в других модулях
