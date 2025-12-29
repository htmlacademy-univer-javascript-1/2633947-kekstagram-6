import {imageRender, clearPictures} from './gallery-manager.js';
import {delayCall, randomizeArray} from './util.js';
import {getPhotos} from './main.js';

// Максимальное количество фотографий для случайного фильтра
const RANDOM_FILTER_LIMIT = 10;
// CSS класс активной кнопки фильтра
const ACTIVE_BUTTON_CLASS = 'img-filters__button--active';
// Секция фильтров изображений
const filterSection = document.querySelector('.img-filters');
// Форма с кнопками фильтров
const filterForm = filterSection.querySelector('.img-filters__form');
// Проверяет, является ли элемент кнопкой
const isButtonElement = (evt) => evt.target.tagName === 'BUTTON';

// Объект с доступными фильтрами
const filterStrategies = {
  'filter-default': () => getPhotos(),
  'filter-random': () => {
    const allPhotos = getPhotos();
    const shuffled = randomizeArray(allPhotos);
    return shuffled.slice(0, RANDOM_FILTER_LIMIT);
  },
  'filter-discussed': () => getPhotos().sort((firstElement, secondElement) => secondElement.comments.length - firstElement.comments.length
  )
};
 // Обработчик клика по форме фильтров с задержкой
const onImgFilterFormClick = delayCall((evt) => {
  if (isButtonElement(evt) && filterStrategies[evt.target.id]) {
    clearPictures();
    imageRender(filterStrategies[evt.target.id]());
  }
});
// Обработчик клика для обновления активной кнопки
const onButtonClick = (evt) => {
  if (isButtonElement(evt) && filterStrategies[evt.target.id]) {
    const selectedButton = filterForm.querySelector(`.${ACTIVE_BUTTON_CLASS}`);
    if (selectedButton) {
      selectedButton.classList.remove(ACTIVE_BUTTON_CLASS);
    }
    evt.target.classList.add(ACTIVE_BUTTON_CLASS);
  }
};

filterForm.addEventListener('click', onImgFilterFormClick); // Назначение обработчика фильтрации
filterForm.addEventListener('click', onButtonClick); // Назначение обработчика обновления кнопок
