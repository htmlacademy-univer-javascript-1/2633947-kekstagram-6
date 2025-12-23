import { sendForm } from './api.js';
import { showSuccessMessage, showErrorMessage } from './message.js';
import { resetScale } from './scale.js';
import { resetEffects } from './effects.js';

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

function initPristine() {
  pristine = new Pristine(uploadForm, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error'
  });

  // Функция для парсинга хэштегов
  function parseHashtags(value) {
    return value.trim().split(/\s+/).filter((tag) => tag !== '');
  }

  // Валидаторы
  pristine.addValidator(hashtagInput, (value) => {
    if (value.trim() === '') {
      return true;
    }
    const hashtags = parseHashtags(value);
    return hashtags.length <= MAX_HASHTAGS;
  }, `Не более ${MAX_HASHTAGS} хэш-тегов`, 1, false);

  pristine.addValidator(hashtagInput, (value) => {
    if (value.trim() === '') {
      return true;
    }
    const hashtags = parseHashtags(value);
    for (const hashtag of hashtags) {
      if (!HASHTAG_REGEX.test(hashtag)) {
        return false;
      }
    }
    return true;
  }, 'Неправильный формат хэш-тега', 2, false);

  pristine.addValidator(hashtagInput, (value) => {
    if (value.trim() === '') {
      return true;
    }
    const hashtags = parseHashtags(value);
    const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
    return lowerCaseHashtags.length === new Set(lowerCaseHashtags).size;
  }, 'Хэш-теги не должны повторяться', 3, false);

  pristine.addValidator(descriptionInput, (value) => {
    return value.length <= MAX_DESCRIPTION_LENGTH;
  }, `Длина комментария не должна превышать ${MAX_DESCRIPTION_LENGTH} символов`, 1, false);
}

// Функция для загрузки пользовательского изображения
function loadUserPhoto(file) {
  const previewImg = document.querySelector('.img-upload__preview img');
  const effectPreviews = document.querySelectorAll('.effects__preview');

  if (!previewImg) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function(evt) {
    const result = evt.target.result;
    previewImg.src = result;

    // Обновляем превью эффектов
    effectPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${result})`;
    });
  };

  reader.readAsDataURL(file);
}

// Функция для открытия формы редактирования
function openUploadForm() {
  const file = uploadFileInput.files[0];

  if (!file || !file.type.startsWith('image/')) {
    return;
  }

  // Загружаем изображение пользователя
  loadUserPhoto(file);

  // Показываем форму
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');

  // Сбрасываем все к исходному состоянию
  resetForm();
}

// Функция для сброса формы
function resetForm() {
  // Сбрасываем валидацию
  if (pristine) {
    pristine.reset();
  }

  // Сбрасываем масштаб
  resetScale();

  // Сбрасываем эффекты
  resetEffects();

  // Сбрасываем поля
  hashtagInput.value = '';
  descriptionInput.value = '';

  // Разблокируем кнопку отправки
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
}

// Функция для закрытия формы редактирования
function closeUploadForm() {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');

  // Сбрасываем файловый input
  uploadFileInput.value = '';

  // Сбрасываем форму
  resetForm();
}

// Обработчик изменения файла
function onFileInputChange() {
  openUploadForm();
}

// Обработчик закрытия формы
function onCancelButtonClick() {
  closeUploadForm();
}

// Функция для блокировки/разблокировки кнопки отправки
function toggleSubmitButton(isDisabled) {
  submitButton.disabled = isDisabled;
  submitButton.textContent = isDisabled ? 'Отправляю...' : 'Опубликовать';
}

// Обработчик отправки формы
async function onFormSubmit(evt) {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  // Проверяем, что файл загружен
  if (!uploadFileInput.files || uploadFileInput.files.length === 0) {
    return;
  }

  // Блокируем кнопку отправки
  toggleSubmitButton(true);

  try {
    const formData = new FormData(uploadForm);

    // Отправляем данные на сервер
    await sendForm(formData);

    // Показываем сообщение об успехе
    showSuccessMessage();

    // Закрываем форму
    closeUploadForm();

  } catch (error) {
    // Показываем сообщение об ошибке
    showErrorMessage();

    // Разблокируем кнопку
    toggleSubmitButton(false);
  }
}

// Обработчик клавиши Escape
function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    // Проверяем, не находится ли фокус в полях ввода
    const isHashtagFocused = document.activeElement === hashtagInput;
    const isDescriptionFocused = document.activeElement === descriptionInput;
    const isFormOpen = !uploadOverlay.classList.contains('hidden');

    if (isFormOpen && !isHashtagFocused && !isDescriptionFocused) {
      evt.preventDefault();
      closeUploadForm();
    }
  }
}

// Обработчики для предотвращения закрытия при фокусе в полях
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
  const currentValue = parseInt(scaleControlValue.value, 10);
  const newValue = Math.max(currentValue - 25, 25);
  scaleControlValue.value = `${newValue}%`;

  // Обновляем изображение
  const previewImg = document.querySelector('.img-upload__preview img');
  if (previewImg) {
    previewImg.style.transform = `scale(${newValue / 100})`;
  }
}

function onScaleBiggerClick() {
  const currentValue = parseInt(scaleControlValue.value, 10);
  const newValue = Math.min(currentValue + 25, 100);
  scaleControlValue.value = `${newValue}%`;

  // Обновляем изображение
  const previewImg = document.querySelector('.img-upload__preview img');
  if (previewImg) {
    previewImg.style.transform = `scale(${newValue / 100})`;
  }
}

// Инициализация модуля
function initFormValidator() {
  // Инициализируем Pristine
  initPristine();

  // Добавляем обработчики событий
  uploadFileInput.addEventListener('change', onFileInputChange);
  uploadCancel.addEventListener('click', onCancelButtonClick);
  uploadForm.addEventListener('submit', onFormSubmit);

  // Обработчики для полей ввода
  hashtagInput.addEventListener('keydown', onHashtagInputKeydown);
  descriptionInput.addEventListener('keydown', onDescriptionInputKeydown);

  // Обработчики для кнопок масштаба
  if (scaleControlSmaller) {
    scaleControlSmaller.addEventListener('click', onScaleSmallerClick);
  }

  if (scaleControlBigger) {
    scaleControlBigger.addEventListener('click', onScaleBiggerClick);
  }

  // Обработчик для клавиши Escape
  document.addEventListener('keydown', onDocumentKeydown);
}

export { initFormValidator, closeUploadForm };
