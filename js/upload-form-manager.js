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
const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

// Обновляет интерфейс отображения ошибок
const refreshErrorUI = () => {
  const hashtagWrapper = hashtagField.closest('.img-upload__field-wrapper'); // Контейнер поля хештегов
  if (hashtagWrapper) {
    hashtagWrapper.classList.toggle('img-upload__field-wrapper--error', !!hashtagValidationError);

    let errorElement = hashtagWrapper.querySelector('.pristine-error');

    if (hashtagValidationError) {
      errorElement = errorElement || document.createElement('div');
      if (!hashtagWrapper.querySelector('.pristine-error')) {
        errorElement.className = 'pristine-error';
        hashtagWrapper.appendChild(errorElement);
      }
      errorElement.textContent = hashtagValidationError;
    } else if (errorElement) {
      errorElement.remove();
    }
  }

  // Контейнер поля комментария
  const commentWrapper = commentField.closest('.img-upload__field-wrapper');
  if (commentWrapper) {
    commentWrapper.classList.toggle('img-upload__field-wrapper--error', !!commentValidationError);

    let errorElement = commentWrapper.querySelector('.pristine-error');

    if (commentValidationError) {
      errorElement = errorElement || document.createElement('div');
      if (!commentWrapper.querySelector('.pristine-error')) {
        errorElement.className = 'pristine-error';
        commentWrapper.appendChild(errorElement);
      }
      errorElement.textContent = commentValidationError;
    } else if (errorElement) {
      errorElement.remove();
    }
  }
};
// Обновляет состояние кнопки отправки
const updateSubmitButton = () => {
  const isValid = !hashtagValidationError && !commentValidationError;
  formSubmitButton.disabled = !isValid;
  formSubmitButton.textContent = 'Опубликовать';
};
// Валидирует всю форму
const validateForm = () => {
  const hashtagValue = hashtagField.value;
  hashtagValidationError = validateHashtagInput(hashtagValue) ? '' : getHashtagValidationError(hashtagValue);

  // Получение значения комментария
  const commentValue = commentField.value;
  commentValidationError = validateComment(commentValue) ? '' : `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`;
  refreshErrorUI();
  updateSubmitButton();
};

// Блокирует кнопку отправки
const blockSubmitButton = () => {
  formSubmitButton.disabled = true;
  formSubmitButton.textContent = 'Отправляется...';
};

// Разблокирует кнопку отправки
const unblockSubmitButton = () => {
  updateSubmitButton();
};

// Сбрасывает форму загрузки
const resetUploadForm = () => {
  uploadForm.reset();
  resetImageEditorSettings();

  hashtagField.disabled = false;
  commentField.disabled = false;

  unblockSubmitButton();
  clearPreview();

  hashtagValidationError = '';
  commentValidationError = '';
  refreshErrorUI();
  updateSubmitButton();
};

// Закрывает модальное окно загрузки
function closeImageUploadModal() {
  uploadOverlay.classList.add('hidden');
  documentBody.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  resetUploadForm();
}

// Открывает модальное окно загрузки
function onImageEditorOpen() {
  unblockSubmitButton();

  uploadOverlay.classList.remove('hidden');
  documentBody.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);

  initializeImageEditor();
  updateSubmitButton();
}

// Обработчик нажатия клавиш
function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    if (document.activeElement === hashtagField || document.activeElement === commentField) {
      return;
    }
    evt.preventDefault();
    closeImageUploadModal();
  }
}

// Обработчик изменения поля выбора файла
const onFileInputChange = () => {
  const file = imageFileInput.files[0];
  if (!file) {
    return;
  }

  if (displaySelectedImage(file)) {
    onImageEditorOpen();
  } else {
    imageFileInput.value = '';
  }
};

// Показывает сообщение об успешной отправке
function showSuccessMessage() {
  const template = document.querySelector('#success').content.cloneNode(true);
  const message = template.querySelector('.success');
  message.style.zIndex = '10000';
  document.documentBody.appendChild(message);

  // Закрывает сообщение об успехе
  function closeSuccessMessage() {
    message.remove();
    document.removeEventListener('keydown', onSuccessMessageEscKeydown);
    // Возвращаем обработчик ESC для формы
    document.addEventListener('keydown', onDocumentKeydown);
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
  document.removeEventListener('keydown', onDocumentKeydown);
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
    document.addEventListener('keydown', onDocumentKeydown);
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
  document.removeEventListener('keydown', onDocumentKeydown);
  document.addEventListener('keydown', onErrorMessageEscKeydown);
}

// Обработчик успешной отправки формы
const onFormSubmitSuccess = () => {
  closeImageUploadModal();
  showSuccessMessage();
};
// Обработчик ошибки отправки формы
const onFormSubmitError = () => {
  unblockSubmitButton();
  showErrorMessage();
};
// Обработчик отправки формы
const onFormSubmit = (evt) => {
  evt.preventDefault();

  validateForm();

  if (hashtagValidationError || commentValidationError) {
    refreshErrorUI();
  } else {
    blockSubmitButton();
    submitPhotoData(onFormSubmitSuccess, onFormSubmitError, 'POST', new FormData(uploadForm));
  }
};

// Обработчик ввода в поле хештегов
const onHashtagInput = () => {
  validateForm();
};

// Обработчик ввода в поле комментария
const onCommentInput = () => {
  validateForm();
};

// Обработчик нажатия клавиш в поле хештегов
const onHashtagInputKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

// Обработчик нажатия клавиш в поле комментария
const onCommentInputKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

// Настраивает обработчики событий
const setupEventListeners = () => {
  imageFileInput.addEventListener('change', onFileInputChange);
  cancelUploadButton.addEventListener('click', closeImageUploadModal);
  uploadForm.addEventListener('submit', onFormSubmit);
  hashtagField.addEventListener('input', onHashtagInput);
  commentField.addEventListener('input', onCommentInput);
  hashtagField.addEventListener('keydown', onHashtagInputKeydown);
  commentField.addEventListener('keydown', onCommentInputKeydown);
};

setupEventListeners();

export { closeImageUploadModal as closeImageEditor, resetUploadForm };
