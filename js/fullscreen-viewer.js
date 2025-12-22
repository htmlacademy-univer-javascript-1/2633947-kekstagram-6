const bigPicture = document.querySelector('.big-picture');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const body = document.body;

// Элементы для заполнения данными
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');

// Элементы для постраничной загрузки комментариев
const socialCommentCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const commentsShownElement = socialCommentCount.querySelector('.social__comment-shown-count');

// Константы
const COMMENTS_PER_PAGE = 5;

// Переменные для хранения текущего состояния
let currentPhotoData = null;
let commentsShown = 0;

// Функция для поиска фото по ID
function findPhotoById(photoId) {
  // Сначала пробуем использовать глобальные данные
  if (window.loadedPhotosData && window.loadedPhotosData.length > 0) {
    return window.loadedPhotosData.find((photo) => photo.id === Number(photoId));
  }

  // Если глобальных данных нет, возвращаем null
  return null;
}

// Функция для создания элемента комментария
function createCommentElement(comment) {
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
}

// Функция для обновления счетчика комментариев
function updateCommentsCounter() {
  const totalComments = currentPhotoData.comments.length;
  const commentsShownText = commentsShown > totalComments ? totalComments : commentsShown;

  // Создаем элемент для отображения количества, если его нет
  if (!commentsShownElement) {
    const span = document.createElement('span');
    span.classList.add('social__comment-shown-count');
    socialCommentCount.innerHTML = '';
    socialCommentCount.appendChild(document.createTextNode(''));
    socialCommentCount.appendChild(span);
    socialCommentCount.appendChild(document.createTextNode(` из ${totalComments} комментариев`));
  } else {
    commentsShownElement.textContent = commentsShownText;
  }
}

// Функция для отображения следующей порции комментариев
function showNextComments() {
  if (!currentPhotoData) {
    return;
  }

  const totalComments = currentPhotoData.comments.length;
  const nextComments = currentPhotoData.comments.slice(commentsShown, commentsShown + COMMENTS_PER_PAGE);

  // Создаем фрагмент для оптимизации
  const fragment = document.createDocumentFragment();

  // Добавляем следующую порцию комментариев
  nextComments.forEach((comment) => {
    fragment.appendChild(createCommentElement(comment));
  });

  socialComments.appendChild(fragment);

  // Обновляем счетчик
  commentsShown += nextComments.length;
  updateCommentsCounter();

  // Скрываем кнопку, если все комментарии показаны
  if (commentsShown >= totalComments) {
    commentsLoader.classList.add('hidden');
  }
}

// Функция для отображения комментариев (с постраничной загрузкой)
function renderComments() {
  // Очищаем текущие комментарии
  socialComments.innerHTML = '';

  // Сбрасываем счетчик
  commentsShown = 0;

  // Показываем элементы для постраничной загрузки
  socialCommentCount.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  // Отображаем первую порцию комментариев
  showNextComments();
}

// Функция для открытия полноэкранного просмотра
function openFullscreenViewer(photoId) {
  // Находим данные фотографии
  currentPhotoData = findPhotoById(photoId);

  if (!currentPhotoData) {
    return;
  }

  // Заполняем данными
  bigPictureImg.src = currentPhotoData.url;
  bigPictureImg.alt = currentPhotoData.description;
  likesCount.textContent = currentPhotoData.likes;
  commentsCount.textContent = currentPhotoData.comments.length;
  socialCaption.textContent = currentPhotoData.description;

  // Отображаем комментарии с постраничной загрузкой
  renderComments();

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

  // Сбрасываем текущие данные
  currentPhotoData = null;
  commentsShown = 0;
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

// Обработчик клика на кнопку "Загрузить еще"
function onCommentsLoaderClick() {
  showNextComments();
}

// Функция для обработки кликов на миниатюры (вынесена отдельно для лучшей читаемости)
function onThumbnailClick(evt) {
  const thumbnail = evt.target.closest('.picture');

  if (thumbnail) {
    evt.preventDefault();
    const photoId = thumbnail.dataset.photoId;

    if (photoId) {
      openFullscreenViewer(photoId);
    }
  }
}

// Инициализация модуля
function initFullscreenViewer() {
  // Добавляем обработчики событий
  closeButton.addEventListener('click', onCloseButtonClick);
  document.addEventListener('keydown', onDocumentKeydown);
  bigPicture.addEventListener('click', onOverlayClick);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);

  // Добавляем обработчик кликов на миниатюры
  const picturesContainer = document.querySelector('.pictures');
  if (picturesContainer) {
    picturesContainer.addEventListener('click', onThumbnailClick);
  } else {
    // Если контейнер еще не загружен, ждем немного и пробуем снова
    setTimeout(() => {
      const retryContainer = document.querySelector('.pictures');
      if (retryContainer) {
        retryContainer.addEventListener('click', onThumbnailClick);
      }
    }, 100);
  }
}

// Экспортируем функции
export { openFullscreenViewer, closeFullscreenViewer, initFullscreenViewer };
