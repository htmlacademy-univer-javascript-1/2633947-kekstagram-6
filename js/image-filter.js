import { imageRender, clearPictures } from './gallery-manager.js';
import { delayCall, randomizeArray } from './util.js';
import { getPhotos } from './main.js';

const RANDOM_FILTER_LIMIT = 10; // Максимальное количество фотографий для случайного фильтра
const ACTIVE_FILTER_CLASS = 'img-filters__button--active'; // CSS класс активной кнопки фильтра

const filterSection = document.querySelector('.img-filters'); // Секция фильтров изображений
const filterForm = filterSection.querySelector('.img-filters__form'); // Форма с кнопками фильтров

const 	isButtonElement = (evt) => evt.target.tagName === 'BUTTON'; // Проверяет, является ли элемент кнопкой

// Объект с доступными фильтрами
const filterStrategies = {
  'filter-default': () => getPhotos(),
  'filter-random': () => {
    const fullPhotoCollection = getPhotos(); // Получение всех фотографий
    const randomizedPhotos = randomizeArray(fullPhotoCollection); // Перемешивание массива фотографий
    return randomizedPhotos.slice(0, RANDOM_FILTER_LIMIT);
  },
  'filter-discussed': () => getPhotos().sort((firstElement, secondElement) =>
    secondElement.comments.length - firstElement.comments.length
  )
};

// Обработчик клика по форме фильтров с задержкой
const handleFilterSelection = delayCall((evt) => {
  if (	isButtonElement(evt) && filterStrategies[evt.target.id]) {
    clearPictures(); // Очистка текущих изображений
    imageRender(filterStrategies[evt.target.id]());
  }
});

 // Обработчик клика для обновления активной кнопки
const updateActiveFilterButton = (evt) => {
  if (	isButtonElement(evt) && filterStrategies[evt.target.id]) {
    const activeFilterButton = filterForm.querySelector(`.${ACTIVE_FILTER_CLASS}`);
    if (activeFilterButton) { // Если активная кнопка найдена
      activeFilterButton.classList.remove(ACTIVE_FILTER_CLASS);
    }
    evt.target.classList.add(ACTIVE_FILTER_CLASS);
  }
};

filterForm.addEventListener('click', handleFilterSelection);
filterForm.addEventListener('click', updateActiveFilterButton);
