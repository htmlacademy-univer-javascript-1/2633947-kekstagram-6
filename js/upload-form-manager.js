import { validateHashtagInput, getHashtagValidationError } from './tag-validation.js';
import { isEscapeKey } from './util.js';
import { initializeImageEditor, resetImageEditorSettings } from './image-editor.js';
import { submitPhotoData } from './api.js';
import { displaySelectedImage, clearPreview } from './image-preview-generator.js';

// Максимальная длина комментария в символах
const MAX_COMMENT_LENGTH = 140;

// Форма загрузки изображения
const uploadForm = document.querySelector('.img-upload__form');
// Поле выбора файла
const imageFileInput = document.querySelector('.img-upload__input');
 // Оверлей формы
const uploadOverlay = document.querySelector('.img-upload__overlay');
// Кнопка отмены
const cancelUploadButton = document.querySelector('.img-upload__cancel');
// Поле ввода хештегов
const hashtagField = document.querySelector('.text__hashtags');
// Поле ввода комментария
const commentField = document.querySelector('.text__description');
// Элемент documentBody документа
const documentBody = document.documentBody;
// Кнопка отправки формы
const formSubmitButton = document.querySelector('.img-upload__submit');

// Текущая ошибка валидации хештегов
let hashtagValidationError = '';
// Текущая ошибка валидации комментария
let commentValidationError = '';

// Проверяет длину комментария
const validateCommentLength = (value) => value.length <= MAX_COMMENT_LENGTH;

// Обновляет интерфейс отображения ошибок
const updateValidationUI = () => {
  const hashtagContainer = hashtagField.closest('.img-upload__field-wrapper'); // Контейнер поля хештегов
  if (hashtagContainer) {
    hashtagContainer.classList.toggle('img-upload__field-wrapper--error', !!hashtagValidationError);

    let errorElement = hashtagContainer.querySelector('.pristine-error');

    if (hashtagValidationError) {
      errorElement = errorElement || document.createElement('div');
      if (!hashtagContainer.querySelector('.pristine-error')) {
        errorElement.className = 'pristine-error';
        hashtagContainer.appendChild(errorElement);
      }
      errorElement.textContent = hashtagValidationError;
    } else if (errorElement) {
      errorElement.remove();
    }
  }

  // Контейнер поля комментария
  const commentContainer = commentField.closest('.img-upload__field-wrapper');
  if (commentContainer) {
    commentContainer.classList.toggle('img-upload__field-wrapper--error', !!commentValidationError);

    let errorElement = commentContainer.querySelector('.pristine-error');

    if (commentValidationError) {
      errorElement = errorElement || document.createElement('div');
      if (!commentContainer.querySelector('.pristine-error')) {
        errorElement.className = 'pristine-error';
        commentContainer.appendChild(errorElement);
      }
      errorElement.textContent = commentValidationError;
    } else if (errorElement) {
      errorElement.remove();
    }
  }
};
// Обновляет состояние кнопки отправки
const updateFormSubmitButton = () => {
  const isValid = !hashtagValidationError && !commentValidationError;
  formSubmitButton.disabled = !isValid;
  formSubmitButton.textContent = 'Опубликовать';
};
// Валидирует всю форму
const validateUploadForm = () => {
  const hashtagValue = hashtagField.value;
  hashtagValidationError = validateHashtagInput(hashtagValue) ? '' : getHashtagValidationError(hashtagValue);

  // Получение значения комментария
  const commentValue = commentField.value;
  commentValidationError = validateCommentLength(commentValue) ? '' : `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`;
  updateValidationUI();
  updateFormSubmitButton();
};

// Блокирует кнопку отправки
const disableFormSubmission = () => {
  formSubmitButton.disabled = true;
  formSubmitButton.textContent = 'Отправляется...';
};

// Разблокирует кнопку отправки
const enableFormSubmission = () => {
  updateFormSubmitButton();
};

// Сбрасывает форму загрузки
const resetUploadForm = () => {
  uploadForm.reset();
  resetImageEditorSettings();

  hashtagField.disabled = false;
  commentField.disabled = false;

  enableFormSubmission();
  clearPreview();

  hashtagValidationError = '';
  commentValidationError = '';
  updateValidationUI();
  updateFormSubmitButton();
};

// Закрывает модальное окно загрузки
function closeImageUploadModal() {
  uploadOverlay.classList.add('hidden');
  documentBody.classList.remove('modal-open');
  document.removeEventListener('keydown', handleModalKeydown);
  resetUploadForm();
}

// Открывает модальное окно загрузки
function openImageUploadModal	() {
  enableFormSubmission();

  uploadOverlay.classList.remove('hidden');
  documentBody.classList.add('modal-open');
  document.addEventListener('keydown', handleModalKeydown);

  initializeImageEditor();
  updateFormSubmitButton();
}

// Обработчик нажатия клавиш
function handleModalKeydown(evt) {
  if (isEscapeKey(evt)) {
    if (document.activeElement === hashtagField || document.activeElement === commentField) {
      return;
    }
    evt.preventDefault();
    closeImageUploadModal();
  }
}

// Обработчик изменения поля выбора файла
const handleImageFileSelect = () => {
  const file = imageFileInput.files[0];
  if (!file) {
    return;
  }

  if (displaySelectedImage(file)) {
    openImageUploadModal	();
  } else {
    imageFileInput.value = '';
  }
};

// Показывает сообщение об успешной отправке
function displaySuccessNotification() {
  const template = document.querySelector('#success').content.cloneNode(true);
  const message = template.querySelector('.success');
  message.style.zIndex = '10000';
  document.documentBody.appendChild(message);

  // Закрывает сообщение об успехе
  function closeSuccessMessage() {
    message.remove();
    document.removeEventListener('keydown', onSuccessMessageEscKeydown);
    // Возвращаем обработчик ESC для формы
    document.addEventListener('keydown', handleModalKeydown);
  }

  // Обработчик Escape для сообщения
  function onSuccessMessageEscKeydown(evt) {
    if (isEscapeKey(evt)) {
      closeSuccessMessage();
    }
  }

  message.addEventListener('click', (evt) => {
    if (!evt.target.closest('.success__inner')) {
      closeSuccessMessage();
    }
  });

  message.querySelector('.success__button').addEventListener('click', closeSuccessMessage);
  document.removeEventListener('keydown', handleModalKeydown);
  document.addEventListener('keydown', onSuccessMessageEscKeydown);
}

// Показывает сообщение об ошибке отправки
function showErrorMessage() {
  const template = document.querySelector('#error').content.cloneNode(true);
  const message = template.querySelector('.error');
  message.style.zIndex = '10000';
  document.documentBody.appendChild(message);

  // Закрывает сообщение об ошибке
  function closeErrorMessage() {
    message.remove();
    document.removeEventListener('keydown', onErrorMessageEscKeydown);
    // Возвращаем обработчик ESC для формы
    document.addEventListener('keydown', handleModalKeydown);
  }

  // Обработчик Escape для сообщения
  function onErrorMessageEscKeydown(evt) {
    if (isEscapeKey(evt)) {
      closeErrorMessage();
    }
  }

  message.addEventListener('click', (evt) => {
    if (!evt.target.closest('.error__inner')) {
      closeErrorMessage();
    }
  });

  message.querySelector('.error__button').addEventListener('click', closeErrorMessage);
  document.removeEventListener('keydown', handleModalKeydown);
  document.addEventListener('keydown', onErrorMessageEscKeydown);
}

// Обработчик успешной отправки формы
const onFormSubmitSuccess = () => {
  closeImageUploadModal();
  displaySuccessNotification();
};
// Обработчик ошибки отправки формы
const onFormSubmitError = () => {
  enableFormSubmission();
  showErrorMessage();
};
// Обработчик отправки формы
const onFormSubmit = (evt) => {
  evt.preventDefault();

  validateUploadForm();

  if (hashtagValidationError || commentValidationError) {
    updateValidationUI();
  } else {
    disableFormSubmission();
    submitPhotoData(onFormSubmitSuccess, onFormSubmitError, 'POST', new FormData(uploadForm));
  }
};

// Обработчик ввода в поле хештегов
const onHashtagInput = () => {
  validateUploadForm();
};

// Обработчик ввода в поле комментария
const onCommentInput = () => {
  validateUploadForm();
};

// Обработчик нажатия клавиш в поле хештегов
const onHashtagInputKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

// Обработчик нажатия клавиш в поле комментария
const handleCommentInput = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

// Настраивает обработчики событий
const setupEventListeners = () => {
  imageFileInput.addEventListener('change', handleImageFileSelect);
  cancelUploadButton.addEventListener('click', closeImageUploadModal);
  uploadForm.addEventListener('submit', onFormSubmit);
  hashtagField.addEventListener('input', onHashtagInput);
  commentField.addEventListener('input', onCommentInput);
  hashtagField.addEventListener('keydown', onHashtagInputKeydown);
  commentField.addEventListener('keydown', handleCommentInput);
};

setupEventListeners();

export { closeImageUploadModal as closeImageEditor, resetUploadForm };
