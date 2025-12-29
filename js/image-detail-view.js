<<<<<<< HEAD

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

=======
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
>>>>>>> origin/master
const buildCommentElement = (commentData) => {
  const commentListItem = document.createElement('li');
  commentListItem.classList.add('social__comment');

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/master

  return commentListItem;
};

<<<<<<< HEAD

const renderCommentsBatch = () => {
  const commentsBatch = activeCommentsList.slice(
    displayedCommentsCount,
    displayedCommentsCount + COMMENTS_BATCH_SIZE
  );

  // Создаем фрагмент для оптимизированной вставки
  const commentsFragment = document.createDocumentFragment();
  commentsBatch.forEach((comment) => {
    commentsFragment.appendChild(buildCommentElement(comment));
=======
// Отображает порцию комментариев
const renderCommentsBatch = () => {
  const commentsBatch = activeCommentsList.slice(displayedCommentsCount, displayedCommentsCount + COMMENTS_BATCH_SIZE);

  const commentsFragment = document.createDocumentFragment();
  commentsBatch.forEach((commentData) => {
    commentsFragment.appendChild(buildCommentElement(commentData));
>>>>>>> origin/master
  });

  commentsContainer.appendChild(commentsFragment);

  displayedCommentsCount += commentsBatch.length;

<<<<<<< HEAD
  // Находим элементы счетчиков в DOM (уже существующие элементы)
  const displayedCountElement = commentsCounterElement.querySelector('.social__comment-shown-count');
  const totalCountElement = commentsCounterElement.querySelector('.social__comment-total-count');

  // Обновляем текстовые значения счетчиков
  if (displayedCountElement) {
    displayedCountElement.textContent = displayedCommentsCount;
=======
   // Обновляем только текстовые значения, не меняя структуру
  const shownCountElement = commentsCounterElement.querySelector('.social__comment-shown-count');
  const totalCountElement = commentsCounterElement.querySelector('.social__comment-total-count');

  if (shownCountElement) {
    shownCountElement.textContent = displayedCommentsCount;
>>>>>>> origin/master
  }

  if (totalCountElement) {
    totalCountElement.textContent = activeCommentsList.length;
  }

<<<<<<< HEAD
  // Скрываем кнопку загрузки, если все комментарии показаны
=======
>>>>>>> origin/master
  if (displayedCommentsCount >= activeCommentsList.length) {
    commentsLoadButton.classList.add('hidden');
  } else {
    commentsLoadButton.classList.remove('hidden');
  }
};
<<<<<<< HEAD


const handleCommentsLoad = () => {
  renderCommentsBatch();
};


=======
// Обработчик клика по кнопке загрузки комментариев
const handleCommentsLoad = () => {
  renderCommentsBatch();
};
// Сбрасывает состояние комментариев
>>>>>>> origin/master
const clearCommentsState = () => {
  commentsContainer.innerHTML = '';
  displayedCommentsCount = 0;
  activeCommentsList = [];
  commentsLoadButton.classList.remove('hidden');
};
<<<<<<< HEAD


const openFullscreenView = (selectedPhotoData) => {
  // Деструктуризация данных фотографии
=======
// Открывает модальное окно с изображением
const expandImage = (selectedPhotoData) => {
>>>>>>> origin/master
  const { url, likes, comments, description } = selectedPhotoData;

  clearCommentsState();

<<<<<<< HEAD
  // Устанавливаем основные данные фотографии
=======
>>>>>>> origin/master
  fullscreenImage.src = url;
  fullscreenImage.alt = description;
  likesCounter.textContent = likes;
  totalCommentsCounter.textContent = comments.length;
  imageDescription.textContent = description;

  activeCommentsList = comments;

<<<<<<< HEAD
  // Находим элементы счетчиков в DOM
  const displayedCountElement = commentsCounterElement.querySelector('.social__comment-shown-count');
  const totalCountElement = commentsCounterElement.querySelector('.social__comment-total-count');

  const initialDisplayCount = Math.min(COMMENTS_BATCH_SIZE, comments.length);

  // Обновляем счетчики комментариев
  if (displayedCountElement) {
    displayedCountElement.textContent = initialDisplayCount;
=======
  //Обновляем счетчики
  const shownCountElement = commentsCounterElement.querySelector('.social__comment-shown-count');
  const totalCountElement = commentsCounterElement.querySelector('.social__comment-total-count');

  const initialShown = Math.min(COMMENTS_BATCH_SIZE, comments.length);

  if (shownCountElement) {
    shownCountElement.textContent = initialShown;
>>>>>>> origin/master
  }

  if (totalCountElement) {
    totalCountElement.textContent = comments.length;
  }

<<<<<<< HEAD
  // Отображаем первую порцию комментариев
  renderCommentsBatch();

  // Управляем видимостью кнопки загрузки комментариев
=======
  //Рендерим комментарии
  renderCommentsBatch();

>>>>>>> origin/master
  if (comments.length <= COMMENTS_BATCH_SIZE) {
    commentsLoadButton.classList.add('hidden');
  } else {
    commentsLoadButton.classList.remove('hidden');
  }

  fullscreenModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

<<<<<<< HEAD
=======
// Закрывает модальное окно
>>>>>>> origin/master
const closeFullscreenView = () => {
  fullscreenModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

<<<<<<< HEAD

=======
// Обработчик нажатия клавиши Escape
>>>>>>> origin/master
const handleModalEscKey = (evt) => {
  if (isEscapeKey(evt) && !fullscreenModal.classList.contains('hidden')) {
    evt.preventDefault();
    closeFullscreenView();
  }
};
<<<<<<< HEAD

// Назначение обработчиков событий
=======
// Обработчик клика по кнопке закрытия
>>>>>>> origin/master
modalCloseButton.addEventListener('click', () => {
  closeFullscreenView();
});

<<<<<<< HEAD
commentsLoadButton.addEventListener('click', handleCommentsLoad);

document.addEventListener('keydown', handleModalEscKey);

// Экспорт функции для использования в других модулях
export { openFullscreenView };
=======
// Назначение обработчика кнопки загрузки
commentsLoadButton.addEventListener('click', handleCommentsLoad);

// Назначение обработчика клавиатуры
document.addEventListener('keydown', handleModalEscKey);

export { expandImage };

>>>>>>> origin/master
