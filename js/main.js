function uniqueRandomSequence(minValue, maxValue) {
  const numbersArray = [];
  for (let currentIndex = minValue; currentIndex <= maxValue; currentIndex++) {
    numbersArray.push(currentIndex);
  }
  for (let i = numbersArray.length - 1; i > 0; i--) {
    const randomNumberIndex = getRandomInteger(0, i);
    [numbersArray[i], numbersArray[randomNumberIndex]] = [numbersArray[randomNumberIndex], numbersArray[i]];
  }
  return numbersArray;
}

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
  const sentenceCount = Math.floor(Math.random() * 2) + 1;
  const selectedSentences = [];
  const usedSentenceIndexes = new Set();

  while (selectedSentences.length < sentenceCount && usedSentenceIndexes.size < sentencesArray.length) {
    const randomSentenceIndex = Math.floor(Math.random() * sentencesArray.length);
    if (!usedSentenceIndexes.has(randomSentenceIndex)) {
      selectedSentences.push(sentencesArray[randomSentenceIndex]);
      usedSentenceIndexes.add(randomSentenceIndex);
    }
  }
  return selectedSentences.join(' ');
}

const descriptionsCount = 25;
const commentsCount = getRandomInteger(0, 30);

function commentsArrayCreator() {
  const commentsArray = [];
  const commentIds = uniqueRandomSequence(0, commentsCount - 1);
  for (let i = 0; i < commentsCount; i++) {
    commentsArray.push({
      id: commentIds[i],
      avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
      message: commentGenerator(),
      name: randomNameGenerator()
    });
  }
  return commentsArray;
}

function photoDescriptionCreator(_, descriptionIndex) {
  return {
    id: descriptionIndex + 1,
    url: `photos/${descriptionIndex + 1}.jpg`,
    description: 'Очень прикольная фотография',
    likes: getRandomInteger(15, 200),
    comments: commentsArrayCreator()
  };
}

const similarPhotoDescriptions = Array.from({ length: descriptionsCount }, photoDescriptionCreator);
console.log(similarPhotoDescriptions);
