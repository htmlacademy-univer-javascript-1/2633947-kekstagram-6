// Функция для генерации случайного числа
const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

// Массив имен
const NAMES = [
  'Александр', 'Евгений', 'Максим', 'Андрей', 'Илья', 'Антон', 'Алексей',
  'Мария', 'Анна', 'Елена', 'Ольга', 'Наталья', 'Светлана', 'Юлия'
];

// Массив сообщений для комментариев
const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на котел и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

// Генератор уникальных ID для комментариев
const createCommentIdGenerator = () => {
  let lastId = 0;
  return () => {
    lastId += 1;
    return lastId;
  };
};

const generateCommentId = createCommentIdGenerator();

// Функция для создания одного комментария
const createComment = () => {
  // Случайное количество предложений (1 или 2)
  const sentenceCount = getRandomInteger(1, 2);
  let message = '';

  for (let i = 0; i < sentenceCount; i++) {
    if (i > 0) message += ' ';
    message += MESSAGES[getRandomInteger(0, MESSAGES.length - 1)];
  }

  return {
    id: generateCommentId(),
    avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
    message: message,
    name: NAMES[getRandomInteger(0, NAMES.length - 1)]
  };
};

// Функция для создания массива комментариев
const createComments = () => {
  const commentsCount = getRandomInteger(0, 30);
  const comments = [];

  for (let i = 0; i < commentsCount; i++) {
    comments.push(createComment());
  }

  return comments;
};

// Функция для создания одного объекта фотографии
const createPhotoDescription = (index) => {
  const descriptions = [
    'Прекрасный закат на море',
    'Горный пейзаж ранним утром',
    'Улочки старого города',
    'Кофе и книга в уютном кафе',
    'Мой пушистый друг',
    'Осенний лес в золотых красках',
    'Ночной город с высоты',
    'Цветущий сад весной',
    'Зимняя сказка в лесу',
    'Пляж с белым песком',
    'Архитектурный шедевр',
    'Уютный домашний интерьер',
    'Вкусный ужин при свечах',
    'Спортивные достижения',
    'Творческий процесс',
    'Путешествие по неизведанным местам',
    'Момент счастья с близкими',
    'Рабочее место мечты',
    'Летнее приключение',
    'Тихое утро с чашкой чая',
    'Яркий фестиваль красок',
    'Тропический рай',
    'Историческая достопримечательность',
    'Красота дикой природы',
    'Городские огни вечером'
  ];

  return {
    id: index + 1,
    url: `photos/${index + 1}.jpg`,
    description: descriptions[index] || 'Красивая фотография',
    likes: getRandomInteger(15, 200),
    comments: createComments()
  };
};

// Функция для генерации массива из 25 фотографий
const generatePhotoDescriptions = () => {
  const photos = [];

  for (let i = 0; i < 25; i++) {
    photos.push(createPhotoDescription(i));
  }

  return photos;
};

// Экспорт функций
export { generatePhotoDescriptions, createComment };
