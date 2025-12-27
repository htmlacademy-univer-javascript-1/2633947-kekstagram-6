import { validateHashtagInput, getHashtagValidationError } from './tag-validation.js';
import { isEscapeKey } from './helper-functions.js';
import { initializeImageEditor, resetImageEditorSettings } from './photo-manipulation-tool.js';
import { submitPhotoData } from './api-connector.js';
import { displaySelectedImage, clearImagePreview } from './image-preview-generator.js';

//Максимально допустимая длина комментария в символах

const MAX_COMMENT_LENGTH = 140;

// Элементы DOM формы загрузки
const uploadForm = document.querySelector('.img-upload__form');
const imageFileInput = uploadForm.querySelector('.img-upload__input');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const cancelUploadButton = uploadForm.querySelector('.img-upload__cancel');
const hashtagField = uploadForm.querySelector('.text__hashtags');
const commentField = uploadForm.querySelector('.text__description');
const documentBody = document.body;
const formSubmitButton = uploadForm.querySelector('.img-upload__submit');

let hashtagValidationError = '';

let commentValidationError = '';

const validateCommentLength = (commentText) => commentText.length <= MAX_COMMENT_LENGTH;


const updateValidationUI = () => {
  // Обработка ошибок для поля хештегов
  const hashtagContainer = hashtagField.closest('.img-upload__field-wrapper');
  if (hashtagContainer) {
    // Добавляем или удаляем класс ошибки
    hashtagContainer.classList.toggle('img-upload__field-wrapper--error', !!hashtagValidationError);

    let validationErrorElement = hashtagContainer.querySelector('.pristine-error');

    if (hashtagValidationError) {
      // Создаем новый элемент ошибки, если его нет
      validationErrorElement = validationErrorElement || document.createElement('div');
      if (!hashtagContainer.querySelector('.pristine-error')) {
        validationErrorElement.className = 'pristine-error';
        hashtagContainer.appendChild(validationErrorElement);
      }
      validationErrorElement.textContent = hashtagValidationError;
    } else if (validationErrorElement) {

      validationErrorElement.remove();
    }
  }

  // Обработка ошибок для поля комментария
  const commentContainer = commentField.closest('.img-upload__field-wrapper');
  if (commentContainer) {
    commentContainer.classList.toggle('img-upload__field-wrapper--error', !!commentValidationError);

    let validationErrorElement = commentContainer.querySelector('.pristine-error');

    if (commentValidationError) {
      // Создаем новый элемент ошибки, если его нет
      validationErrorElement = validationErrorElement || document.createElement('div');
      if (!commentContainer.querySelector('.pristine-error')) {
        validationErrorElement.className = 'pristine-error';
        commentContainer.appendChild(validationErrorElement);
      }
      validationErrorElement.textContent = commentValidationError;
    } else if (validationErrorElement) {

      validationErrorElement.remove();
    }
  }
};

//Обновляет состояние кнопки отправки формы

const updateFormSubmitButton = () => {
  const isFormValid = !hashtagValidationError && !commentValidationError;
  formSubmitButton.disabled = !isFormValid;
  formSubmitButton.textContent = 'Опубликовать';
};

/**
 * Валидирует все поля формы загрузки
 * Проверяет хештеги и комментарий, обновляет состояние ошибок
 */
const validateUploadForm = () => {
  // Валидация хештегов
  const hashtagValue = hashtagField.value;
  hashtagValidationError = validateHashtagInput(hashtagValue) ? '' : getHashtagValidationError(hashtagValue);

  // Валидация комментария
  const commentValue = commentField.value;
  commentValidationError = validateCommentLength(commentValue) ? '' : `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`;

  // Обновляем интерфейс
  updateValidationUI();
  updateFormSubmitButton();
};

//Блокирует кнопку отправки формы и показывает индикатор загрузки

const disableFormSubmission = () => {
  formSubmitButton.disabled = true;
  formSubmitButton.textContent = 'Отправляется...';
};

//Разблокирует кнопку отправки формы и восстанавливает оригинальный текст
const enableFormSubmission = () => {
  updateFormSubmitButton();
};


const resetUploadForm = () => {
  uploadForm.reset();
  resetImageEditorSettings();

  // Восстанавливаем доступность полей ввода
  hashtagField.disabled = false;
  commentField.disabled = false;

  enableFormSubmission();

  clearImagePreview();

  hashtagValidationError = '';
  commentValidationError = '';

  updateValidationUI();
  updateFormSubmitButton();
};

//Закрывает модальное окно загрузки изображения

const closeImageUploadModal = () => {
  uploadOverlay.classList.add('hidden');
  documentBody.classList.remove('modal-open');
  document.removeEventListener('keydown', handleModalKeydown);
  resetUploadForm();
};

//Открывает модальное окно загрузки изображения

const openImageUploadModal = () => {
  enableFormSubmission();

  uploadOverlay.classList.remove('hidden');
  documentBody.classList.add('modal-open');
  document.addEventListener('keydown', handleModalKeydown);

  initializeImageEditor();
  updateFormSubmitButton();
};


const handleModalKeydown = (event) => {
  if (isEscapeKey(event)) {
    // Не закрываем окно, если фокус в полях ввода
    if (document.activeElement === hashtagField || document.activeElement === commentField) {
      return;
    }
    event.preventDefault();
    closeImageUploadModal();
  }
};

//Обработчик выбора файла изображения

const handleImageFileSelect = () => {
  const selectedFile = imageFileInput.files[0];
  if (!selectedFile) {
    return;
  }

  if (displaySelectedImage(selectedFile)) {
    openImageUploadModal();
  } else {
    // Сбрасываем значение поля, если файл невалидный
    imageFileInput.value = '';
  }
};

//Отображает уведомление об успешной отправке формы

const displaySuccessNotification = () => {
  const template = document.querySelector('#success').content.cloneNode(true);
  const successMessage = template.querySelector('.success');
  successMessage.style.zIndex = '10000';
  documentBody.appendChild(successMessage);


  const closeSuccessNotification = () => {
    successMessage.remove();
    document.removeEventListener('keydown', handleSuccessNotificationEsc);
    document.addEventListener('keydown', handleModalKeydown);
  };

  const handleSuccessNotificationEsc = (event) => {
    if (isEscapeKey(event)) {
      closeSuccessNotification();
    }
  };

  // Закрытие по клику вне области уведомления
  successMessage.addEventListener('click', (event) => {
    if (!event.target.closest('.success__inner')) {
      closeSuccessNotification();
    }
  });

  // Закрытие по клику на кнопку
  successMessage.querySelector('.success__button').addEventListener('click', closeSuccessNotification);

  document.removeEventListener('keydown', handleModalKeydown);
  document.addEventListener('keydown', handleSuccessNotificationEsc);
};

//Отображает уведомление об ошибке отправки формы
const displayErrorNotification = () => {
  const template = document.querySelector('#error').content.cloneNode(true);
  const errorMessage = template.querySelector('.error');
  errorMessage.style.zIndex = '10000';
  documentBody.appendChild(errorMessage);


  const closeErrorNotification = () => {
    errorMessage.remove();
    document.removeEventListener('keydown', handleErrorNotificationEsc);
    // Восстанавливаем обработчик ESC для формы
    document.addEventListener('keydown', handleModalKeydown);
  };

  const handleErrorNotificationEsc = (event) => {
    if (isEscapeKey(event)) {
      closeErrorNotification();
    }
  };

  // Закрытие по клику вне области уведомления
  errorMessage.addEventListener('click', (event) => {
    if (!event.target.closest('.error__inner')) {
      closeErrorNotification();
    }
  });

  errorMessage.querySelector('.error__button').addEventListener('click', closeErrorNotification);

  document.removeEventListener('keydown', handleModalKeydown);
  document.addEventListener('keydown', handleErrorNotificationEsc);
};

//Обработчик успешной отправки формы

const handleFormSubmitSuccess = () => {
  closeImageUploadModal();
  displaySuccessNotification();
};

//Обработчик ошибки отправки формы

const handleFormSubmitError = () => {
  enableFormSubmission();
  displayErrorNotification();
};

//Обработчик отправки формы

const handleFormSubmission = (event) => {
  event.preventDefault();

  validateUploadForm();

  // Проверяем наличие ошибок валидации
  if (hashtagValidationError || commentValidationError) {
    updateValidationUI();
  } else {
    // Блокируем кнопку и отправляем данные
    disableFormSubmission();
    submitPhotoData(handleFormSubmitSuccess, handleFormSubmitError, 'POST', new FormData(uploadForm));
  }
};

//Обработчик ввода в поле хештегов

const handleHashtagInput = () => {
  validateUploadForm();
};

//Обработчик ввода в поле комментария

const handleCommentInput = () => {
  validateUploadForm();
};

//Обработчик нажатия клавиш в поле хештегов

const handleHashtagFieldKeydown = (event) => {
  if (isEscapeKey(event)) {
    event.stopPropagation();
  }
};

//Обработчик нажатия клавиш в поле комментария

const handleCommentFieldKeydown = (event) => {
  if (isEscapeKey(event)) {
    event.stopPropagation();
  }
};

//Инициализирует все обработчики событий для формы загрузки
const initializeFormEventListeners = () => {
  imageFileInput.addEventListener('change', handleImageFileSelect);
  cancelUploadButton.addEventListener('click', closeImageUploadModal);
  uploadForm.addEventListener('submit', handleFormSubmission);
  hashtagField.addEventListener('input', handleHashtagInput);
  commentField.addEventListener('input', handleCommentInput);
  hashtagField.addEventListener('keydown', handleHashtagFieldKeydown);
  commentField.addEventListener('keydown', handleCommentFieldKeydown);
};

initializeFormEventListeners();

export { closeImageUploadModal as closeImageEditor, resetUploadForm };
