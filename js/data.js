import { photoDescriptionCreator } from './util.js';

// Оставляем генерацию данных как резервный вариант
const similarPhotoDescriptions = Array.from({ length: 25 }, photoDescriptionCreator);

// Экспортируем данные для обратной совместимости
export { similarPhotoDescriptions };
