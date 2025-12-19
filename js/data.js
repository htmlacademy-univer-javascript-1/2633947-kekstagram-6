import {photoDescriptionCreator} from './util.js';

// Количество фото для генерации
const descriptionsCount = 25;

// Генерируем массив из 25 объектов-фотографий с описаниями и комментариями
const similarPhotoDescriptions = Array.from({ length: descriptionsCount }, photoDescriptionCreator);

export {similarPhotoDescriptions};
