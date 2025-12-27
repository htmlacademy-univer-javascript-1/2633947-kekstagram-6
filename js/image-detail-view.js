
import { isEscapeKey } from './helper-functions.js';

const COMMENTS_BATCH_SIZE = 5;

// Элементы DOM модального окна полноэкранного просмотра
const fullscreenModal = document.querySelector('.big-picture');
const fullscreenImage = fullscreenModal.querySelector('.big-picture__img img');
const likesCounter = fullscreenModal.querySelector('.likes-count');
const totalCommentsCounter = fullscreenModal.querySelector('.comments-count');
const commentsContainer = fullscreenModal.querySelector('.social__comments');
const imageDescription = fullscreenModal.querySelector('.social__caption');
const modalCloseButton = fullscreenModal.querySelector('.big-picture__cancel');
const commentsCounterElement = fullscreenModal.querySelector('.social__comment-count');
const commentsLoadButton = fullscreenModal.querySelector('.comments-loader');


//Текущий список комментариев для активной фотографии
let activeCommentsList = [];

//Количество комментариев, отображенных в данный момент
let displayedCommentsCount = 0;

const buildCommentElement = (commentData) => {
  const commentListItem = document.createElement('li');
  commentListItem.classList.add('social__comment');

  const avatarImage = document.createElement('img');
  avatarImage.classList.add('social__picture');
  avatarImage.src = commentData.avatar;
  avatarImage.alt = commentData.name;
  avatarImage.width = 35;
  avatarImage.height = 35;

  const commentText = document.createElement('p');
  commentText.classList.add('social__text');
  commentText.textContent = commentData.message;

  commentListItem.appendChild(avatarImage);
  commentListItem.appendChild(commentText);

  return commentListItem;
};


const renderCommentsBatch = () => {
  const commentsBatch = activeCommentsList.slice(
    displayedCommentsCount,
    displayedCommentsCount + COMMENTS_BATCH_SIZE
  );

  // Создаем фрагмент для оптимизированной вставки
  const commentsFragment = document.createDocumentFragment();
  commentsBatch.forEach((comment) => {
    commentsFragment.appendChild(buildCommentElement(comment));
  });

  commentsContainer.appendChild(commentsFragment);

  displayedCommentsCount += commentsBatch.length;

  // Находим элементы счетчиков в DOM (уже существующие элементы)
  const displayedCountElement = commentsCounterElement.querySelector('.social__comment-shown-count');
  const totalCountElement = commentsCounterElement.querySelector('.social__comment-total-count');

  // Обновляем текстовые значения счетчиков
  if (displayedCountElement) {
    displayedCountElement.textContent = displayedCommentsCount;
  }

  if (totalCountElement) {
    totalCountElement.textContent = activeCommentsList.length;
  }

  // Скрываем кнопку загрузки, если все комментарии показаны
  if (displayedCommentsCount >= activeCommentsList.length) {
    commentsLoadButton.classList.add('hidden');
  } else {
    commentsLoadButton.classList.remove('hidden');
  }
};


const handleCommentsLoad = () => {
  renderCommentsBatch();
};


const clearCommentsState = () => {
  commentsContainer.innerHTML = '';
  displayedCommentsCount = 0;
  activeCommentsList = [];
  commentsLoadButton.classList.remove('hidden');
};


const openFullscreenView = (selectedPhotoData) => {
  // Деструктуризация данных фотографии
  const { url, likes, comments, description } = selectedPhotoData;

  clearCommentsState();

  // Устанавливаем основные данные фотографии
  fullscreenImage.src = url;
  fullscreenImage.alt = description;
  likesCounter.textContent = likes;
  totalCommentsCounter.textContent = comments.length;
  imageDescription.textContent = description;

  activeCommentsList = comments;

  // Находим элементы счетчиков в DOM
  const displayedCountElement = commentsCounterElement.querySelector('.social__comment-shown-count');
  const totalCountElement = commentsCounterElement.querySelector('.social__comment-total-count');

  const initialDisplayCount = Math.min(COMMENTS_BATCH_SIZE, comments.length);

  // Обновляем счетчики комментариев
  if (displayedCountElement) {
    displayedCountElement.textContent = initialDisplayCount;
  }

  if (totalCountElement) {
    totalCountElement.textContent = comments.length;
  }

  // Отображаем первую порцию комментариев
  renderCommentsBatch();

  // Управляем видимостью кнопки загрузки комментариев
  if (comments.length <= COMMENTS_BATCH_SIZE) {
    commentsLoadButton.classList.add('hidden');
  } else {
    commentsLoadButton.classList.remove('hidden');
  }

  fullscreenModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeFullscreenView = () => {
  fullscreenModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
};


const handleModalEscKey = (evt) => {
  if (isEscapeKey(evt) && !fullscreenModal.classList.contains('hidden')) {
    evt.preventDefault();
    closeFullscreenView();
  }
};

// Назначение обработчиков событий
modalCloseButton.addEventListener('click', () => {
  closeFullscreenView();
});

commentsLoadButton.addEventListener('click', handleCommentsLoad);

document.addEventListener('keydown', handleModalEscKey);

// Экспорт функции для использования в других модулях
export { openFullscreenView };
