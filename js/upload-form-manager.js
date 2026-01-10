import { validateHashtagInput, getHashtagValidationError } from './tag-validation.js';
import { isEscapeKey } from './util.js';
import { initializeImageEditor, resetImageEditorSettings } from './image-editor.js';
import { submitPhotoData } from './api.js';
import { displaySelectedImage, clearPreview } from './image-preview-generator.js';

const MAX_COMMENT_LENGTH = 140;

const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagInput = document.querySelector('.text__hashtags');
const commentInput = document.querySelector('.text__description');
const body = document.body;
const submitButton = document.querySelector('.img-upload__submit');

let hashtagError = '';
let commentError = '';

const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

const refreshErrorUI = () => {
  const hashtagWrapper = hashtagInput.closest('.img-upload__field-wrapper');
  if (hashtagWrapper) {
    hashtagWrapper.classList.toggle('img-upload__field-wrapper--error', !!hashtagError);

    let errorElement = hashtagWrapper.querySelector('.pristine-error');

    if (hashtagError) {
      errorElement = errorElement || document.createElement('div');
      if (!hashtagWrapper.querySelector('.pristine-error')) {
        errorElement.className = 'pristine-error';
        hashtagWrapper.appendChild(errorElement);
      }
      errorElement.textContent = hashtagError;
    } else if (errorElement) {
      errorElement.remove();
    }
  }

  const commentWrapper = commentInput.closest('.img-upload__field-wrapper');
  if (commentWrapper) {
    commentWrapper.classList.toggle('img-upload__field-wrapper--error', !!commentError);

    let errorElement = commentWrapper.querySelector('.pristine-error');

    if (commentError) {
      errorElement = errorElement || document.createElement('div');
      if (!commentWrapper.querySelector('.pristine-error')) {
        errorElement.className = 'pristine-error';
        commentWrapper.appendChild(errorElement);
      }
      errorElement.textContent = commentError;
    } else if (errorElement) {
      errorElement.remove();
    }
  }
};

const updateSubmitButton = () => {
  const isValid = !hashtagError && !commentError;
  submitButton.disabled = !isValid;
  submitButton.textContent = 'Опубликовать';
};

const validateForm = () => {
  const hashtagValue = hashtagInput.value;
  hashtagError = validateHashtagInput(hashtagValue) ? '' : getHashtagValidationError(hashtagValue);

  const commentValue = commentInput.value;
  commentError = validateComment(commentValue) ? '' : `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`;

  refreshErrorUI();
  updateSubmitButton();
};

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляется...';
};

const unblockSubmitButton = () => {
  updateSubmitButton();
};

const resetUploadForm = () => {
  form.reset();
  resetImageEditorSettings();

  hashtagInput.disabled = false;
  commentInput.disabled = false;

  unblockSubmitButton();
  clearPreview();

  hashtagError = '';
  commentError = '';
  refreshErrorUI();
  updateSubmitButton();
};

function closeImageUploadModal() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  resetUploadForm();
}

function onImageEditorOpen() {
  unblockSubmitButton();

  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);

  initializeImageEditor();
  updateSubmitButton();
}

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    if (document.activeElement === hashtagInput || document.activeElement === commentInput) {
      return;
    }
    evt.preventDefault();
    closeImageUploadModal();
  }
}

function showFileFormatErrorMessage() {
  const template = document.querySelector('#error').content.cloneNode(true);
  const message = template.querySelector('.error');
  message.style.zIndex = '10000';

  // Меняем текст заголовка ошибки
  const errorTitle = message.querySelector('.error__title');
  errorTitle.textContent = 'Неподдерживаемый формат файла';

  // Меняем текст кнопки
  const errorButton = message.querySelector('.error__button');
  errorButton.textContent = 'Попробовать другой файл';

  document.body.appendChild(message);

  function closeErrorMessage() {
    // 1. Очищаем поле выбора файла
    fileInput.value = '';
    // 2. Удаляем сообщение об ошибке
    message.remove();
    document.removeEventListener('keydown', onErrorMessageEscKeydown);
    document.addEventListener('keydown', onDocumentKeydown);
  }

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

  errorButton.addEventListener('click', closeErrorMessage);

  document.removeEventListener('keydown', onDocumentKeydown);
  document.addEventListener('keydown', onErrorMessageEscKeydown);
}

const onFileInputChange = () => {
  const file = fileInput.files[0];
  if (!file) {
    return;
  }

  if (displaySelectedImage(file)) {
    onImageEditorOpen();
  } else {
    fileInput.value = '';
    // ПОКАЗЫВАЕМ СООБЩЕНИЕ ОБ ОШИБКЕ ФОРМАТА
    showFileFormatErrorMessage();
  }
};

function showSuccessMessage() {
  const template = document.querySelector('#success').content.cloneNode(true);
  const message = template.querySelector('.success');
  message.style.zIndex = '10000';
  document.body.appendChild(message);

  function closeSuccessMessage() {
    message.remove();
    document.removeEventListener('keydown', onSuccessMessageEscKeydown);
    document.addEventListener('keydown', onDocumentKeydown);
  }

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

function showErrorMessage() {
  const template = document.querySelector('#error').content.cloneNode(true);
  const message = template.querySelector('.error');
  message.style.zIndex = '10000';
  document.body.appendChild(message);

  function closeErrorMessage() {
    message.remove();
    document.removeEventListener('keydown', onErrorMessageEscKeydown);
    document.addEventListener('keydown', onDocumentKeydown);
  }

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

const onFormSubmitSuccess = () => {
  closeImageUploadModal();
  showSuccessMessage();
};

const onFormSubmitError = () => {
  unblockSubmitButton();
  showErrorMessage();
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  validateForm();

  if (hashtagError || commentError) {
    refreshErrorUI();
  } else {
    blockSubmitButton();
    submitPhotoData(onFormSubmitSuccess, onFormSubmitError, 'POST', new FormData(form));
  }
};

const onHashtagInput = () => {
  validateForm();
};

const onCommentInput = () => {
  validateForm();
};

const onHashtagInputKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const onCommentInputKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const setupEventListeners = () => {
  fileInput.addEventListener('change', onFileInputChange);
  cancelButton.addEventListener('click', closeImageUploadModal);
  form.addEventListener('submit', onFormSubmit);
  hashtagInput.addEventListener('input', onHashtagInput);
  commentInput.addEventListener('input', onCommentInput);
  hashtagInput.addEventListener('keydown', onHashtagInputKeydown);
  commentInput.addEventListener('keydown', onCommentInputKeydown);
};

setupEventListeners();

export { closeImageUploadModal as closeImageEditor, resetUploadForm };
