import { sendForm } from './api.js';
import { showSuccessMessage, showErrorMessage } from './messages.js';
import { resetEditor, loadUserPhoto } from './image-editor.js';

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
const submitButton = uploadForm.querySelector('.img-upload__submit');
const scaleControlValue = uploadForm.querySelector('.scale__control--value');
const scaleControlSmaller = uploadForm.querySelector('.scale__control--smaller');
const scaleControlBigger = uploadForm.querySelector('.scale__control--bigger');
const body = document.body;

// Инициализация Pristine
let pristine;

// Масштаб
const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
let currentScale = SCALE_MAX;

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

// Функция обновления масштаба
function updateScale() {
  if (scaleControlValue) {
    scaleControlValue.value = `${currentScale}%`;
  }

  const previewImg = document.querySelector('.img-upload__preview img');
  if (previewImg) {
    previewImg.style.transform = `scale(${currentScale / 100})`;
  }
}

// Функция уменьшения масштаба
function decreaseScale() {
  currentScale = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
  updateScale();
}

// Функция увеличения масштаба
function increaseScale() {
  currentScale = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
  updateScale();
}

// Функция сброса масштаба
function resetScale() {
  currentScale = SCALE_MAX;
  updateScale();
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

// Функция для блокировки/разблокировки кнопки отправки
function toggleSubmitButton(isDisabled) {
  submitButton.disabled = isDisabled;
  submitButton.textContent = isDisabled ? 'Отправляю...' : 'Опубликовать';
}

// Функция для открытия формы редактирования
function openUploadForm(file) {
  if (!file) {
    return; // Если файла нет, не открываем форму
  }

  try {
    // Загружаем выбранную пользователем фотографию
    if (typeof loadUserPhoto === 'function') {
      loadUserPhoto(file);
    }
  } catch (error) {
    console.error('Ошибка загрузки фото:', error);
    return;
  }

  // УБЕРИТЕ класс hidden
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);

  // Сбрасываем масштаб к 100%
  resetScale();

  // Сбрасываем эффекты к "none"
  const noneEffect = document.querySelector('#effect-none');
  if (noneEffect) {
    noneEffect.checked = true;
  }

  // Скрываем слайдер эффектов
  const effectLevel = document.querySelector('.img-upload__effect-level');
  if (effectLevel) {
    effectLevel.classList.add('hidden');
  }

  // Сбрасываем фильтр на изображении
  const previewImg = document.querySelector('.img-upload__preview img');
  if (previewImg) {
    previewImg.style.filter = 'none';
  }

  // Разблокируем кнопку отправки
  toggleSubmitButton(false);

  // Фокусируемся на поле хэштегов для удобства
  setTimeout(() => {
    hashtagInput.focus();
  }, 100);
}

// Функция для закрытия формы редактирования
function closeUploadForm() {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  // Сбрасываем форму
  uploadForm.reset();
  pristine.reset();

  // Сбрасываем редактор изображений
  if (typeof resetEditor === 'function') {
    resetEditor();
  }

  // Сбрасываем масштаб
  resetScale();

  // Сбрасываем эффекты
  const previewImg = document.querySelector('.img-upload__preview img');
  if (previewImg) {
    previewImg.style.filter = 'none';
  }

  // Сбрасываем выбор эффекта
  const noneEffect = document.querySelector('#effect-none');
  if (noneEffect) {
    noneEffect.checked = true;
  }

  // Скрываем слайдер
  const effectLevel = document.querySelector('.img-upload__effect-level');
  if (effectLevel) {
    effectLevel.classList.add('hidden');
  }

  // Особенно важно сбросить значение файлового поля
  uploadFileInput.value = '';

  // Разблокируем кнопку отправки
  toggleSubmitButton(false);
  submitButton.textContent = 'Опубликовать';
}

// Обработчик изменения файла
function onFileInputChange(evt) {
  const file = evt.target.files[0];

  if (file && file.type.startsWith('image/')) {
    // Открываем форму с выбранным файлом
    openUploadForm(file);
  } else if (file) {
    // Неподдерживаемый тип файла - сбрасываем поле
    uploadFileInput.value = '';
  }
}

// Обработчик закрытия формы
function onCancelButtonClick() {
  closeUploadForm();
}

// Обработчик отправки формы через AJAX
async function onFormSubmit(evt) {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    // Проверяем, что файл загружен
    if (!uploadFileInput.files || uploadFileInput.files.length === 0) {
      return;
    }

    // Блокируем кнопку отправки
    toggleSubmitButton(true);

    try {
      const formData = new FormData(evt.target);

      // Отправляем данные на сервер
      await sendForm(formData);

      // Показываем сообщение об успехе
      showSuccessMessage();

      // Закрываем форму и сбрасываем ее
      closeUploadForm();

    } catch (error) {
      // Показываем сообщение об ошибке
      showErrorMessage();

      // Форма остается открытой с сохраненными данными
    } finally {
      // Разблокируем кнопку отправки
      toggleSubmitButton(false);
    }
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

// Обработчики для кнопок масштаба
function onScaleSmallerClick() {
  decreaseScale();
}

function onScaleBiggerClick() {
  increaseScale();
}

// Инициализация контролов масштаба
function initScaleControls() {
  if (scaleControlSmaller) {
    scaleControlSmaller.addEventListener('click', onScaleSmallerClick);
  }

  if (scaleControlBigger) {
    scaleControlBigger.addEventListener('click', onScaleBiggerClick);
  }
}

// Инициализация модуля
function initFormValidator() {
  // Инициализируем контролы масштаба
  initScaleControls();

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

  // Инициализируем масштаб
  updateScale();
}

// Экспортируем функции
export {
  initFormValidator,
  closeUploadForm,
  validateHashtags,
  validateDescription,
  decreaseScale,
  increaseScale,
  resetScale,
  updateScale
};
