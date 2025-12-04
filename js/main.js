// main.js

// Импортируем модули
import { generatePhotoDescriptions } from './data.js';
import { renderThumbnails } from './thumbnail-renderer.js';

// Обработка события клика по миниатюре
const onThumbnailClick = (event) => {
  const photoData = event.detail.photoData;
  // Открываем полноэкранный просмотр
  openBigPicture(photoData);
};

document.addEventListener('thumbnailClick', onThumbnailClick);

// Функция для открытия полноэкранного просмотра
const openBigPicture = (photoData) => {
  const bigPictureSection = document.querySelector('.big-picture');

  if (!bigPictureSection) {
    return;
  }

  // Находим элементы
  const bigPictureImg = bigPictureSection.querySelector('.big-picture__img img');
  const socialCaption = bigPictureSection.querySelector('.social__caption');
  const likesCount = bigPictureSection.querySelector('.likes-count');
  const commentsCount = bigPictureSection.querySelector('.comments-count');
  const socialComments = bigPictureSection.querySelector('.social__comments');
  const socialCommentCount = bigPictureSection.querySelector('.social__comment-count');

  // Заполняем данные
  bigPictureImg.src = photoData.url;
  bigPictureImg.alt = photoData.description;
  socialCaption.textContent = photoData.description;
  likesCount.textContent = photoData.likes;
  commentsCount.textContent = photoData.comments.length;

  // Показываем сколько комментариев отображено
  const shownComments = Math.min(5, photoData.comments.length);
  socialCommentCount.innerHTML = `${shownComments} из <span class="comments-count">${photoData.comments.length}</span> комментариев`;

  // Заполняем комментарии (первые 5)
  socialComments.innerHTML = '';
  const commentsToShow = photoData.comments.slice(0, 5);

  commentsToShow.forEach((comment) => {
    const commentElement = document.createElement('li');
    commentElement.className = 'social__comment';
    commentElement.innerHTML = `
      <img class="social__picture" src="${comment.avatar}"
           alt="${comment.name}" width="35" height="35">
      <p class="social__text">${comment.message}</p>
    `;
    socialComments.appendChild(commentElement);
  });

  // Обработчик кнопки "Загрузить еще"
  const loadMoreButton = bigPictureSection.querySelector('.comments-loader');
  if (loadMoreButton && photoData.comments.length > 5) {
    let commentsShown = 5;

    const loadMoreComments = () => {
      const nextComments = photoData.comments.slice(commentsShown, commentsShown + 5);

      nextComments.forEach((comment) => {
        const commentElement = document.createElement('li');
        commentElement.className = 'social__comment';
        commentElement.innerHTML = `
          <img class="social__picture" src="${comment.avatar}"
               alt="${comment.name}" width="35" height="35">
          <p class="social__text">${comment.message}</p>
        `;
        socialComments.appendChild(commentElement);
      });

      commentsShown += nextComments.length;
      socialCommentCount.innerHTML = `${commentsShown} из <span class="comments-count">${photoData.comments.length}</span> комментариев`;

      if (commentsShown >= photoData.comments.length) {
        loadMoreButton.remove();
      }
    };

    loadMoreButton.addEventListener('click', loadMoreComments);
    loadMoreButton.style.display = 'block';
  } else if (loadMoreButton) {
    loadMoreButton.style.display = 'none';
  }

  // Показываем секцию
  bigPictureSection.classList.remove('hidden');

  // Закрытие по кнопке
  const cancelButton = bigPictureSection.querySelector('#picture-cancel');
  if (cancelButton) {
    const closeHandler = () => {
      bigPictureSection.classList.add('hidden');
      cancelButton.removeEventListener('click', closeHandler);
    };

    cancelButton.addEventListener('click', closeHandler);
  }

  // Закрытие по ESC
  const escKeyHandler = (evt) => {
    if (evt.key === 'Escape') {
      bigPictureSection.classList.add('hidden');
      document.removeEventListener('keydown', escKeyHandler);
    }
  };

  document.addEventListener('keydown', escKeyHandler);
};

// Инициализация при загрузке страницы
const init = () => {
  // Генерируем тестовые данные
  const photos = generatePhotoDescriptions();

  // Отрисовываем миниатюры
  renderThumbnails(photos);

  // Добавляем обработчики фильтров
  setupFilters(photos);
};

document.addEventListener('DOMContentLoaded', init);

// Функция для настройки фильтров
const setupFilters = (photos) => {
  const filterDefault = document.getElementById('filter-default');
  const filterRandom = document.getElementById('filter-random');
  const filterDiscussed = document.getElementById('filter-discussed');

  if (filterDefault) {
    filterDefault.addEventListener('click', () => {
      renderThumbnails(photos);
      updateActiveFilter('filter-default');
    });
  }

  if (filterRandom) {
    filterRandom.addEventListener('click', () => {
      const shuffled = [...photos].sort(() => Math.random() - 0.5).slice(0, 10);
      renderThumbnails(shuffled);
      updateActiveFilter('filter-random');
    });
  }

  if (filterDiscussed) {
    filterDiscussed.addEventListener('click', () => {
      const sorted = [...photos].sort((a, b) => b.comments.length - a.comments.length);
      renderThumbnails(sorted);
      updateActiveFilter('filter-discussed');
    });
  }
};

// Функция для обновления активного фильтра
const updateActiveFilter = (activeId) => {
  document.querySelectorAll('.img-filters__button').forEach((button) => {
    button.classList.remove('img-filters__button--active');
  });

  const activeButton = document.getElementById(activeId);
  if (activeButton) {
    activeButton.classList.add('img-filters__button--active');
  }
};
