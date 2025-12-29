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
    hashtagWrapper.classList.toggle('img-upload__field-wrapper--error', !!hashtagError); // Переключение класса ошибки

    let errorElement = hashtagWrapper.querySelector('.pristine-error'); // Поиск элемента ошибки

    if (hashtagError) { // Если есть ошибка хештегов
      errorElement = errorElement || document.createElement('div'); // Создание элемента при отсутствии
      if (!hashtagWrapper.querySelector('.pristine-error')) {
        errorElement.className = 'pristine-error'; // Установка класса
        hashtagWrapper.appendChild(errorElement); // Добавление в DOM
      }
      errorElement.textContent = hashtagError; // Установка текста ошибки
    } else if (errorElement) { // Если ошибки нет, но элемент существует
      errorElement.remove(); // Удаление элемента ошибки
    }
  }

  const commentWrapper = commentInput.closest('.img-upload__field-wrapper'); // Контейнер поля комментария
  if (commentWrapper) {
    commentWrapper.classList.toggle('img-upload__field-wrapper--error', !!commentError); // Переключение класса ошибки

    let errorElement = commentWrapper.querySelector('.pristine-error'); // Поиск элемента ошибки

    if (commentError) { // Если есть ошибка комментария
      errorElement = errorElement || document.createElement('div'); // Создание элемента при отсутствии
      if (!commentWrapper.querySelector('.pristine-error')) {
        errorElement.className = 'pristine-error'; // Установка класса
        commentWrapper.appendChild(errorElement); // Добавление в DOM
      }
      errorElement.textContent = commentError; // Установка текста ошибки
    } else if (errorElement) { // Если ошибки нет, но элемент существует
      errorElement.remove(); // Удаление элемента ошибки
    }
  }
};

const updateSubmitButton = () => { // Обновляет состояние кнопки отправки
  const isValid = !hashtagError && !commentError; // Проверка валидности формы
  submitButton.disabled = !isValid; // Блокировка/разблокировка кнопки
  submitButton.textContent = 'Опубликовать'; // Установка текста кнопки
};

const validateForm = () => { // Валидирует всю форму
  const hashtagValue = hashtagInput.value; // Получение значения хештегов
  hashtagError = validateHashtagInput(hashtagValue) ? '' : getHashtagValidationError(hashtagValue); // Валидация хештегов

  const commentValue = commentInput.value; // Получение значения комментария
  commentError = validateComment(commentValue) ? '' : `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`; // Валидация комментария
  refreshErrorUI(); // Обновление интерфейса ошибок
  updateSubmitButton(); // Обновление кнопки отправки
};

const blockSubmitButton = () => { // Блокирует кнопку отправки
  submitButton.disabled = true; // Установка disabled атрибута
  submitButton.textContent = 'Отправляется...'; // Изменение текста кнопки
};

const unblockSubmitButton = () => { // Разблокирует кнопку отправки
  updateSubmitButton(); // Восстановление состояния кнопки
};

const resetUploadForm = () => { // Сбрасывает форму загрузки
  form.reset(); // Сброс значений формы
  resetImageEditorSettings(); // Сброс настроек редактора изображений

  hashtagInput.disabled = false; // Восстановление поля хештегов
  commentInput.disabled = false; // Восстановление поля комментария

  unblockSubmitButton(); // Разблокировка кнопки отправки
  clearPreview(); // Очистка превью изображения

  hashtagError = ''; // Сброс ошибки хештегов
  commentError = ''; // Сброс ошибки комментария
  refreshErrorUI(); // Обновление интерфейса ошибок
  updateSubmitButton(); // Обновление кнопки отправки
};

function closeImageUploadModal() { // Закрывает модальное окно загрузки
  overlay.classList.add('hidden'); // Скрытие оверлея
  body.classList.remove('modal-open'); // Удаление класса блокировки скролла
  document.removeEventListener('keydown', onDocumentKeydown); // Удаление обработчика клавиатуры
  resetUploadForm(); // Сброс формы
}

function onImageEditorOpen() { // Открывает модальное окно загрузки
  unblockSubmitButton(); // Разблокировка кнопки отправки

  overlay.classList.remove('hidden'); // Показ оверлея
  body.classList.add('modal-open'); // Добавление класса блокировки скролла
  document.addEventListener('keydown', onDocumentKeydown); // Добавление обработчика клавиатуры

  initializeImageEditor(); // Инициализация редактора изображений
  updateSubmitButton(); // Обновление кнопки отправки
}

function onDocumentKeydown(evt) { // Обработчик нажатия клавиш
  if (isEscapeKey(evt)) { // Проверка клавиши Escape
    if (document.activeElement === hashtagInput || document.activeElement === commentInput) { // Проверка активного элемента
      return; // Выход если фокус в полях ввода
    }
    evt.preventDefault(); // Предотвращение стандартного поведения
    closeImageUploadModal(); // Закрытие модального окна
  }
}

const onFileInputChange = () => { // Обработчик изменения поля выбора файла
  const file = fileInput.files[0]; // Получение выбранного файла
  if (!file) { // Проверка наличия файла
    return;
  }

  if (displaySelectedImage(file)) { // Попытка отображения изображения
    onImageEditorOpen(); // Открытие модального окна при успехе
  } else {
    fileInput.value = ''; // Сброс значения поля при ошибке
  }
};

function showSuccessMessage() { // Показывает сообщение об успешной отправке
  const template = document.querySelector('#success').content.cloneNode(true); // Клонирование шаблона
  const message = template.querySelector('.success'); // Получение элемента сообщения
  message.style.zIndex = '10000'; // Установка высокого z-index
  document.body.appendChild(message); // Добавление сообщения в DOM

  function closeSuccessMessage() { // Закрывает сообщение об успехе
    message.remove(); // Удаление сообщения из DOM
    document.removeEventListener('keydown', onSuccessMessageEscKeydown); // Удаление обработчика клавиатуры
    document.addEventListener('keydown', onDocumentKeydown); // Восстановление обработчика формы
  }

  function onSuccessMessageEscKeydown(evt) { // Обработчик Escape для сообщения
    if (isEscapeKey(evt)) { // Проверка клавиши Escape
      closeSuccessMessage(); // Закрытие сообщения
    }
  }

  message.addEventListener('click', (evt) => { // Обработчик клика по сообщению
    if (!evt.target.closest('.success__inner')) { // Проверка клика вне внутренней области
      closeSuccessMessage(); // Закрытие сообщения
    }
  });

  message.querySelector('.success__button').addEventListener('click', closeSuccessMessage); // Обработчик кнопки закрытия
  document.removeEventListener('keydown', onDocumentKeydown); // Удаление обработчика формы
  document.addEventListener('keydown', onSuccessMessageEscKeydown); // Добавление обработчика сообщения
}

function showErrorMessage() { // Показывает сообщение об ошибке отправки
  const template = document.querySelector('#error').content.cloneNode(true); // Клонирование шаблона
  const message = template.querySelector('.error'); // Получение элемента сообщения
  message.style.zIndex = '10000'; // Установка высокого z-index
  document.body.appendChild(message); // Добавление сообщения в DOM

  function closeErrorMessage() { // Закрывает сообщение об ошибке
    message.remove(); // Удаление сообщения из DOM
    document.removeEventListener('keydown', onErrorMessageEscKeydown); // Удаление обработчика клавиатуры
    document.addEventListener('keydown', onDocumentKeydown); // Восстановление обработчика формы
  }

  function onErrorMessageEscKeydown(evt) { // Обработчик Escape для сообщения
    if (isEscapeKey(evt)) { // Проверка клавиши Escape
      closeErrorMessage(); // Закрытие сообщения
    }
  }

  message.addEventListener('click', (evt) => { // Обработчик клика по сообщению
    if (!evt.target.closest('.error__inner')) { // Проверка клика вне внутренней области
      closeErrorMessage(); // Закрытие сообщения
    }
  });

  message.querySelector('.error__button').addEventListener('click', closeErrorMessage); // Обработчик кнопки закрытия
  document.removeEventListener('keydown', onDocumentKeydown); // Удаление обработчика формы
  document.addEventListener('keydown', onErrorMessageEscKeydown); // Добавление обработчика сообщения
}

const onFormSubmitSuccess = () => { // Обработчик успешной отправки формы
  closeImageUploadModal(); // Закрытие модального окна
  showSuccessMessage(); // Показ сообщения об успехе
};

const onFormSubmitError = () => { // Обработчик ошибки отправки формы
  unblockSubmitButton(); // Разблокировка кнопки отправки
  showErrorMessage(); // Показ сообщения об ошибке
};

const onFormSubmit = (evt) => { // Обработчик отправки формы
  evt.preventDefault(); // Предотвращение стандартной отправки

  validateForm(); // Валидация формы

  if (hashtagError || commentError) { // Проверка наличия ошибок
    refreshErrorUI(); // Обновление интерфейса ошибок
  } else {
    blockSubmitButton(); // Блокировка кнопки отправки
    submitPhotoData(onFormSubmitSuccess, onFormSubmitError, 'POST', new FormData(form)); // Отправка данных
  }
};

const onHashtagInput = () => { // Обработчик ввода в поле хештегов
  validateForm(); // Валидация формы
};

const onCommentInput = () => { // Обработчик ввода в поле комментария
  validateForm(); // Валидация формы
};

const onHashtagInputKeydown = (evt) => { // Обработчик нажатия клавиш в поле хештегов
  if (isEscapeKey(evt)) { // Проверка клавиши Escape
    evt.stopPropagation(); // Остановка всплытия события
  }
};

const onCommentInputKeydown = (evt) => { // Обработчик нажатия клавиш в поле комментария
  if (isEscapeKey(evt)) { // Проверка клавиши Escape
    evt.stopPropagation(); // Остановка всплытия события
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

export { closeImageUploadModal as closeImageEditor, resetUploadForm }; // Экспорт функций управления формой
