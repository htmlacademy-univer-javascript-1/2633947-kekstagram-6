// Максимальное количество хештегов
const MAX_HASHTAGS_COUNT = 5;
// Максимальная длина одного хештега (включая #)
const MAX_HASHTAG_LENGTH = 20;
// Регулярное выражение для валидации содержимого хештега
const VALID_HASHTAG_CONTENT_PATTERN = /^[A-Za-zА-Яа-яЁё0-9]+$/;

// Разбивает строку на массив хештегов
const parseHashtags = (inputText) =>
  inputText.trim() === '' ? [] : inputText.trim().split(/\s+/).filter((tag) => tag !== '');

// Валидирует один хештег по всем правилам
const validateIndividualHashtag = (singleHashtag, processedHashtags) => {
  const lowercaseHashtag = singleHashtag.toLowerCase();

  if (!singleHashtag.startsWith('#')) {
    return { isValid: false, error: 'Хэш-тег должен начинаться с символа #' };
  }

  if (singleHashtag === '#') {
    return { isValid: false, error: 'Хэш-тег не может состоять только из решётки' };
  }

  if (singleHashtag.length > MAX_HASHTAG_LENGTH) {
    return { isValid: false, error: `Максимальная длина хэш-тега - ${MAX_HASHTAG_LENGTH} символов (включая #)` };
  }

  const content = singleHashtag.substring(1);
  if (content.length === 0) {
    return { isValid: false, error: 'Хэш-тег не может состоять только из решётки' };
  }

  if (!VALID_HASHTAG_CONTENT_PATTERN.test(content)) {
    return { isValid: false, error: 'Хэш-тег должен содержать только буквы и цифры' };
  }

  if (processedHashtags.has(lowercaseHashtag)) {
    return { isValid: false, error: 'Хэш-теги не должны повторяться' };
  }

  processedHashtags.add(lowercaseHashtag);
  return { isValid: true, error: '' };
};

// Проверяет всю строку с хештегами
const validateHashtagInput = (inputText) => {
  const hashtags = parseHashtags(inputText);
  if (hashtags.length > MAX_HASHTAGS_COUNT) {
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
