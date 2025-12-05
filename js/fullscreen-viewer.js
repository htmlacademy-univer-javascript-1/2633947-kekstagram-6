// fullscreen-viewer.js
import { similarPhotoDescriptions } from './data.js';

const bigPicture = document.querySelector('.big-picture');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const body = document.body;

// Элементы для заполнения данными
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');

// Вспомогательные элементы, которые нужно скрыть
const socialCommentCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');

// Функция для создания элемента комментария
function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  commentElement.innerHTML = `
    <img
      class="social__picture"
      src="${comment.avatar}"
      alt="${comment.name}"
      width="35" height="35">
    <p class="social__text">${comment.message}</p>
  `;

  return commentElement;
}

// Функция для отображения комментариев
function renderComments(comments) {
  // Очищаем текущие комментарии
  socialComments.innerHTML = '';

  // Создаем фрагмент для оптимизации
  const fragment = document.createDocumentFragment();

  // Добавляем все комментарии
  comments.forEach((comment) => {
    fragment.appendChild(createCommentElement(comment));
  });

  socialComments.appendChild(fragment);
}

// Функция для открытия полноэкранного просмотра
function openFullscreenViewer(photoId) {
  // Находим данные фотографии
  const photoData = similarPhotoDescriptions.find((photo) => photo.id === Number(photoId));

  if (!photoData) {
    return;
  }

  // Заполняем данными
  bigPictureImg.src = photoData.url;
  bigPictureImg.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;
  socialCaption.textContent = photoData.description;

  // Отображаем комментарии
  renderComments(photoData.comments);

  // Скрываем элементы для загрузки комментариев
  socialCommentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  // Показываем окно
  bigPicture.classList.remove('hidden');

  // Добавляем класс для body
  body.classList.add('modal-open');

  // Фокусируемся на кнопке закрытия для доступности
  closeButton.focus();
}

// Функция для закрытия полноэкранного просмотра
function closeFullscreenViewer() {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
}

// Обработчик закрытия по клику на крестик
function onCloseButtonClick() {
  closeFullscreenViewer();
}

// Обработчик закрытия по Escape
function onDocumentKeydown(evt) {
  if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
    evt.preventDefault();
    closeFullscreenViewer();
  }
}

// Обработчик клика по оверлею
function onOverlayClick(evt) {
  if (evt.target === bigPicture) {
    closeFullscreenViewer();
  }
}

// Инициализация модуля
function initFullscreenViewer() {
  // Добавляем обработчики событий
  closeButton.addEventListener('click', onCloseButtonClick);
  document.addEventListener('keydown', onDocumentKeydown);
  bigPicture.addEventListener('click', onOverlayClick);

  // Добавляем обработчики кликов на миниатюры
  document.querySelector('.pictures').addEventListener('click', (evt) => {
    const thumbnail = evt.target.closest('.picture');

    if (thumbnail) {
      evt.preventDefault();
      const photoId = thumbnail.dataset.photoId;
      openFullscreenViewer(photoId);
    }
  });
}

// Экспортируем функции
export { openFullscreenViewer, closeFullscreenViewer, initFullscreenViewer };
