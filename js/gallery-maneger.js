import { openImageDetailView } from './image-detail-view.js';
const pictures = document.querySelector('.pictures');
const imageTemplate = document.querySelector('#picture').content.querySelector('.picture');

const renderPicture = (picture)=>{
  const {url, description, comments, likes} = picture;
  const imageElement = imageTemplate.cloneNode(true);

  imageElement.querySelector('.picture__img').src = url;
  imageElement.querySelector('.picture__img').alt = description;
  imageElement.querySelector('.picture__comments').textContent = comments.length;
  imageElement.querySelector('.picture__likes').textContent = likes;

  imageElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    openImageDetailView(picture);
  });

  return imageElement;
};

const imageRender = (objects)=>{
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < objects.length; i++){
    fragment.appendChild(renderPicture(objects[i]));
  }
  pictures.appendChild(fragment);
};

const photo = pictures.getElementsByClassName('picture');

const clearPictures = ()=>{
  if (photo){
    [...photo].forEach((photo) => photo.remove());
  }
};

export {imageRender, clearPictures};
