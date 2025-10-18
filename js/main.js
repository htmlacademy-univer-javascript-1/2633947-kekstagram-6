const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);

function generateComment() {
  let sentences = [
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
  let count = getRandomInteger(1, 2);
  let selected = [];
  let used = [];
  while (selected.length < count && used.length < sentences.length) {
    let idx = getRandomInteger(0, sentences.length - 1);
    if (used.indexOf(idx) === -1) {
      selected.push(sentences[idx]);
      used.push(idx);
    }
  }
  return selected.join(' ');
}

function generateRandomName() {
  let names = ['Иван', 'Мария', 'Алексей', 'Анна'];
  let idx = getRandomInteger(0, names.length - 1);
  return names[idx];
}

function createComment(id) {
  let comment = {};
  comment.id = id;
  let avatarNum = getRandomInteger(1, 6);
  comment.avatar = 'img/avatar-' + avatarNum + '.svg';
  comment.message = generateComment();
  comment.name = generateRandomName();
  return comment;
}

function createComments() {
  let commentsArr = [];
  let commentsCount = getRandomInteger(0, 30);
  let ids = getUniqueRandomSequence(0, 30);
  for (let i = 0; i < commentsCount; i = i + 1) {
    commentsArr.push(createComment(ids[i]));
  }
  return commentsArr;
}

function createPhotoDescription(id) {
  let photo = {};
  photo.id = id;
  photo.url = 'photos/' + id + '.jpg';
  photo.description = 'Очень прикольная фотография';
  photo.likes = getRandomInteger(15, 200);
  photo.comments = createComments();
  return photo;
}

function createAllPhotos() {
  let photoDescriptions = [];
  let photoIds = getUniqueRandomSequence(1, 25);
  for (let i = 0; i < 25; i = i + 1) {
    photoDescriptions.push(createPhotoDescription(photoIds[i]));
  }
  return photoDescriptions;
}

let allPhotos = createAllPhotos();

console.log(allPhotos);
}
