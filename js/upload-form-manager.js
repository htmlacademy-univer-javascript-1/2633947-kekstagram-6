import { validateHashtagInput, getHashtagValidationError } from './tag-validation.js'; // Импорт функций валидации хештегов
import { isEscapeKey } from './util.js'; // Импорт функции проверки клавиши Escape
import { initializeImageEditor, resetImageEditorSettings } from './image-editor.js'; // Импорт функций редактора изображений
import { submitPhotoData } from './api.js'; // Импорт функции отправки данных на сервер
import { displaySelectedImage, clearPreview } from './image-preview-generator.js'; // Импорт функций работы с превью

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

    if (hashtagError) {
      errorElement = errorElement || document.createElement('div'); // Создание элемента при отсутствии
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

const updateSubmitButton = () => { // Обновляет состояние кнопки отправки
  const isValid = !hashtagError && !commentError; // Проверка валидности формы
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

  hashtagInput.disabled = false;
  commentInput.disabled = false;

  unblockSubmitButton();
  clearPreview();

  hashtagError = '';
  commentError = '';
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

  if (displaySelectedImage(file)) { // Попытка отображения изображения
    onImageEditorOpen(); // Открытие модального окна при успехе
  } else {
    fileInput.value = '';
  }
};

function showSuccessMessage() { // Показывает сообщение об успешной отправке
  const template = document.querySelector('#success').content.cloneNode(true); // Клонирование шаблона
  const message = template.querySelector('.success');
  message.style.zIndex = '10000';
  document.body.appendChild(message);

  function closeSuccessMessage() { // Закрывает сообщение об успехе
    message.remove();
    document.removeEventListener('keydown', onSuccessMessageEscKeydown); // Удаление обработчика клавиатуры
    document.addEventListener('keydown', onDocumentKeydown);
  }

  function onSuccessMessageEscKeydown(evt) { // Обработчик Escape для сообщения
    if (isEscapeKey(evt)) { // Проверка клавиши Escape
      closeSuccessMessage();
    }
  }

  message.addEventListener('click', (evt) => { // Обработчик клика по сообщению
    if (!evt.target.closest('.success__inner')) { // Проверка клика вне внутренней области
      closeSuccessMessage();
    }
  });

  message.querySelector('.success__button').addEventListener('click', closeSuccessMessage); // Обработчик кнопки закрытия
  document.removeEventListener('keydown', onDocumentKeydown);
  document.addEventListener('keydown', onSuccessMessageEscKeydown);
}

function showErrorMessage() { // Показывает сообщение об ошибке отправки
  const template = document.querySelector('#error').content.cloneNode(true);
  const message = template.querySelector('.error'); // Получение элемента сообщения
  message.style.zIndex = '10000';
  document.body.appendChild(message); // Добавление сообщения в DOM

  function closeErrorMessage() { // Закрывает сообщение об ошибке
    message.remove();
    document.removeEventListener('keydown', onErrorMessageEscKeydown); // Удаление обработчика клавиатуры
    document.addEventListener('keydown', onDocumentKeydown);
  }

  function onErrorMessageEscKeydown(evt) { // Обработчик Escape для сообщения
    if (isEscapeKey(evt)) { // Проверка клавиши Escape
      closeErrorMessage();
    }
  }

  message.addEventListener('click', (evt) => { // Обработчик клика по сообщению
    if (!evt.target.closest('.error__inner')) { // Проверка клика вне внутренней области
      closeErrorMessage();
    }
  });

  message.querySelector('.error__button').addEventListener('click', closeErrorMessage); // Обработчик кнопки закрытия
  document.removeEventListener('keydown', onDocumentKeydown);
  document.addEventListener('keydown', onErrorMessageEscKeydown);
}

const onFormSubmitSuccess = () => { // Обработчик успешной отправки формы
  closeImageUploadModal(); // Закрытие модального окна
  showSuccessMessage(); // Показ сообщения об успехе
};

const onFormSubmitError = () => { // Обработчик ошибки отправки формы
  unblockSubmitButton();
  showErrorMessage(); // Показ сообщения об ошибке
};

const onFormSubmit = (evt) => { // Обработчик отправки формы
  evt.preventDefault(); // Предотвращение стандартной отправки

  validateForm();

  if (hashtagError || commentError) { // Проверка наличия ошибок
    refreshErrorUI();
  } else {
    blockSubmitButton(); // Блокировка кнопки отправки
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
  fileInput.addEventListener('change', onFileInputChange); // Обработчик выбора файла
  cancelButton.addEventListener('click', closeImageUploadModal); // Обработчик кнопки отмены
  form.addEventListener('submit', onFormSubmit); // Обработчик отправки формы
  hashtagInput.addEventListener('input', onHashtagInput); // Обработчик ввода хештегов
  commentInput.addEventListener('input', onCommentInput); // Обработчик ввода комментария
  hashtagInput.addEventListener('keydown', onHashtagInputKeydown); // Обработчик клавиш хештегов
  commentInput.addEventListener('keydown', onCommentInputKeydown); // Обработчик клавиш комментария
};

setupEventListeners(); // Инициализация обработчиков событий

export { closeImageUploadModal as closeImageEditor, resetUploadForm };
