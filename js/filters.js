const RANDOM_PHOTOS_COUNT = 10;
const RENDER_DELAY = 500;

const filtersContainer = document.querySelector('.img-filters');
const filtersForm = document.querySelector('.img-filters__form');

let currentFilter = 'filter-default';
let timeoutId = null;

// Функция для получения случайных фотографий
function getRandomPhotos(photos) {
  const photosCopy = [...photos];
  const shuffledPhotos = photosCopy.sort(() => Math.random() - 0.5);
  return shuffledPhotos.slice(0, RANDOM_PHOTOS_COUNT);
}

// Функция для получения обсуждаемых фотографий
function getMostDiscussedPhotos(photos) {
  return [...photos].sort((a, b) => b.comments.length - a.comments.length);
}

// Функция для получения отфильтрованных фотографий
function getFilteredPhotos(photos, filter) {
  switch (filter) {
    case 'filter-random':
      return getRandomPhotos(photos);
    case 'filter-discussed':
      return getMostDiscussedPhotos(photos);
    default:
      return photos;
  }
}

// Функция для сброса активного фильтра
function resetActiveFilter() {
  const activeButton = filtersForm.querySelector('.img-filters__button--active');
  if (activeButton) {
    activeButton.classList.remove('img-filters__button--active');
  }
}

// Функция для установки активного фильтра
function setActiveFilter(filterButton) {
  resetActiveFilter();
  filterButton.classList.add('img-filters__button--active');
  currentFilter = filterButton.id;
}

// Функция для отрисовки отфильтрованных фотографий
function renderFilteredPhotos(photos, renderFunction) {
  const filteredPhotos = getFilteredPhotos(photos, currentFilter);
  renderFunction(filteredPhotos);
}

// Функция для обработки смены фильтра с устранением дребезга
function onFilterChange(photos, renderFunction) {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    renderFilteredPhotos(photos, renderFunction);
    timeoutId = null;
  }, RENDER_DELAY);
}

// Функция для показа блока фильтров
function showFilters() {
  filtersContainer.classList.remove('img-filters--inactive');
}

// Инициализация модуля
function initFilters(photos, renderFunction) {
  if (!photos || photos.length === 0) {
    return;
  }

  // Показываем блок фильтров
  showFilters();

  // Устанавливаем обработчики событий
  filtersForm.addEventListener('click', (evt) => {
    const target = evt.target;

    if (target.classList.contains('img-filters__button')) {
      // Если кликнули по уже активному фильтру, ничего не делаем
      if (target.id === currentFilter) {
        return;
      }

      // Устанавливаем новый активный фильтр
      setActiveFilter(target);

      // Отрисовываем отфильтрованные фотографиис debounce
      onFilterChange(photos, renderFunction);
    }
  });
}

export { initFilters, showFilters };
