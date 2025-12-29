import { fetchPhotoData } from './api.js'; // Импорт функции загрузки данных с сервера
import { imageRender } from './gallery-manager.js'; // Импорт функции отрисовки галереи
import './image-filter.js'; // Импорт модуля фильтрации изображений
import './upload-form-manager.js'; // Импорт модуля управления формой загрузки

let photos = []; // Массив для хранения загруженных фотографий

const onSuccess = (data) => { // Обработчик успешной загрузки данных
  photos = data.slice(); // Сохранение копии данных
  imageRender(photos); // Отрисовка фотографий в галерее
  document.querySelector('.img-filters').classList.remove('img-filters--inactive'); // Активация фильтров
};

const onFail = () => { // Обработчик ошибки загрузки данных
  const messageAlert = document.createElement('div'); // Создание элемента уведомления
  messageAlert.className = 'data-error'; // Установка CSS класса
  messageAlert.style.position = 'fixed'; // Фиксированное позиционирование
  messageAlert.style.top = '20px'; // Отступ сверху
  messageAlert.style.left = '50%'; // Центрирование по горизонтали
  messageAlert.style.transform = 'translateX(-50%)'; // Точное центрирование
  messageAlert.style.backgroundColor = '#ee3939ff'; // Цвет фона (красный)
  messageAlert.style.color = 'white'; // Цвет текста
  messageAlert.style.padding = '30px 50px'; // Внутренние отступы
  messageAlert.style.borderRadius = '8px'; // Закругление углов
  messageAlert.style.zIndex = '10000'; // Высокий z-index поверх всех элементов
  messageAlert.style.textAlign = 'center'; // Выравнивание текста по центру
  messageAlert.style.fontSize = '20px'; // Размер шрифта
  messageAlert.style.fontFamily = 'Arial, sans-serif'; // Шрифт текста
  messageAlert.textContent = 'Ошибка загрузки фотографий!'; // Текст сообщения
  document.body.append(messageAlert); // Добавление уведомления в DOM
};

fetchPhotoData(onSuccess, onFail); // Инициализация загрузки данных приложения

const getPhotos = () => photos.slice(); // Функция получения копии массива фотографий

export { getPhotos }; // Экспорт функции для использования в других модулях
