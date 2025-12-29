// Время задержки для устранения дребезга в миллисекундах
const DEBOUNCE_DELAY = 500;

const isEscapeKey = (evt) => evt.key === 'Escape';
// Создает функцию с устранением дребезга
const delayCall = (callback) => {
  let lastTimeout = null;

  return (...args) => {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(() => {
      callback(...args);
    }, DEBOUNCE_DELAY);
  };
};

// Перемешивает элементы массива в случайном порядке
const randomizeArray = (array) => {
  const shuffledArray = [...array];
  for (let currentIndex = shuffledArray.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[currentIndex]];
  }
  return shuffledArray;
};

<<<<<<< HEAD
export { isEscapeKey, delayCall, randomizeArray };
=======
// Генерация случайного имени из списка возможных имён
function randomNameGenerator() {
  const namesArray = [
    'Иван',
    'Мария',
    'Алексей',
    'Анна'
  ];
  const randomIndexName = Math.floor(Math.random() * namesArray.length);
  return namesArray[randomIndexName];
}

// Генерация "случайного" комментария из одной или двух уникальных фраз
function commentGenerator() {
  const sentencesArray = [
    'Всё отлично!',
    'В целом всё неплохо.',
    'Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра.',
    'В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают.',
    'Как можно было поймать такой неудачный момент?!'
  ];
  // Случайно решаем, будет одна или две фразы в комментарии
  const sentenceCount = Math.floor(Math.random() * 2) + 1;
  const selectedSentences = [];
  const usedSentenceIndexes = new Set();
  // Выбираем без повторений одну или две случайные фразы
  while (selectedSentences.length < sentenceCount && usedSentenceIndexes.size < sentencesArray.length) {
    const randomSentenceIndex = Math.floor(Math.random() * sentencesArray.length);
    if (!usedSentenceIndexes.has(randomSentenceIndex)) {
      selectedSentences.push(sentencesArray[randomSentenceIndex]);
      usedSentenceIndexes.add(randomSentenceIndex);
    }
  }
  // Собираем итоговый комментарий
  return selectedSentences.join(' ');
}

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

// Функция создаёт объект описания для одного фото
function photoDescriptionCreator(_, descriptionIndex) {
  return {
    id: descriptionIndex + 1, // id фото
    url: `photos/${descriptionIndex + 1}.jpg`, // url фото
    description: 'Очень прикольная фотография', // Описание (одинаковое для всех)
    likes: getRandomInteger(15, 200), // Случайное число лайков
    comments: commentsArrayCreator() // Массив комментариев для фото
  };
}

export {photoDescriptionCreator};
>>>>>>> 5b08c58b69231c934818936e0997605e6f8312c9
