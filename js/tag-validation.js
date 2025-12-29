const MAX_HASHTAGS = 5; // Максимальное количество хештегов
const MAX_HASHTAG_LENGTH = 20; // Максимальная длина одного хештега (включая #)
const HASHTAG_CONTENT_PATTERN = /^[A-Za-zА-Яа-яЁё0-9]+$/; // Регулярное выражение для валидации содержимого хештега

const parseHashtags = (value) => // Разбивает строку на массив хештегов
  value.trim() === '' ? [] : value.trim().split(/\s+/).filter((tag) => tag !== '');

const validateSingleHashtag = (hashtag, seen) => { // Валидирует один хештег по всем правилам
  const lowerCaseTag = hashtag.toLowerCase(); // Приведение к нижнему регистру для сравнения

  if (!hashtag.startsWith('#')) { // Проверка начала хештега с символа #
    return { isValid: false, error: 'Хэш-тег должен начинаться с символа #' };
  }

  if (hashtag === '#') { // Проверка хештега, состоящего только из #
    return { isValid: false, error: 'Хэш-тег не может состоять только из решётки' };
  }

  if (hashtag.length > MAX_HASHTAG_LENGTH) { // Проверка максимальной длины
    return { isValid: false, error: `Максимальная длина хэш-тега - ${MAX_HASHTAG_LENGTH} символов (включая #)` };
  }

  const content = hashtag.substring(1); // Извлечение содержимого без символа #
  if (content.length === 0) { // Проверка наличия содержимого после #
    return { isValid: false, error: 'Хэш-тег не может состоять только из решётки' };
  }

  if (!HASHTAG_CONTENT_PATTERN.test(content)) { // Проверка допустимых символов
    return { isValid: false, error: 'Хэш-тег должен содержать только буквы и цифры' };
  }

  if (seen.has(lowerCaseTag)) { // Проверка уникальности хештега
    return { isValid: false, error: 'Хэш-теги не должны повторяться' };
  }

  seen.add(lowerCaseTag); // Добавление хештега в множество обработанных
  return { isValid: true, error: '' }; // Возврат успешного результата
};

const validateHashtagInput = (value) => { // Проверяет всю строку с хештегами
  const hashtags = parseHashtags(value); // Парсинг строки в массив хештегов
  if (hashtags.length > MAX_HASHTAGS) { // Проверка максимального количества
    return false;
  }

  const seen = new Set(); // Множество для отслеживания уникальности
  return hashtags.every((hashtag) => validateSingleHashtag(hashtag, seen).isValid); // Валидация каждого хештега
};

const getHashtagValidationError = (value) => { // Возвращает сообщение об ошибке валидации
  const hashtags = parseHashtags(value); // Парсинг строки в массив хештегов

  if (hashtags.length > MAX_HASHTAGS) { // Проверка максимального количества
    return `Не более ${MAX_HASHTAGS} хэш-тегов`;
  }

  const seen = new Set(); // Множество для отслеживания уникальности

  for (const hashtag of hashtags) { // Итерация по всем хештегам
    const result = validateSingleHashtag(hashtag, seen); // Валидация текущего хештега
    if (!result.isValid) { // Если хештег невалиден
      return result.error; // Возврат сообщения об ошибке
    }
  }

  return ''; // Возврат пустой строки при отсутствии ошибок
};

export { validateHashtagInput, getHashtagValidationError }; // Экспорт функций валидации
