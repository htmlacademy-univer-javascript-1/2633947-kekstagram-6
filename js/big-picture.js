import { isEscapeKey } from './util.js';

const COMMENTS_PER_LOAD = 5;

const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const commentCountElement = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');

let currentComments = [];
let commentsShown = 0;

const createComment = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  commentElement.appendChild(img);
  commentElement.appendChild(text);

  return commentElement;
};

const renderComments = () => {
  const commentsToShow = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_LOAD);

  const fragment = document.createDocumentFragment();
  commentsToShow.forEach((comment) => {
    fragment.appendChild(createComment(comment));
  });

  socialComments.appendChild(fragment);

  commentsShown += commentsToShow.length;

  // Обновляем только текстовые значения, не меняя структуру
  const shownCountElement = commentCountElement.querySelector('.social__comment-shown-count');
  const totalCountElement = commentCountElement.querySelector('.social__comment-total-count');

  if (shownCountElement) {
    shownCountElement.textContent = commentsShown;
  }

  if (totalCountElement) {
    totalCountElement.textContent = currentComments.length;
  }

  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const onCommentsLoaderClick = () => {
  renderComments();
};

const resetComments = () => {
  socialComments.innerHTML = '';
  commentsShown = 0;
  currentComments = [];
  commentsLoader.classList.remove('hidden');
};

const openBigPicture = (photo) => {
  const { url, likes, comments, description } = photo;

  resetComments();

  bigPictureImg.src = url;
  bigPictureImg.alt = description;
  likesCount.textContent = likes;
  commentsCount.textContent = comments.length;
  socialCaption.textContent = description;

  currentComments = comments;

  // Сначала обновляем счетчики
  const shownCountElement = commentCountElement.querySelector('.social__comment-shown-count');
  const totalCountElement = commentCountElement.querySelector('.social__comment-total-count');

  const initialShown = Math.min(COMMENTS_PER_LOAD, comments.length);

  if (shownCountElement) {
    shownCountElement.textContent = initialShown;
  }

  if (totalCountElement) {
    totalCountElement.textContent = comments.length;
  }

  // Затем рендерим комментарии
  renderComments();

  if (comments.length <= COMMENTS_PER_LOAD) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

const onBigPictureEscKeydown = (evt) => {
  if (isEscapeKey(evt) && !bigPicture.classList.contains('hidden')) {
    evt.preventDefault();
    closeBigPicture();
  }
};

closeButton.addEventListener('click', () => {
  closeBigPicture();
});

commentsLoader.addEventListener('click', onCommentsLoaderClick);

document.addEventListener('keydown', onBigPictureEscKeydown);

export { openBigPicture };

