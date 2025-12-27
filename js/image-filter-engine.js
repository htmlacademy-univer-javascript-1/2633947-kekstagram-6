import { displayPhotoGallery, clearGallery } from './gallery-manager.js';
import { debounceFunction, randomizeArrayOrder } from './helper-functions.js';
import { getPhotoCollection } from './main.js';


const RANDOM_FILTER_LIMIT = 10;


const ACTIVE_FILTER_CLASS = 'img-filters__button--active';

// Элементы DOM для фильтрации
const filterSection = document.querySelector('.img-filters');
const filterForm = filterSection.querySelector('.img-filters__form');


//Проверяет, является ли целевой элемент события кнопкой

const isButtonElement = (event) => event.target.tagName === 'BUTTON';

//Объект стратегий фильтрации
const filterStrategies = {
  //Стратегия "По умолчанию" - возвращает оригинальную коллекцию без изменений
  'filter-default': () => getPhotoCollection(),

  // Стратегия "Случайные" - возвращает случайные фотографии с ограничением количества
  'filter-random': () => {
    const fullPhotoCollection = getPhotoCollection();
    const randomizedPhotos = randomizeArrayOrder(fullPhotoCollection);
    return randomizedPhotos.slice(0, RANDOM_FILTER_LIMIT);
  },

  // Стратегия "Обсуждаемые" - сортирует фотографии по количеству комментариев (убывание)
  'filter-discussed': () => getPhotoCollection().sort(
    (firstPhoto, secondPhoto) => secondPhoto.comments.length - firstPhoto.comments.length
  )
};

/**
 * Обработчик выбора фильтра с устранением дребезга
 * При выборе фильтра очищает галерею и отображает отфильтрованные фотографии
 */
const handleFilterSelection = debounceFunction((event) => {
  // Проверяем, что клик был по кнопке и для неё существует стратегия фильтрации
  if (isButtonElement(event) && filterStrategies[event.target.id]) {
    clearGallery();

    displayPhotoGallery(filterStrategies[event.target.id]());
  }
});

/**
 * Обновляет визуальное состояние кнопок фильтров
 * Убирает активный класс с предыдущей кнопки и добавляет на выбранную
 */
const updateActiveFilterButton = (event) => {
  if (isButtonElement(event) && filterStrategies[event.target.id]) {
    // Находим текущую активную кнопку
    const activeFilterButton = filterForm.querySelector(`.${ACTIVE_FILTER_CLASS}`);

    // Если активная кнопка существует, снимаем с неё активный класс
    if (activeFilterButton) {
      activeFilterButton.classList.remove(ACTIVE_FILTER_CLASS);
    }

    // Добавляем активный класс на выбранную кнопку
    event.target.classList.add(ACTIVE_FILTER_CLASS);
  }
};

/**
 * Инициализация обработчиков событий для системы фильтрации
 * Назначает обработчики кликов на форму фильтров
 */
filterForm.addEventListener('click', handleFilterSelection);
filterForm.addEventListener('click', updateActiveFilterButton);
