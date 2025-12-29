import { imageRender, clearPictures } from './gallery-manager.js'; // Импорт функций управления галереей
import { delayCall, randomizeArray } from './util.js'; // Импорт утилитарных функций
import { getPhotos } from './main.js'; // Импорт функции получения фотографий

const FILTER_LIMIT = 10; // Максимальное количество фотографий для случайного фильтра
const ACTIVE_BUTTON_CLASS = 'img-filters__button--active'; // CSS класс активной кнопки фильтра

const imgFilters = document.querySelector('.img-filters'); // Секция фильтров изображений
const imgFiltersForm = imgFilters.querySelector('.img-filters__form'); // Форма с кнопками фильтров

const isButton = (evt) => evt.target.tagName === 'BUTTON'; // Проверяет, является ли элемент кнопкой

const availableFilters = { // Объект с доступными фильтрами
  'filter-default': () => getPhotos(), // Фильтр по умолчанию (все фотографии)
  'filter-random': () => { // Случайный фильтр
    const allPhotos = getPhotos(); // Получение всех фотографий
    const shuffled = randomizeArray(allPhotos); // Перемешивание массива фотографий
    return shuffled.slice(0, FILTER_LIMIT); // Возврат первых N случайных фотографий
  },
  'filter-discussed': () => getPhotos().sort((firstElement, secondElement) => // Фильтр по обсуждаемости
    secondElement.comments.length - firstElement.comments.length // Сортировка по убыванию комментариев
  )
};

const onImgFilterFormClick = delayCall((evt) => { // Обработчик клика по форме фильтров с задержкой
  if (isButton(evt) && availableFilters[evt.target.id]) { // Проверка клика по кнопке с фильтром
    clearPictures(); // Очистка текущих изображений
    imageRender(availableFilters[evt.target.id]()); // Отрисовка отфильтрованных изображений
  }
});

const onButtonClick = (evt) => { // Обработчик клика для обновления активной кнопки
  if (isButton(evt) && availableFilters[evt.target.id]) { // Проверка клика по кнопке с фильтром
    const selectedButton = imgFiltersForm.querySelector(`.${ACTIVE_BUTTON_CLASS}`); // Поиск активной кнопки
    if (selectedButton) { // Если активная кнопка найдена
      selectedButton.classList.remove(ACTIVE_BUTTON_CLASS); // Снятие активного класса
    }
    evt.target.classList.add(ACTIVE_BUTTON_CLASS); // Добавление активного класса к выбранной кнопке
  }
};

imgFiltersForm.addEventListener('click', onImgFilterFormClick); // Назначение обработчика фильтрации
imgFiltersForm.addEventListener('click', onButtonClick); // Назначение обработчика обновления кнопок
