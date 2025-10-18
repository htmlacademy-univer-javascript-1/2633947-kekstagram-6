import {uniqueRandomSequence, getRandomInteger, randomNameGenerator, commentGenerator, photoDescriptionCreator} from "./util";
// Количество фото для генерации
const descriptionsCount = 25;
// Случайное число комментариев для генерации (от 0 до 30 включительно)
const commentsCount = getRandomInteger(0, 30);
// Генерирует массив комментариев для одного фото
function commentsArrayCreator() {
  const commentsArray = [];
  // Уникальные id для комментариев в случайном порядке
  const commentIds = uniqueRandomSequence(0, commentsCount - 1);
  // Создаём массив объектов-комментариев
  for (let i = 0; i < commentsCount; i++) {
    commentsArray.push({
      id: commentIds[i], // Уникальный id
      avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`, // Случайный аватар
      message: commentGenerator(), // Случайный комментарий
      name: randomNameGenerator() // Случайное имя
    });
  }
  return commentsArray;
}
// Генерируем массив из 25 объектов-фотографий с описаниями и комментариями
const similarPhotoDescriptions = Array.from({ length: descriptionsCount }, photoDescriptionCreator);
export {similarPhotoDescriptions};
