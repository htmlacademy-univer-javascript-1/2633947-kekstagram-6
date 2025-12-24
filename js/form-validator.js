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
    errorTextClass: 'pristine-error' // Важно: именно pristine-error для тестов
  }, false); // Отключаем автоматическую валидацию

  // Функция для парсинга хэштегов
  function parseHashtags(value) {
    return value.trim().split(/\s+/).filter((tag) => tag !== '');
  }

  // Валидаторы для хэштегов

  // 1. Проверка формата хэштегов
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
  }, 'Неправильный формат хэш-тега', 1, false);

  // 2. Проверка количества хэштегов
  pristine.addValidator(hashtagInput, (value) => {
    if (value.trim() === '') {
      return true;
    }
    const hashtags = parseHashtags(value);
    return hashtags.length <= MAX_HASHTAGS;
  }, `Не более ${MAX_HASHTAGS} хэш-тегов`, 2, false);

  // 3. Проверка уникальности хэштегов
  pristine.addValidator(hashtagInput, (value) => {
    if (value.trim() === '') {
      return true;
    }
    const hashtags = parseHashtags(value);
    const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
    return lowerCaseHashtags.length === new Set(lowerCaseHashtags).size;
  }, 'Хэш-теги не должны повторяться', 3, false);

  // Валидатор для комментария (комментарий не обязателен)
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

  // Фокусируемся на поле хэштегов для удобства
  setTimeout(() => {
    hashtagInput.focus();
  }, 100);
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

  // Убираем классы ошибок
  const errorElements = document.querySelectorAll('.pristine-error');
  errorElements.forEach((el) => el.classList.remove('pristine-error'));

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

  // Проверяем валидность формы
  const isValid = pristine.validate();

  if (!isValid) {
    // Показываем все ошибки
    const errors = pristine.getErrors();
    console.log('Ошибки валидации:', errors);
    return;
  }

  // Проверяем, что файл загружен
  if (!uploadFileInput.files || uploadFileInput.files.length === 0) {
    console.error('Файл не загружен');
    return;
  }

  // Блокируем кнопку отправки
  toggleSubmitButton(true);

  try {
    const formData = new FormData(uploadForm);

    // Добавляем данные о масштабе и эффекте
    const scaleValue = document.querySelector('.scale__control--value').value;
    const effectValue = document.querySelector('.effect-level__value').value;
    const effectName = document.querySelector('input[name="effect"]:checked').value;

    formData.append('scale', scaleValue);
    formData.append('effect-level', effectValue);
    formData.append('effect', effectName);

    // Отправляем данные на сервер
    await sendForm(formData);

    // Показываем сообщение об успехе
    showSuccessMessage();

    // Закрываем форму (ВАЖНО: форма должна закрываться при успешной отправке)
    closeUploadForm();

  } catch (error) {
    console.error('Ошибка отправки формы:', error);

    // Показываем сообщение об ошибке
    showErrorMessage();

    // Разблокируем кнопку (ВАЖНО: форма НЕ должна закрываться при ошибке)
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

    // Проверяем, открыто ли сообщение об успехе или ошибке
    const successMessage = document.querySelector('.success');
    const errorMessage = document.querySelector('.error');

    if (successMessage || errorMessage) {
      // Если есть сообщения, даем им обработать Escape
      return;
    }

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

// Обработчики для полей ввода (валидация в реальном времени)
function onHashtagInput() {
  if (pristine) {
    // Проверяем только текущее поле
    pristine.validate(hashtagInput);
  }
}

function onDescriptionInput() {
  if (pristine) {
    // Проверяем только текущее поле
    pristine.validate(descriptionInput);
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
  hashtagInput.addEventListener('input', onHashtagInput);
  hashtagInput.addEventListener('blur', onHashtagInput);

  descriptionInput.addEventListener('keydown', onDescriptionInputKeydown);
  descriptionInput.addEventListener('input', onDescriptionInput);
  descriptionInput.addEventListener('blur', onDescriptionInput);

  // Обработчики для кнопок масштаба
  if (scaleControlSmaller) {
    scaleControlSmaller.addEventListener('click', onScaleSmallerClick);
  }

  if (scaleControlBigger) {
    scaleControlBigger.addEventListener('click', onScaleBiggerClick);
  }

  // Обработчик для клавиши Escape
  document.addEventListener('keydown', onDocumentKeydown);

  // Инициализируем масштаб по умолчанию
  resetScale();
}

// Экспортируем функции
export { initFormValidator, closeUploadForm, loadUserPhoto };
