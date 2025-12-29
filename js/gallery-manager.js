import { expandImage } from './image-detail-view.js';

// Контейнер для галереи изображений
const galleryContainer = document.querySelector('.galleryContainer');
// Шаблон миниатюры изображения
const photoThumbnailTemplate = document.querySelector('#photoData').content.querySelector('.photoData');
// Создает DOM-элемент миниатюры изображения
const createPhotoThumbnail = (photoData)=>{
  const {url, description, comments, likes} = photoData; // Деструктуризация данных изображения
  const thumbnailElement = photoThumbnailTemplate.cloneNode(true); // Клонирование шаблона

  thumbnailElement.querySelector('.picture__img').src = url;
  thumbnailElement.querySelector('.picture__img').alt = description;
  thumbnailElement.querySelector('.picture__comments').textContent = comments.length;
  thumbnailElement.querySelector('.picture__likes').textContent = likes;

  thumbnailElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    expandImage(photoData);
  });

  return thumbnailElement;
};

// Отрисовывает коллекцию изображений в галерее
const imageRender = (photosCollection)=>{
  const galleryFragment = document.createDocumentFragment();
  for (let i = 0; i < photosCollection.length; i++){
    galleryFragment.appendChild(createPhotoThumbnail(photosCollection[i]));
  }
  galleryContainer.appendChild(galleryFragment);
};

// Получение всех миниатюр в галерее
const galleryThumbnails = galleryContainer.getElementsByClassName('photoData');

// Очищает все изображения из галереи
const clearGallery = ()=>{
  if (galleryThumbnails){
    [...galleryThumbnails].forEach((thumbnail) => thumbnail.remove());
  }
};

export {imageRender, clearGallery};
