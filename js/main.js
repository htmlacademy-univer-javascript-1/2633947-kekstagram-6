// Импорт модулей приложения
import { fetchPhotoData } from './api.js/index.js';
import { displayPhotoGallery } from './gallery-manager.js';
import './image-filter-engine.js';
import './upload-form-manager.js';


//Глобальное хранилище фотографий приложения
let photoCollection = [];


const handleDataLoadSuccess = (loadedPhotos) => {
  // Сохраняем копию данных в локальное хранилище
  photoCollection = loadedPhotos.slice(); // slice() создает копию массива для неизменяемости оригинальных данных

  // Отрисовываем фотографии на странице
  displayPhotoGallery(photoCollection);

  // Фильтры скрыты по умолчанию до загрузки данных
  document.querySelector('.img-filters').classList.remove('img-filters--inactive');
};


const handleDataLoadError = () => {
  // Создаем элемент для отображения сообщения об ошибке
  const errorNotification = document.createElement('div');

  // Настройка CSS стилей для сообщения об ошибке
  errorNotification.className = 'data-error'; // CSS класс для дополнительного стилирования
  errorNotification.style.position = 'fixed';  // Фиксированное позиционирование
  errorNotification.style.top = '20px';       // Отступ сверху
  errorNotification.style.left = '50%';       // Центрирование по горизонтали
  errorNotification.style.transform = 'translateX(-50%)'; // Точное центрирование
  errorNotification.style.backgroundColor = '#ee3939ff'; // Красный цвет фона
  errorNotification.style.color = 'white';    // Белый цвет текста
  errorNotification.style.padding = '30px 50px'; // Внутренние отступы
  errorNotification.style.borderRadius = '8px'; // Закругленные углы
  errorNotification.style.zIndex = '10000';   // Высокий z-index поверх всех элементов
  errorNotification.style.textAlign = 'center'; // Центрирование текста
  errorNotification.style.fontSize = '20px';  // Размер шрифта
  errorNotification.style.fontFamily = 'Arial, sans-serif'; // Шрифт
  errorNotification.textContent = 'Ошибка загрузки фотографий!'; // Текст сообщения

  // Добавляем сообщение в DOM
  document.body.append(errorNotification);
};


//Инициализация приложения - загрузка данных при старте
fetchPhotoData(handleDataLoadSuccess, handleDataLoadError);

const getPhotoCollection = () => photoCollection.slice();

// Экспорт функции
export { getPhotoCollection };
