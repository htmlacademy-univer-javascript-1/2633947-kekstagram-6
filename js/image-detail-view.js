import { isEscapeKey } from './util.js';

const COMMENTS_BATCH_SIZE = 5;
// Модальное окно с изображением
const fullscreenModal = document.querySelector('.big-picture');
// Изображение в модальном окне
const fullscreenImage = fullscreenModal.querySelector('.big-picture__img img');
// Счетчик лайков
const likesCounter = fullscreenModal.querySelector('.likes-count');
// Общее количество комментариев
const totalCommentsCounter = fullscreenModal.querySelector('.comments-count');
// Контейнер для комментариев
const commentsContainer = fullscreenModal.querySelector('.social__comments');
// Описание изображения
const imageDescription = fullscreenModal.querySelector('.social__caption');
// Кнопка закрытия модального окна
const modalCloseButton = fullscreenModal.querySelector('.big-picture__cancel');
// Элемент счетчика комментариев
const commentsCounterElement = fullscreenModal.querySelector('.social__comment-count');
// Кнопка загрузки дополнительных комментариев
const commentsLoadButton = fullscreenModal.querySelector('.comments-loader');

let activeCommentsList = []; // Массив комментариев текущего изображения
let displayedCommentsCount = 0;   // Количество отображенных комментариев

// Создает DOM-элемент комментария
const buildCommentElement = (commentData) => {
  const commentListItem = document.createElement('li');
  commentListItem.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = commentData.avatar;
  img.alt = commentData.name;
  img.width = 35;
  img.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = commentData.message;

  commentListItem.appendChild(img);
  commentListItem.appendChild(text);

  return commentListItem;
};

// Отображает порцию комментариев
const renderCommentsBatch = () => {
  const commentsBatch = activeCommentsList.slice(displayedCommentsCount, displayedCommentsCount + COMMENTS_BATCH_SIZE);

  const commentsFragment = document.createDocumentFragment();
  commentsBatch.forEach((commentData) => {
    commentsFragment.appendChild(buildCommentElement(commentData));
  });

  commentsContainer.appendChild(commentsFragment);

  displayedCommentsCount += commentsBatch.length;

   // Обновляем только текстовые значения, не меняя структуру
  const shownCountElement = commentsCounterElement.querySelector('.social__comment-shown-count');
  const totalCountElement = commentsCounterElement.querySelector('.social__comment-total-count');

  if (shownCountElement) {
    shownCountElement.textContent = displayedCommentsCount;
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
// Обработчик клика по кнопке загрузки комментариев
const handleCommentsLoad = () => {
  renderCommentsBatch();
};
// Сбрасывает состояние комментариев
const clearCommentsState = () => {
  commentsContainer.innerHTML = '';
  displayedCommentsCount = 0;
  activeCommentsList = [];
  commentsLoadButton.classList.remove('hidden');
};
// Открывает модальное окно с изображением
const expandImage = (selectedPhotoData) => {
  const { url, likes, comments, description } = selectedPhotoData;

  clearCommentsState();

  fullscreenImage.src = url;
  fullscreenImage.alt = description;
  likesCounter.textContent = likes;
  totalCommentsCounter.textContent = comments.length;
  imageDescription.textContent = description;

  activeCommentsList = comments;

  //Обновляем счетчики
  const shownCountElement = commentsCounterElement.querySelector('.social__comment-shown-count');
  const totalCountElement = commentsCounterElement.querySelector('.social__comment-total-count');

  const initialShown = Math.min(COMMENTS_BATCH_SIZE, comments.length);

  if (shownCountElement) {
    shownCountElement.textContent = initialShown;
  }

  if (totalCountElement) {
    totalCountElement.textContent = comments.length;
  }

  //Рендерим комментарии
  renderCommentsBatch();

  if (comments.length <= COMMENTS_BATCH_SIZE) {
    commentsLoadButton.classList.add('hidden');
  } else {
    commentsLoadButton.classList.remove('hidden');
  }

  fullscreenModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

// Закрывает модальное окно
const closeFullscreenView = () => {
  fullscreenModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

// Обработчик нажатия клавиши Escape
const handleModalEscKey = (evt) => {
  if (isEscapeKey(evt) && !fullscreenModal.classList.contains('hidden')) {
    evt.preventDefault();
    closeFullscreenView();
  }
};
// Обработчик клика по кнопке закрытия
modalCloseButton.addEventListener('click', () => {
  closeFullscreenView();
});

// Назначение обработчика кнопки загрузки
commentsLoadButton.addEventListener('click', handleCommentsLoad);

// Назначение обработчика клавиатуры
document.addEventListener('keydown', handleModalEscKey);

export { expandImage };

