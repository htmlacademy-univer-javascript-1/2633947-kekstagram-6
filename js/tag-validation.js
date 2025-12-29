const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 20;
const TAG_CONTENT_PATTERN = /^[A-Za-zА-Яа-яЁё0-9]+$/;

const parseHashtags = (value) =>
  value.trim() === '' ? [] : value.trim().split(/\s+/).filter((tag) => tag !== '');

const validateSingleHashtag = (hashtag, seen) => {
  const lowerCaseTag = hashtag.toLowerCase();

  if (!hashtag.startsWith('#')) {
    return { isValid: false, error: 'Хэш-тег должен начинаться с символа #' };
  }

  if (hashtag === '#') {
    return { isValid: false, error: 'Хэш-тег не может состоять только из решётки' };
  }

  if (hashtag.length > MAX_TAG_LENGTH) {
    return { isValid: false, error: `Максимальная длина хэш-тега - ${MAX_TAG_LENGTH} символов (включая #)` };
  }

  const content = hashtag.substring(1);
  if (content.length === 0) {
    return { isValid: false, error: 'Хэш-тег не может состоять только из решётки' };
  }

  if (!TAG_CONTENT_PATTERN.test(content)) {
    return { isValid: false, error: 'Хэш-тег должен содержать только буквы и цифры' };
  }

  if (seen.has(lowerCaseTag)) {
    return { isValid: false, error: 'Хэш-теги не должны повторяться' };
  }

  seen.add(lowerCaseTag);
  return { isValid: true, error: '' };
};

const tagValidation = (value) => {
  const hashtags = parseHashtags(value);
  if (hashtags.length > MAX_TAGS) {
    return false;
  }

  const seen = new Set();
  return hashtags.every((hashtag) => validateSingleHashtag(hashtag, seen).isValid);
};

const getTagErrorMessage = (value) => {
  const hashtags = parseHashtags(value);

  if (hashtags.length > MAX_TAGS) {
    return `Не более ${MAX_TAGS} хэш-тегов`;
  }

  const seen = new Set();

  for (const hashtag of hashtags) {
    const result = validateSingleHashtag(hashtag, seen);
    if (!result.isValid) {
      return result.error;
    }
  }

  return '';
};

export { tagValidation, getTagErrorMessage };
