import {getRandomInteger, photoDescriptionCreator} from './util';
// Количество фото для генерации
const descriptionsCount = 25;
// Случайное число комментариев для генерации (от 0 до 30 включительно)
const commentsCount = getRandomInteger(0, 30);

// Генерируем массив из 25 объектов-фотографий с описаниями и комментариями
const similarPhotoDescriptions = Array.from({ length: descriptionsCount }, photoDescriptionCreator);
export {similarPhotoDescriptions};
