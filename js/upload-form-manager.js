import { tagValidation, getTagErrorMessage } from './tag-validation.js';
import { isEscapeKey } from './util.js';
import { initializateImageEditor, clearImageEditor } from './image-editor.js';
import { uploadData } from './api.js';
import { openSelectedImage, clearPreview } from './image-preview-generator.js';

const MAX_LENGTH = 140;

const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const cancel = document.querySelector('.img-upload__cancel');
const hashtags = document.querySelector('.text__hashtags');
const description = document.querySelector('.text__description');
const body = document.body;
const submit = document.querySelector('.img-upload__submit');

let hashtagError = '';
let commentError = '';

const validComment = (value) => value.length <= MAX_LENGTH;

const updateErrorDisplay = () => {
  const hashtagContainer = hashtags.closest('.img-upload__field-wrapper');
  if (hashtagContainer) {
    hashtagContainer.classList.toggle('img-upload__field-wrapper--error', !!hashtagError);

    let errorElement = hashtagContainer.querySelector('.pristine-error');

    if (hashtagError) {
      errorElement = errorElement || document.createElement('div');
      if (!hashtagContainer.querySelector('.pristine-error')) {
        errorElement.className = 'pristine-error';
        hashtagContainer.appendChild(errorElement);
      }
      errorElement.textContent = hashtagError;
    } else if (errorElement) {
      errorElement.remove();
    }
  }

  const commentContainer = description.closest('.img-upload__field-wrapper');
  if (commentContainer) {
    commentContainer.classList.toggle('img-upload__field-wrapper--error', !!commentError);

    let errorElement = commentContainer.querySelector('.pristine-error');

    if (commentError) {
      errorElement = errorElement || document.createElement('div');
      if (!commentContainer.querySelector('.pristine-error')) {
        errorElement.className = 'pristine-error';
        commentContainer.appendChild(errorElement);
      }
      errorElement.textContent = commentError;
    } else if (errorElement) {
      errorElement.remove();
    }
  }
};

const updatesubmit = () => {
  const isValid = !hashtagError && !commentError;
  submit.disabled = !isValid;
  submit.textContent = 'Опубликовать';
};

const validForm = () => {
  const hashtagValue = hashtags.value;
  hashtagError = tagValidation(hashtagValue) ? '' : getTagErrorMessage(hashtagValue);

  const commentValue = description.value;
  commentError = validComment(commentValue) ? '' : `Длина комментария не должна превышать ${MAX_LENGTH} символов`;
  updateErrorDisplay();
  updatesubmit();
};

const blocksubmit = () => {
  submit.disabled = true;
  submit.textContent = 'Отправляется...';
};

const unblocksubmit = () => {
  updatesubmit();
};

const resetForm = () => {
  form.reset();
  clearImageEditor();

  hashtags.disabled = false;
  description.disabled = false;

  unblocksubmit();
  clearPreview();

  hashtagError = '';
  commentError = '';
  updateErrorDisplay();
  updatesubmit();
};

function handleEditorClose() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  resetForm();
}

function handleEditorOpen() {
  unblocksubmit();

  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);

  initializateImageEditor();
  updatesubmit();
}

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    if (document.activeElement === hashtags || document.activeElement === description) {
      return;
    }
    evt.preventDefault();
    handleEditorClose();
  }
}

const onFileInputChange = () => {
  const file = fileInput.files[0];
  if (!file) {
    return;
  }

  if (openSelectedImage(file)) {
    handleEditorOpen();
  } else {
    fileInput.value = '';
  }
};

function displaySuccess() {
  const template = document.querySelector('#success').content.cloneNode(true);
  const message = template.querySelector('.success');
  message.style.zIndex = '10000';
  document.body.appendChild(message);

  function hideSuccessMessage() {
    message.remove();
    document.removeEventListener('keydown', SuccessKeydown);
    document.addEventListener('keydown', onDocumentKeydown);
  }

  function SuccessKeydown(evt) {
    if (isEscapeKey(evt)) {
      hideSuccessMessage();
    }
  }

  message.addEventListener('click', (evt) => {
    if (!evt.target.closest('.success__inner')) {
      hideSuccessMessage();
    }
  });

  message.querySelector('.success__button').addEventListener('click', hideSuccessMessage);
  document.removeEventListener('keydown', onDocumentKeydown);
  document.addEventListener('keydown', SuccessKeydown);
}

function showErrorMessage() {
  const template = document.querySelector('#error').content.cloneNode(true);
  const message = template.querySelector('.error');
  message.style.zIndex = '10000';
  document.body.appendChild(message);

  function closeErrorMessage() {
    message.remove();
    document.removeEventListener('keydown', ErrorMessageKeydown);
    document.addEventListener('keydown', onDocumentKeydown);
  }

  function ErrorMessageKeydown(evt) {
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
  document.addEventListener('keydown', ErrorMessageKeydown);
}

const SubmitSuccess = () => {
  handleEditorClose();
  displaySuccess();
};

const SubmitError = () => {
  unblocksubmit();
  showErrorMessage();
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  validForm();

  if (hashtagError || commentError) {
    updateErrorDisplay();
  } else {
    blocksubmit();
    uploadData(SubmitSuccess, SubmitError, 'POST', new FormData(form));
  }
};

const onhashtags = () => {
  validForm();
};

const ondescription = () => {
  validForm();
};

const onhashtagsKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const ondescriptionKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const EventListeners = () => {
  fileInput.addEventListener('change', onFileInputChange);
  cancel.addEventListener('click', handleEditorClose);
  form.addEventListener('submit', onFormSubmit);
  hashtags.addEventListener('input', onhashtags);
  description.addEventListener('input', ondescription);
  hashtags.addEventListener('keydown', onhashtagsKeydown);
  description.addEventListener('keydown', ondescriptionKeydown);
};

EventListeners();

export { handleEditorClose as closeImageEditor, resetForm };
