import { expandImage } from './image-detail-view.js';

// Контейнер для галереи изображений
const galleryContainer = document.querySelector('.galleryContainer');
// Шаблон миниатюры изображения
const photoThumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');
// Создает DOM-элемент миниатюры изображения
const renderPicture = (picture)=>{
  const {url, description, comments, likes} = picture; // Деструктуризация данных изображения
  const pictureElement = photoThumbnailTemplate.cloneNode(true); // Клонирование шаблона

  pictureElement.querySelector('.picture__img').src = url;
  pictureElement.querySelector('.picture__img').alt = description;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;
  pictureElement.querySelector('.picture__likes').textContent = likes;

  pictureElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    expandImage(picture);
  });

  return pictureElement;
};

// Отрисовывает коллекцию изображений в галерее
const imageRender = (objects)=>{
  const galleryFragment = document.createDocumentFragment();
  for (let i = 0; i < objects.length; i++){
    galleryFragment.appendChild(renderPicture(objects[i]));
  }
  galleryContainer.appendChild(galleryFragment);
};

// Получение всех миниатюр в галерее
const galleryThumbnails = galleryContainer.getElementsByClassName('picture');

// Очищает все изображения из галереи
const clearPictures = ()=>{
  if (galleryThumbnails){
    [...galleryThumbnails].forEach((photo) => photo.remove());
  }
};

export {imageRender, clearPictures};
