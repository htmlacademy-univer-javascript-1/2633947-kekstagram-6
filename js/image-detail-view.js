import { isEscapeKey } from './util.js';
// Количество комментариев, загружаемых за один раз
const COMMENTS_PER_LOAD = 5;
// Модальное окно с изображением
const bigPicture = document.querySelector('.big-picture');
// Изображение в модальном окне
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
// Счетчик лайков
const likesCount = bigPicture.querySelector('.likes-count');
// Общее количество комментариев
const commentsCount = bigPicture.querySelector('.comments-count');
// Контейнер для комментариев
const socialComments = bigPicture.querySelector('.social__comments');
// Описание изображения
const socialCaption = bigPicture.querySelector('.social__caption');
// Кнопка закрытия модального окна
const closeButton = bigPicture.querySelector('.big-picture__cancel');
// Элемент счетчика комментариев
const commentCountElement = bigPicture.querySelector('.social__comment-count');
// Кнопка загрузки дополнительных комментариев
const commentsLoader = bigPicture.querySelector('.comments-loader');

let currentComments = []; // Массив комментариев текущего изображения
let commentsShown = 0;   // Количество отображенных комментариев

// Создает DOM-элемент комментария
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

// Отображает порцию комментариев
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
// Обработчик клика по кнопке загрузки комментариев
const onCommentsLoaderClick = () => {
  renderComments();
};
// Сбрасывает состояние комментариев
const resetComments = () => {
  socialComments.innerHTML = '';
  commentsShown = 0;
  currentComments = [];
  commentsLoader.classList.remove('hidden');
};
// Открывает модальное окно с изображением
const expandImage = (photo) => {
  const { url, likes, comments, description } = photo;

  resetComments();

  bigPictureImg.src = url;
  bigPictureImg.alt = description;
  likesCount.textContent = likes;
  commentsCount.textContent = comments.length;
  socialCaption.textContent = description;

  currentComments = comments;

  //Обновляем счетчики
  const shownCountElement = commentCountElement.querySelector('.social__comment-shown-count');
  const totalCountElement = commentCountElement.querySelector('.social__comment-total-count');

  const initialShown = Math.min(COMMENTS_PER_LOAD, comments.length);

  if (shownCountElement) {
    shownCountElement.textContent = initialShown;
  }

  if (totalCountElement) {
    totalCountElement.textContent = comments.length;
  }

  //Рендерим комментарии
  renderComments();

  if (comments.length <= COMMENTS_PER_LOAD) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

// Закрывает модальное окно
const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

// Обработчик нажатия клавиши Escape
const onBigPictureEscKeydown = (evt) => {
  if (isEscapeKey(evt) && !bigPicture.classList.contains('hidden')) {
    evt.preventDefault();
    closeBigPicture();
  }
};
// Обработчик клика по кнопке закрытия
closeButton.addEventListener('click', () => {
  closeBigPicture();
});

// Назначение обработчика кнопки загрузки
commentsLoader.addEventListener('click', onCommentsLoaderClick);

// Назначение обработчика клавиатуры
document.addEventListener('keydown', onBigPictureEscKeydown);

export { expandImage };

