import { imageRender, clearPictures } from './gallery-manager.js';
import { delayCall, randomizeArray } from './util.js';
import { getPhotos } from './main.js';

const RANDOM_FILTER_LIMIT = 10; // Максимальное количество фотографий для случайного фильтра
const ACTIVE_FILTER_CLASS = 'img-filters__button--active'; // CSS класс активной кнопки фильтра

const filterSection = document.querySelector('.img-filters'); // Секция фильтров изображений
const filterForm = filterSection.querySelector('.img-filters__form'); // Форма с кнопками фильтров

const isButton = (evt) => evt.target.tagName === 'BUTTON'; // Проверяет, является ли элемент кнопкой

const filterStrategies = { // Объект с доступными фильтрами
  'filter-default': () => getPhotos(),
  'filter-random': () => {
    const allPhotos = getPhotos(); // Получение всех фотографий
    const shuffled = randomizeArray(allPhotos); // Перемешивание массива фотографий
    return shuffled.slice(0, RANDOM_FILTER_LIMIT);
  },
  'filter-discussed': () => getPhotos().sort((firstElement, secondElement) =>
    secondElement.comments.length - firstElement.comments.length
  )
};

const onImgFilterFormClick = delayCall((evt) => { // Обработчик клика по форме фильтров с задержкой
  if (isButton(evt) && filterStrategies[evt.target.id]) {
    clearPictures(); // Очистка текущих изображений
    imageRender(filterStrategies[evt.target.id]());
  }
});

const onButtonClick = (evt) => { // Обработчик клика для обновления активной кнопки
  if (isButton(evt) && filterStrategies[evt.target.id]) {
    const selectedButton = filterForm.querySelector(`.${ACTIVE_FILTER_CLASS}`); // Поиск активной кнопки
    if (selectedButton) {
      selectedButton.classList.remove(ACTIVE_FILTER_CLASS);
    }
    evt.target.classList.add(ACTIVE_FILTER_CLASS);
  }
};

filterForm.addEventListener('click', onImgFilterFormClick);
filterForm.addEventListener('click', onButtonClick);
