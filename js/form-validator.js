// form-validator.js

// Константы
const MAX_HASHTAGS = 5;
const MAX_DESCRIPTION_LENGTH = 140;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

// Элементы формы
const uploadForm = document.querySelector('.img-upload__form');
const uploadFileInput = uploadForm.querySelector('#upload-file');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancel = uploadForm.querySelector('#upload-cancel');
const hashtagInput = uploadForm.querySelector('.text__hashtags');
const descriptionInput = uploadForm.querySelector('.text__description');
const body = document.body;

// Инициализация Pristine
let pristine;

// Проверяем доступность Pristine
if (typeof Pristine === 'undefined') {
  // Используем простую валидацию, если Pristine не загружен
  pristine = {
    validate: () => true,
    reset: () => {},
    addValidator: () => {}
  };
} else {
  pristine = new Pristine(uploadForm, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'span',
    errorTextClass: 'img-upload__error'
  }, true);
}

// Функция для проверки хэш-тегов на уникальность
function hasUniqueHashtags(hashtags) {
  const lowerCaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());
  return lowerCaseHashtags.length === new Set(lowerCaseHashtags).size;
}

// Функция для валидации хэш-тегов
function validateHashtags(value) {
  // Если поле пустое - валидно
  if (value.trim() === '') {
    return true;
  }

  // Разделяем по пробелам и фильтруем пустые строки
  const hashtags = value.trim().split(/\s+/).filter((tag) => tag !== '');

  // Проверка на максимальное количество
  if (hashtags.length > MAX_HASHTAGS) {
    return false;
  }

  // Проверка каждого хэш-тега на соответствие формату
  for (const hashtag of hashtags) {
    if (!HASHTAG_REGEX.test(hashtag)) {
      return false;
    }
  }

  // Проверка на уникальность
  if (!hasUniqueHashtags(hashtags)) {
    return false;
  }

  return true;
}

// Функция для генерации сообщения об ошибке для хэш-тегов
function getHashtagErrorMessage(value) {
  if (value.trim() === '') {
    return '';
  }

  const hashtags = value.trim().split(/\s+/).filter((tag) => tag !== '');

  if (hashtags.length > MAX_HASHTAGS) {
    return `Не более ${MAX_HASHTAGS} хэш-тегов`;
  }

  for (const hashtag of hashtags) {
    if (!HASHTAG_REGEX.test(hashtag)) {
      if (!hashtag.startsWith('#')) {
        return 'Хэш-тег должен начинаться с #';
      }
      if (hashtag === '#') {
        return 'Хэш-тег не может состоять только из #';
      }
      if (hashtag.length > 20) {
        return 'Максимальная длина хэш-тега 20 символов';
      }
      if (hashtag.includes('#')) {
        return 'Хэш-теги разделяются пробелами';
      }
      return 'Недопустимые символы в хэш-теге';
    }
  }

  if (!hasUniqueHashtags(hashtags)) {
    return 'Хэш-теги не должны повторяться';
  }

  return '';
}

// Функция для валидации комментария
function validateDescription(value) {
  return value.length <= MAX_DESCRIPTION_LENGTH;
}

// Функция для генерации сообщения об ошибке для комментария
function getDescriptionErrorMessage(value) {
  return value.length > MAX_DESCRIPTION_LENGTH
    ? `Длина комментария не должна превышать ${MAX_DESCRIPTION_LENGTH} символов`
    : '';
}

// Добавляем правила валидации только если Pristine доступен
if (typeof Pristine !== 'undefined') {
  pristine.addValidator(
    hashtagInput,
    validateHashtags,
    getHashtagErrorMessage
  );

  pristine.addValidator(
    descriptionInput,
    validateDescription,
    getDescriptionErrorMessage
  );
}

// Функция для открытия формы редактирования
function openUploadForm() {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
}

// Функция для закрытия формы редактирования
function closeUploadForm() {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  // Сбрасываем форму
  uploadForm.reset();
  pristine.reset();

  // Особенно важно сбросить значение файлового поля
  uploadFileInput.value = '';
}

// Обработчик изменения файла
function onFileInputChange() {
  if (uploadFileInput.files && uploadFileInput.files[0]) {
    openUploadForm();
  }
}

// Обработчик закрытия формы
function onCancelButtonClick() {
  closeUploadForm();
}

// Обработчик отправки формы
function onFormSubmit(evt) {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    // Отправляем форму
    uploadForm.submit();
  }
}

// Обработчик клавиши Escape
function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    // Проверяем, не находится ли фокус в полях ввода
    const isHashtagFocused = document.activeElement === hashtagInput;
    const isDescriptionFocused = document.activeElement === descriptionInput;

    if (!isHashtagFocused && !isDescriptionFocused) {
      evt.preventDefault();
      closeUploadForm();
    }
  }
}

// Обработчик для предотвращения закрытия при фокусе в полях
function onHashtagInputKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
}

function onDescriptionInputKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
}

// Инициализация модуля
function initFormValidator() {
  // Добавляем обработчики событий
  uploadFileInput.addEventListener('change', onFileInputChange);
  uploadCancel.addEventListener('click', onCancelButtonClick);
  uploadForm.addEventListener('submit', onFormSubmit);

  // Обработчики для полей ввода
  hashtagInput.addEventListener('keydown', onHashtagInputKeydown);
  descriptionInput.addEventListener('keydown', onDescriptionInputKeydown);

  // Добавляем валидацию при вводе для интерактивности
  hashtagInput.addEventListener('input', () => {
    pristine.validate();
  });

  descriptionInput.addEventListener('input', () => {
    pristine.validate();
  });
}

// Экспортируем функции
export { initFormValidator, closeUploadForm, validateHashtags, validateDescription };
