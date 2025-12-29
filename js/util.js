const DEBOUNCE_DELAY = 500; // Время задержки для устранения дребезга в миллисекундах

const isEscapeKey = (evt) => evt.key === 'Escape'; // Проверяет нажатие клавиши Escape

const delayCall = (callback) => { // Создает функцию с устранением дребезга
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

const randomizeArray = (array) => { // Перемешивает элементы массива в случайном порядке
  const shuffledArray = [...array];
  for (let currentIndex = shuffledArray.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[currentIndex]];
  }
  return shuffledArray;
};

export { isEscapeKey, delayCall, randomizeArray }; // Экспорт функций для использования в других модулях
