//Максимальное количество хештегов, которое можно добавить к фотографии

const MAX_HASHTAGS_COUNT = 5;

//Максимальная длина одного хештега (включая символ #)

const MAX_HASHTAG_LENGTH = 20;

//Регулярное выражение для проверки содержимого хештега
const VALID_HASHTAG_CONTENT_PATTERN = /^[A-Za-zА-Яа-яЁё0-9]+$/;

//Извлекает хештеги из строки ввода
const extractHashtagsFromText = (inputText) =>
  inputText.trim() === ''
    ? []
    : inputText.trim().split(/\s+/).filter((tag) => tag !== '');

//Валидирует один хештег по всем правилам
const validateIndividualHashtag = (singleHashtag, processedHashtags) => {
  // Приводим к нижнему регистру для регистронезависимого сравнения
  const lowercaseHashtag = singleHashtag.toLowerCase();

  // Правило 1: Хештег должен начинаться с символа #
  if (!singleHashtag.startsWith('#')) {
    return {
      isValid: false,
      error: 'Хэш-тег должен начинаться с символа #'
    };
  }

  // Правило 2: Хештег не может состоять только из #
  if (singleHashtag === '#') {
    return {
      isValid: false,
      error: 'Хэш-тег не может состоять только из решётки'
    };
  }

  // Правило 3: Проверка максимальной длины
  if (singleHashtag.length > MAX_HASHTAG_LENGTH) {
    return {
      isValid: false,
      error: `Максимальная длина хэш-тега - ${MAX_HASHTAG_LENGTH} символов (включая #)`
    };
  }

  // Извлекаем содержимое хештега (без символа #)
  const hashtagContent = singleHashtag.substring(1);

  // Правило 4: Хештег должен иметь содержимое после #
  if (hashtagContent.length === 0) {
    return {
      isValid: false,
      error: 'Хэш-тег не может состоять только из решётки'
    };
  }

  // Правило 5: Содержимое должно соответствовать допустимым символам
  if (!VALID_HASHTAG_CONTENT_PATTERN.test(hashtagContent)) {
    return {
      isValid: false,
      error: 'Хэш-тег должен содержать только буквы и цифры'
    };
  }

  // Правило 6: Хештеги не должны повторяться (регистронезависимо)
  if (processedHashtags.has(lowercaseHashtag)) {
    return {
      isValid: false,
      error: 'Хэш-теги не должны повторяться'
    };
  }

  // Добавляем хештег в множество обработанных
  processedHashtags.add(lowercaseHashtag);

  return { isValid: true, error: '' };
};

//Проверяет всю строку с хештегами на соответствие правилам

const validateHashtagInput = (inputText) => {
  const extractedHashtags = extractHashtagsFromText(inputText);

  // Проверка максимального количества хештегов
  if (extractedHashtags.length > MAX_HASHTAGS_COUNT) {
    return false;
  }

  const processedHashtags = new Set();

  // Проверяем каждый хештег индивидуально
  return extractedHashtags.every((singleHashtag) =>
    validateIndividualHashtag(singleHashtag, processedHashtags).isValid
  );
};

//Получает понятное сообщение об ошибке для строки с хештегами
const getHashtagValidationError = (inputText) => {
  const extractedHashtags = extractHashtagsFromText(inputText);

  // Проверка максимального количества
  if (extractedHashtags.length > MAX_HASHTAGS_COUNT) {
    return `Не более ${MAX_HASHTAGS_COUNT} хэш-тегов`;
  }

  const processedHashtags = new Set();

  // Проверяем каждый хештег и возвращаем первую ошибку
  for (const singleHashtag of extractedHashtags) {
    const validationResult = validateIndividualHashtag(singleHashtag, processedHashtags);
    if (!validationResult.isValid) {
      return validationResult.error;
    }
  }

  // Если ошибок не найдено, возвращаем пустую строку
  return '';
};
export { validateHashtagInput, getHashtagValidationError };
