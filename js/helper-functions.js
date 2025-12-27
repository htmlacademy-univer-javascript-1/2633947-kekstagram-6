//Задержка в миллисекундах для функции устранения дребезга
const DEBOUNCE_DELAY = 500;


const isEscapeKey = (event) => event.key === 'Escape';


const debounceFunction = (callback) => {
  let lastTimeout = null;

  return (...args) => {
    // Если уже есть запланированный вызов, отменяем его
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    // Устанавливаем новый таймаут
    lastTimeout = window.setTimeout(() => {
      callback(...args);
    }, DEBOUNCE_DELAY);
  };
};

//Перемешивает элементы массива в случайном порядке (алгоритм Фишера-Йетса)
const randomizeArrayOrder = (originalArray) => {
  const shuffledArray = [...originalArray];

  for (let currentIndex = shuffledArray.length - 1; currentIndex > 0; currentIndex--) {
    // Генерируем случайный индекс от 0 до currentIndex
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));

    // Меняем местами элементы currentIndex и randomIndex
    [shuffledArray[currentIndex], shuffledArray[randomIndex]] =
      [shuffledArray[randomIndex], shuffledArray[currentIndex]];
  }

  return shuffledArray;
};

// Экспорт функций для использования в других модулях
export { isEscapeKey, debounceFunction, randomizeArrayOrder };
