import { renderPictures, removePictures } from './pictures.js';
import {delayCall, shuffleArray} from './util.js';
import {getPhotos} from './main.js';

const FILTER_LIMIT = 10;
const ACTIVE_BUTTON_CLASS = 'img-filters__button--active';

const imgFilters = document.querySelector('.img-filters');
const imgFiltersForm = imgFilters.querySelector('.img-filters__form');

const isButton = (evt) => evt.target.tagName === 'BUTTON';

const availableFilters = {
  'filter-default': () => getPhotos(),
  'filter-random': () => {
    const allPhotos = getPhotos();
    const shuffled = shuffleArray(allPhotos);
    return shuffled.slice(0, FILTER_LIMIT);
  },
  'filter-discussed': () => getPhotos().sort((firstElement, secondElement) => secondElement.comments.length - firstElement.comments.length
  )
};

const onImgFilterFormClick = delayCall((evt) => {
  if (isButton(evt) && availableFilters[evt.target.id]) {
    removePictures();
    renderPictures(availableFilters[evt.target.id]());
  }
});

const onButtonClick = (evt) => {
  if (isButton(evt) && availableFilters[evt.target.id]) {
    const selectedButton = imgFiltersForm.querySelector(`.${ACTIVE_BUTTON_CLASS}`);
    if (selectedButton) {
      selectedButton.classList.remove(ACTIVE_BUTTON_CLASS);
    }
    evt.target.classList.add(ACTIVE_BUTTON_CLASS);
  }
};

imgFiltersForm.addEventListener('click', onImgFilterFormClick);
imgFiltersForm.addEventListener('click', onButtonClick);
