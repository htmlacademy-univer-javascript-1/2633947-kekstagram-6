import { openBigPicture } from './big-picture.js';
const pictures = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

const renderPicture = (picture)=>{
  const {url, description, comments, likes} = picture;
  const pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = url;
  pictureElement.querySelector('.picture__img').alt = description;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;
  pictureElement.querySelector('.picture__likes').textContent = likes;

  pictureElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    openBigPicture(picture);
  });

  return pictureElement;
};

const renderPictures = (objects)=>{
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < objects.length; i++){
    fragment.appendChild(renderPicture(objects[i]));
  }
  pictures.appendChild(fragment);
};

const photos = pictures.getElementsByClassName('picture');

const removePictures = ()=>{
  if (photos){
    [...photos].forEach((photo) => photo.remove());
  }
};

export {renderPictures, removePictures};
