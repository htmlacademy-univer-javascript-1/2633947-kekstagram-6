import { isEscapeKey } from './util.js'; // Импорт функции проверки клавиши Escape

const 	COMMENTS_BATCH_SIZE = 5; // Количество комментариев, загружаемых за один раз

const fullscreenModal = document.querySelector('.big-picture'); // Модальное окно с изображением
const fullscreenImage = fullscreenModal.querySelector('.big-picture__img img'); // Изображение в модальном окне
const likesCounter = fullscreenModal.querySelector('.likes-count'); // Счетчик лайков
const totalCommentsCounter = fullscreenModal.querySelector('.comments-count'); // Общее количество комментариев
const commentsContainer = fullscreenModal.querySelector('.social__comments'); // Контейнер для комментариев
const imageDescription = fullscreenModal.querySelector('.social__caption'); // Описание изображения
const modalCloseButton = fullscreenModal.querySelector('.big-picture__cancel'); // Кнопка закрытия модального окна
const commentsCounterElement = fullscreenModal.querySelector('.social__comment-count'); // Элемент счетчика комментариев
const commentsLoadButton = fullscreenModal.querySelector('.comments-loader'); // Кнопка загрузки дополнительных комментариев

let activeCommentsList = []; // Массив комментариев текущего изображения
let displayedCommentsCount = 0; // Количество отображенных комментариев

const 	buildCommentElement = (comment) => { // Создает DOM-элемент комментария
  const commentListItem = document.createElement('li');
  commentListItem.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  commentListItem.appendChild(img);
  commentListItem.appendChild(text);

  return commentListItem;
};

const renderCommentsBatch = () => { // Отображает порцию комментариев
  const commentsToShow = activeCommentsList.slice(displayedCommentsCount, displayedCommentsCount + 	COMMENTS_BATCH_SIZE);

  const commentsFragment = document.createDocumentFragment();
  commentsToShow.forEach((comment) => {
    commentsFragment.appendChild(	buildCommentElement(comment));
  });

  commentsContainer.appendChild(commentsFragment);

  displayedCommentsCount += commentsToShow.length;

  const displayedCountElement = commentsCounterElement.querySelector('.social__comment-shown-count');
  const totalCountElement = commentsCounterElement.querySelector('.social__comment-total-count');

  if (displayedCountElement) {
    displayedCountElement.textContent = displayedCommentsCount;
  }

  if (totalCountElement) {
    totalCountElement.textContent = activeCommentsList.length;
  }

  if (displayedCommentsCount >= activeCommentsList.length) {
    commentsLoadButton.classList.add('hidden');
  } else {
    commentsLoadButton.classList.remove('hidden');
  }
};

const onCommentsLoaderClick = () => { // Обработчик клика по кнопке загрузки комментариев
  renderCommentsBatch();
};

const resetComments = () => { // Сбрасывает состояние комментариев
  commentsContainer.innerHTML = '';
  displayedCommentsCount = 0;
  activeCommentsList = [];
  commentsLoadButton.classList.remove('hidden');
};

const expandImage = (photo) => { // Открывает модальное окно с изображением
  const { url, likes, comments, description } = photo;

  resetComments();

  fullscreenImage.src = url;
  fullscreenImage.alt = description;
  likesCounter.textContent = likes;
  totalCommentsCounter.textContent = comments.length;
  imageDescription.textContent = description;

  activeCommentsList = comments;

  const displayedCountElement = commentsCounterElement.querySelector('.social__comment-shown-count');
  const totalCountElement = commentsCounterElement.querySelector('.social__comment-total-count');

  const initialShown = Math.min(	COMMENTS_BATCH_SIZE, comments.length);

  if (displayedCountElement) {
    displayedCountElement.textContent = initialShown;
  }

  if (totalCountElement) {
    totalCountElement.textContent = comments.length;
  }

  renderCommentsBatch();

  if (comments.length <= 	COMMENTS_BATCH_SIZE) {
    commentsLoadButton.classList.add('hidden');
  } else {
    commentsLoadButton.classList.remove('hidden');
  }

  fullscreenModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeBigPicture = () => { // Закрывает модальное окно
  fullscreenModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

const onBigPictureEscKeydown = (evt) => { // Обработчик нажатия клавиши Escape
  if (isEscapeKey(evt) && !fullscreenModal.classList.contains('hidden')) {
    evt.preventDefault();
    closeBigPicture();
  }
};

modalCloseButton.addEventListener('click', () => { // Обработчик клика по кнопке закрытия
  closeBigPicture();
});

commentsLoadButton.addEventListener('click', onCommentsLoaderClick); // Назначение обработчика кнопки загрузки

document.addEventListener('keydown', onBigPictureEscKeydown); // Назначение обработчика клавиатуры

export { expandImage }; // Экспорт функции открытия изображения
