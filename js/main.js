
// Импортируем модули
import { generatePhotoDescriptions } from './data.js';
import { renderThumbnails } from './thumbnail-renderer.js';

// Обработка события клика по миниатюре
document.addEventListener('thumbnailClick', (event) => {
  const photoData = event.detail.photoData;
  console.log('Выбрано фото для полноэкранного просмотра:', photoData.description);

  // Открываем полноэкранный просмотр
  openBigPicture(photoData);
});

// Функция для открытия полноэкранного просмотра
function openBigPicture(photoData) {
  const bigPictureSection = document.querySelector('.big-picture');

  if (!bigPictureSection) {
    console.error('Секция полноэкранного просмотра не найдена!');
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
  socialCommentCount.innerHTML = `${Math.min(5, photoData.comments.length)} из <span class="comments-count">${photoData.comments.length}</span> комментариев`;

  // Заполняем комментарии (первые 5)
  socialComments.innerHTML = '';
  const commentsToShow = photoData.comments.slice(0, 5);

  commentsToShow.forEach(comment => {
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

    loadMoreButton.addEventListener('click', function loadMoreComments() {
      const nextComments = photoData.comments.slice(commentsShown, commentsShown + 5);

      nextComments.forEach(comment => {
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
    });

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
      // Убираем обработчик после закрытия
      cancelButton.removeEventListener('click', closeHandler);
      // Сбрасываем обработчик "Загрузить еще"
      if (loadMoreButton) {
        loadMoreButton.replaceWith(loadMoreButton.cloneNode(true));
      }
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
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Генерируем тестовые данные
  const photos = generatePhotoDescriptions();

  // Отрисовываем миниатюры
  const renderedCount = renderThumbnails(photos);

  console.log(`Отрисовано ${renderedCount} миниатюр`);

  // Добавляем обработчики фильтров
  setupFilters(photos);
});

// Функция для настройки фильтров
function setupFilters(photos) {
  const filterButtons = document.querySelectorAll('.img-filters__button');

  if (!filterButtons.length) return;

  // Показываем фильтры
  const filtersContainer = document.querySelector('.img-filters');
  if (filtersContainer) {
    filtersContainer.classList.remove('img-filters--inactive');
  }

  // Обработчики для кнопок фильтров
  document.getElementById('filter-default')?.addEventListener('click', () => {
    renderThumbnails(photos);
    updateActiveFilter('filter-default');
  });

  document.getElementById('filter-random')?.addEventListener('click', () => {
    const shuffled = [...photos].sort(() => Math.random() - 0.5).slice(0, 10);
    renderThumbnails(shuffled);
    updateActiveFilter('filter-random');
  });

  document.getElementById('filter-discussed')?.addEventListener('click', () => {
    const sorted = [...photos].sort((a, b) => b.comments.length - a.comments.length);
    renderThumbnails(sorted);
    updateActiveFilter('filter-discussed');
  });
}

// Функция для обновления активного фильтра
function updateActiveFilter(activeId) {
  document.querySelectorAll('.img-filters__button').forEach(button => {
    button.classList.remove('img-filters__button--active');
  });

  const activeButton = document.getElementById(activeId);
  if (activeButton) {
    activeButton.classList.add('img-filters__button--active');
  }
}

// Для отладки в консоли
window.debug = {
  generatePhotos: generatePhotoDescriptions,
  renderSample: () => {
    const photos = generatePhotoDescriptions();
    renderThumbnails(photos.slice(0, 3));
  },
  openFirstPhoto: () => {
    const photos = generatePhotoDescriptions();
    openBigPicture(photos[0]);
  }
};

console.log('Модуль main.js загружен');
