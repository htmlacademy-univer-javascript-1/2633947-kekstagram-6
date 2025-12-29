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

export { isEscapeKey, delayCall, randomizeArray };
