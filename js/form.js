import { validateHashtags, getHashtagErrorMessage } from './hashtags.js';
import { isEscapeKey } from './util.js';
import { initImageEditor, resetImageEditor } from './image-editor.js';
import { uploadData } from './fetch.js';
import { showSelectedImage, resetPreview } from './preview.js';

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
  hashtagError = validateHashtags(hashtagValue) ? '' : getHashtagErrorMessage(hashtagValue);

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

const resetForm = () => {
  form.reset();
  resetImageEditor();

  hashtagInput.disabled = false;
  commentInput.disabled = false;

  unblockSubmitButton();
  resetPreview();

  hashtagError = '';
  commentError = '';
  refreshErrorUI();
  updateSubmitButton();
};

function onImageEditorClose() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  resetForm();
}

function onImageEditorOpen() {
  unblockSubmitButton();

  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);

  initImageEditor();
  updateSubmitButton();
}

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    if (document.activeElement === hashtagInput || document.activeElement === commentInput) {
      return;
    }
    evt.preventDefault();
    onImageEditorClose();
  }
}

const onFileInputChange = () => {
  const file = fileInput.files[0];
  if (!file) {
    return;
  }

  if (showSelectedImage(file)) {
    onImageEditorOpen();
  } else {
    fileInput.value = '';
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
    // Возвращаем обработчик ESC для формы
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
    // Возвращаем обработчик ESC для формы
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
  onImageEditorClose();
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
    uploadData(onFormSubmitSuccess, onFormSubmitError, 'POST', new FormData(form));
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
  cancelButton.addEventListener('click', onImageEditorClose);
  form.addEventListener('submit', onFormSubmit);
  hashtagInput.addEventListener('input', onHashtagInput);
  commentInput.addEventListener('input', onCommentInput);
  hashtagInput.addEventListener('keydown', onHashtagInputKeydown);
  commentInput.addEventListener('keydown', onCommentInputKeydown);
};

setupEventListeners();

export { onImageEditorClose as closeImageEditor, resetForm };
