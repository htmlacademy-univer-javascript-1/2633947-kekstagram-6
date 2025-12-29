import { isEscapeKey } from './util.js';

const COMMENTS_TO_LOAD = 5;

const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const pictureCancel = bigPicture.querySelector('.big-picture__cancel');
const commentCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');

let currentComments = [];
let commentsShown = 0;

const addComment = (comment) => {
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

const renderCommentsItem = () => {
  const visibleComments = currentComments.slice(commentsShown, commentsShown + COMMENTS_TO_LOAD);

  const fragment = document.createDocumentFragment();
  visibleComments.forEach((comment) => {
    fragment.appendChild(addComment(comment));
  });

  socialComments.appendChild(fragment);

  commentsShown += visibleComments.length;

  const shownCountElement = commentCount.querySelector('.social__comment-shown-count');
  const totalCountElement = commentCount.querySelector('.social__comment-total-count');

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

const onCommentClick = () => {
  renderCommentsItem();
};

const clearComment = () => {
  socialComments.innerHTML = '';
  commentsShown = 0;
  currentComments = [];
  commentsLoader.classList.remove('hidden');
};

const openImageDetailView = (photo) => {
  const { url, likes, comments, description } = photo;

  clearComment();

  bigPictureImg.src = url;
  bigPictureImg.alt = description;
  likesCount.textContent = likes;
  commentsCount.textContent = comments.length;
  socialCaption.textContent = description;

  currentComments = comments;

  const shownCountElement = commentCount.querySelector('.social__comment-shown-count');
  const totalCountElement = commentCount.querySelector('.social__comment-total-count');

  const initialShown = Math.min(COMMENTS_TO_LOAD, comments.length);

  if (shownCountElement) {
    shownCountElement.textContent = initialShown;
  }

  if (totalCountElement) {
    totalCountElement.textContent = comments.length;
  }

  renderCommentsItem();

  if (comments.length <= COMMENTS_TO_LOAD) {
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

pictureCancel.addEventListener('click', () => {
  closeBigPicture();
});

commentsLoader.addEventListener('click', onCommentClick);

document.addEventListener('keydown', onBigPictureEscKeydown);

export { openImageDetailView };

