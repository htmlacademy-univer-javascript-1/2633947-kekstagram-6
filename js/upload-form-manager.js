import { validateHashtagInput, getHashtagValidationError } from './tag-validation.js';
import { isEscapeKey } from './util.js';
import { initializeImageEditor, resetImageEditorSettings } from './image-editor.js';
import { submitPhotoData } from './api.js';
import { displaySelectedImage, clearPreview } from './image-preview-generator.js';

const MAX_COMMENT_LENGTH = 140; // Максимальная длина комментария в символах

const form = document.querySelector('.img-upload__form'); // Форма загрузки изображения
const fileInput = document.querySelector('.img-upload__input'); // Поле выбора файла
const overlay = document.querySelector('.img-upload__overlay'); // Оверлей формы
const cancelButton = document.querySelector('.img-upload__cancel'); // Кнопка отмены
const hashtagInput = document.querySelector('.text__hashtags'); // Поле ввода хештегов
const commentInput = document.querySelector('.text__description'); // Поле ввода комментария
const body = document.body; // Элемент body документа
const submitButton = document.querySelector('.img-upload__submit'); // Кнопка отправки формы

let hashtagError = ''; // Текущая ошибка валидации хештегов
let commentError = ''; // Текущая ошибка валидации комментария

const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH; // Проверяет длину комментария

const refreshErrorUI = () => { // Обновляет интерфейс отображения ошибок
  const hashtagWrapper = hashtagInput.closest('.img-upload__field-wrapper'); // Контейнер поля хештегов
  if (hashtagWrapper) {
    hashtagWrapper.classList.toggle('img-upload__field-wrapper--error', !!hashtagError);

    let errorElement = hashtagWrapper.querySelector('.pristine-error');

    if (hashtagError) { // Если есть ошибка хештегов
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

  const commentWrapper = commentInput.closest('.img-upload__field-wrapper'); // Контейнер поля комментария
  if (commentWrapper) {
    commentWrapper.classList.toggle('img-upload__field-wrapper--error', !!commentError);

    let errorElement = commentWrapper.querySelector('.pristine-error'); // Поиск элемента ошибки

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

const updateSubmitButton = () => { // Обновляет состояние кнопки отправки
  const isValid = !hashtagError && !commentError;
  submitButton.disabled = !isValid;
  submitButton.textContent = 'Опубликовать';
};

const validateForm = () => { // Валидирует всю форму
  const hashtagValue = hashtagInput.value; // Получение значения хештегов
  hashtagError = validateHashtagInput(hashtagValue) ? '' : getHashtagValidationError(hashtagValue);

  const commentValue = commentInput.value; // Получение значения комментария
  commentError = validateComment(commentValue) ? '' : `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`;
  refreshErrorUI();
  updateSubmitButton();
};

const blockSubmitButton = () => { // Блокирует кнопку отправки
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляется...';
};

const unblockSubmitButton = () => { // Разблокирует кнопку отправки
  updateSubmitButton();
};

const resetUploadForm = () => { // Сбрасывает форму загрузки
  form.reset();
  resetImageEditorSettings();

  hashtagInput.disabled = false; // Восстановление поля хештегов
  commentInput.disabled = false; // Восстановление поля комментария

  unblockSubmitButton();
  clearPreview();

  hashtagError = ''; // Сброс ошибки хештегов
  commentError = ''; // Сброс ошибки комментария
  refreshErrorUI();
  updateSubmitButton();
};

function closeImageUploadModal() { // Закрывает модальное окно загрузки
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  resetUploadForm();
}

function onImageEditorOpen() { // Открывает модальное окно загрузки
  unblockSubmitButton();

  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);

  initializeImageEditor();
  updateSubmitButton();
}

function onDocumentKeydown(evt) { // Обработчик нажатия клавиш
  if (isEscapeKey(evt)) {
    if (document.activeElement === hashtagInput || document.activeElement === commentInput) {
      return;
    }
    evt.preventDefault();
    closeImageUploadModal();
  }
}

const onFileInputChange = () => { // Обработчик изменения поля выбора файла
  const file = fileInput.files[0];
  if (!file) {
    return;
  }

  if (displaySelectedImage(file)) {
    onImageEditorOpen();
  } else {
    fileInput.value = '';
  }
};

function showSuccessMessage() { // Показывает сообщение об успешной отправке
  const template = document.querySelector('#success').content.cloneNode(true); // Клонирование шаблона
  const message = template.querySelector('.success'); // Получение элемента сообщения
  message.style.zIndex = '10000';
  document.body.appendChild(message);

  function closeSuccessMessage() { // Закрывает сообщение об успехе
    message.remove();
    document.removeEventListener('keydown', onSuccessMessageEscKeydown);
    document.addEventListener('keydown', onDocumentKeydown);
  }

  function onSuccessMessageEscKeydown(evt) { // Обработчик  для сообщения
    if (isEscapeKey(evt)) {
      closeSuccessMessage();
    }
  }

  message.addEventListener('click', (evt) => { // Обработчик клика по сообщению
    if (!evt.target.closest('.success__inner')) {
      closeSuccessMessage();
    }
  });

  message.querySelector('.success__button').addEventListener('click', closeSuccessMessage); // Обработчик кнопки закрытия
  document.removeEventListener('keydown', onDocumentKeydown);
  document.addEventListener('keydown', onSuccessMessageEscKeydown);
}

function showErrorMessage() { // Показывает сообщение об ошибке отправки
  const template = document.querySelector('#error').content.cloneNode(true);
  const message = template.querySelector('.error');
  message.style.zIndex = '10000';
  document.body.appendChild(message);

  function closeErrorMessage() { // Закрывает сообщение об ошибке
    message.remove();
    document.removeEventListener('keydown', onErrorMessageEscKeydown);
    document.addEventListener('keydown', onDocumentKeydown);
  }

  function onErrorMessageEscKeydown(evt) { // Обработчик  для сообщения
    if (isEscapeKey(evt)) {
      closeErrorMessage();
    }
  }

  message.addEventListener('click', (evt) => { // Обработчик клика по сообщению
    if (!evt.target.closest('.error__inner')) {
      closeErrorMessage(); //
    }
  });

  message.querySelector('.error__button').addEventListener('click', closeErrorMessage); // Обработчик кнопки закрытия
  document.removeEventListener('keydown', onDocumentKeydown);
  document.addEventListener('keydown', onErrorMessageEscKeydown);
}

const onFormSubmitSuccess = () => { // Обработчик успешной отправки формы
  closeImageUploadModal();
  showSuccessMessage();
};

const onFormSubmitError = () => { // Обработчик ошибки отправки формы
  unblockSubmitButton();
  showErrorMessage();
};

const onFormSubmit = (evt) => { // Обработчик отправки формы
  evt.preventDefault();

  validateForm();

  if (hashtagError || commentError) {
    refreshErrorUI();
  } else {
    blockSubmitButton();
    submitPhotoData(onFormSubmitSuccess, onFormSubmitError, 'POST', new FormData(form));
  }
};

const onHashtagInput = () => { // Обработчик ввода в поле хештегов
  validateForm();
};

const onCommentInput = () => { // Обработчик ввода в поле комментария
  validateForm();
};

const onHashtagInputKeydown = (evt) => { // Обработчик нажатия клавиш в поле хештегов
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const onCommentInputKeydown = (evt) => { // Обработчик нажатия клавиш в поле комментария
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const setupEventListeners = () => { // Настраивает обработчики событий
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
