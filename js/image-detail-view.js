import { isEscapeKey } from './util.js'; // Импорт функции проверки клавиши Escape

const COMMENTS_PER_LOAD = 5; // Количество комментариев, загружаемых за один раз

const bigPicture = document.querySelector('.big-picture'); // Модальное окно с изображением
const bigPictureImg = bigPicture.querySelector('.big-picture__img img'); // Изображение в модальном окне
const likesCount = bigPicture.querySelector('.likes-count'); // Счетчик лайков
const commentsCount = bigPicture.querySelector('.comments-count'); // Общее количество комментариев
const socialComments = bigPicture.querySelector('.social__comments'); // Контейнер для комментариев
const socialCaption = bigPicture.querySelector('.social__caption'); // Описание изображения
const closeButton = bigPicture.querySelector('.big-picture__cancel'); // Кнопка закрытия модального окна
const commentCountElement = bigPicture.querySelector('.social__comment-count'); // Элемент счетчика комментариев
const commentsLoader = bigPicture.querySelector('.comments-loader'); // Кнопка загрузки дополнительных комментариев

let currentComments = []; // Массив комментариев текущего изображения
let commentsShown = 0; // Количество отображенных комментариев

const createComment = (comment) => { // Создает DOM-элемент комментария
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

const renderComments = () => { // Отображает порцию комментариев
  const commentsToShow = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_LOAD);

  const fragment = document.createDocumentFragment();
  commentsToShow.forEach((comment) => {
    fragment.appendChild(createComment(comment));
  });

  socialComments.appendChild(fragment);

  commentsShown += commentsToShow.length;

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

const onCommentsLoaderClick = () => { // Обработчик клика по кнопке загрузки комментариев
  renderComments();
};

const resetComments = () => { // Сбрасывает состояние комментариев
  socialComments.innerHTML = '';
  commentsShown = 0;
  currentComments = [];
  commentsLoader.classList.remove('hidden');
};

const expandImage = (photo) => { // Открывает модальное окно с изображением
  const { url, likes, comments, description } = photo;

  resetComments();

  bigPictureImg.src = url;
  bigPictureImg.alt = description;
  likesCount.textContent = likes;
  commentsCount.textContent = comments.length;
  socialCaption.textContent = description;

  currentComments = comments;

  const shownCountElement = commentCountElement.querySelector('.social__comment-shown-count');
  const totalCountElement = commentCountElement.querySelector('.social__comment-total-count');

  const initialShown = Math.min(COMMENTS_PER_LOAD, comments.length);

  if (shownCountElement) {
    shownCountElement.textContent = initialShown;
  }

  if (totalCountElement) {
    totalCountElement.textContent = comments.length;
  }

  renderComments();

  if (comments.length <= COMMENTS_PER_LOAD) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeBigPicture = () => { // Закрывает модальное окно
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

const onBigPictureEscKeydown = (evt) => { // Обработчик нажатия клавиши Escape
  if (isEscapeKey(evt) && !bigPicture.classList.contains('hidden')) {
    evt.preventDefault();
    closeBigPicture();
  }
};

closeButton.addEventListener('click', () => { // Обработчик клика по кнопке закрытия
  closeBigPicture();
});

commentsLoader.addEventListener('click', onCommentsLoaderClick); // Назначение обработчика кнопки загрузки

document.addEventListener('keydown', onBigPictureEscKeydown); // Назначение обработчика клавиатуры

export { expandImage }; // Экспорт функции открытия изображения
