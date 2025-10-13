const id = [

]

const url = [

]

const description = [
  'описание фотографии'
]

const likes = [

]

const names = [
    'Александр',
    'Евгений',
    'Максим',
    'Андрей',
    'Илья',
    'Антон',
    'Алексей',
]

const comments = [
  //массив объектов, Количество комментариев от 0 до 30
  {id: '',/*случайное число без повторений}*/
  avatar: '',/*img/avatar-{{случайное число от 1 до 6}}.svg
  Аватарки подготовлены в директории img*/
  message: 'В целом всё неплохо. Но не всё.',
  name: this.names,
  }
]

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}


const createDate = () => {
  const randomIdIndex = getRandomInteger(1, 25);
  const randomLikesIndex = getRandomInteger(15, 200);
  const randomUrlIndex = getRandomInteger(1, 25);
  const randomNameIndex = getRandomInteger(0, names.length - 1);

  return {
    id: randomIdIndex,
    url: 'photos/' + randomUrlIndex + '.jpg',
    description: description[0],
    likes: randomLikesIndex,
    comments: {
      id: Math.random(comments.id),
      avatar: '',
      message: '',
      name: randomNameIndex,
    },
  };
};

console.log(createDate());
