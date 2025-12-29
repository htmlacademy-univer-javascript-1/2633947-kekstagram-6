const SCALE_STEP = 25; // Шаг изменения масштаба в процентах
const SCALE_MIN = 25; // Минимальное значение масштаба
const SCALE_MAX = 100; // Максимальное значение масштаба
const SCALE_DEFAULT = 100; // Значение масштаба по умолчанию

const scaleControl = document.querySelector('.scale__control--value'); // Поле отображения значения масштаба
const scaleSmaller = document.querySelector('.scale__control--smaller'); // Кнопка уменьшения масштаба
const scaleBigger = document.querySelector('.scale__control--bigger'); // Кнопка увеличения масштаба
const imagePreview = document.querySelector('.img-upload__preview img'); // Элемент превью изображения

const effectLevel = document.querySelector('.img-upload__effect-level'); // Контейнер уровня эффекта
const effectLevelValue = document.querySelector('.effect-level__value'); // Значение уровня эффекта
const effectLevelSlider = document.querySelector('.effect-level__slider'); // Слайдер уровня эффекта
const effectsList = document.querySelector('.effects__list'); // Список эффектов

let currentScale = SCALE_DEFAULT; // Текущее значение масштаба
let currentEffect = 'none'; // Текущий выбранный эффект

const getEffectSettings = (effectName) => { // Возвращает настройки для указанного эффекта
  switch (effectName) {
    case 'chrome':
      return { min: 0, max: 1, step: 0.1, unit: '', filter: 'grayscale' }; // Настройки эффекта "Хром"
    case 'sepia':
      return { min: 0, max: 1, step: 0.1, unit: '', filter: 'sepia' }; // Настройки эффекта "Сепия"
    case 'marvin':
      return { min: 0, max: 100, step: 1, unit: '%', filter: 'invert' }; // Настройки эффекта "Марвин"
    case 'phobos':
      return { min: 0, max: 3, step: 0.1, unit: 'px', filter: 'blur' }; // Настройки эффекта "Фобос"
    case 'heat':
      return { min: 1, max: 3, step: 0.1, unit: '', filter: 'brightness' }; // Настройки эффекта "Зной"
    default: // none
      return { min: 0, max: 100, step: 1, unit: '', filter: 'none' }; // Настройки по умолчанию (без эффекта)
  }
};

const applyEffect = (value) => { // Применяет выбранный эффект к изображению
  if (currentEffect === 'none') { // Если эффект не выбран
    imagePreview.style.filter = 'none'; // Сброс фильтров
    return;
  }

  const settings = getEffectSettings(currentEffect); // Получение настроек текущего эффекта
  imagePreview.style.filter = `${settings.filter}(${value}${settings.unit})`; // Применение CSS-фильтра
};

const updateScale = (value) => { // Обновляет масштаб изображения
  currentScale = value; // Сохранение нового значения масштаба

  scaleControl.value = `${value}%`; // Обновление отображаемого значения

  imagePreview.style.transform = `scale(${value / 100})`; // Применение трансформации масштаба
};

const onScaleSmallerClick = () => { // Обработчик клика по кнопке уменьшения масштаба
  const newValue = Math.max(currentScale - SCALE_STEP, SCALE_MIN); // Расчет нового значения с учетом минимума
  updateScale(newValue); // Обновление масштаба
};

const onScaleBiggerClick = () => { // Обработчик клика по кнопке увеличения масштаба
  const newValue = Math.min(currentScale + SCALE_STEP, SCALE_MAX); // Расчет нового значения с учетом максимума
  updateScale(newValue); // Обновление масштаба
};

const clearScale = () => { // Сбрасывает масштаб к значению по умолчанию
  updateScale(SCALE_DEFAULT); // Установка масштаба по умолчанию
};

const initScale = () => { // Инициализирует элементы управления масштабом
  scaleSmaller.addEventListener('click', onScaleSmallerClick); // Назначение обработчика уменьшения
  scaleBigger.addEventListener('click', onScaleBiggerClick); // Назначение обработчика увеличения
  clearScale(); // Сброс масштаба к начальному значению
};

const initSlider = () => { // Инициализирует слайдер уровня эффекта
  if (typeof noUiSlider === 'undefined') { // Проверка наличия библиотеки noUiSlider
    return;
  }

  if (!effectLevelSlider) { // Проверка существования элемента слайдера
    return;
  }

  if (effectLevelSlider.noUiSlider) { // Проверка инициализации слайдера
    return;
  }

  noUiSlider.create(effectLevelSlider, { // Создание слайдера noUiSlider
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
    connect: 'lower', // Стиль соединения
    format: {
      to: (value) => { // Форматирование значения для отображения
        if (currentEffect === 'chrome' || currentEffect === 'sepia' ||
            currentEffect === 'phobos' || currentEffect === 'heat') {
          return Number(value).toFixed(1); // Округление до одного знака после запятой
        }
        return Math.round(value); // Округление до целого числа
      },
      from: (value) => parseFloat(value), // Парсинг значения из строки
    },
  });

  effectLevel.classList.add('hidden'); // Скрытие контейнера уровня эффекта

  effectLevelSlider.noUiSlider.on('update', () => { // Обработчик обновления значения слайдера
    const value = effectLevelSlider.noUiSlider.get(); // Получение текущего значения
    effectLevelValue.value = value; // Установка значения в поле
    applyEffect(value); // Применение эффекта с текущим значением
  });
};

const updateSlider = (effectName) => { // Обновляет слайдер для указанного эффекта
  currentEffect = effectName; // Сохранение текущего эффекта

  if (effectName === 'none') { // Если эффект не выбран
    effectLevel.classList.add('hidden'); // Скрытие контейнера
    imagePreview.style.filter = 'none'; // Сброс фильтров
    effectLevelValue.value = ''; // Очистка значения
    return;
  }

  effectLevel.classList.remove('hidden'); // Показ контейнера

  const settings = getEffectSettings(effectName); // Получение настроек эффекта

  effectLevelSlider.noUiSlider.updateOptions({ // Обновление настроек слайдера
    range: {
      min: settings.min,
      max: settings.max,
    },
    start: settings.max, // Начальное значение
    step: settings.step, // Шаг изменения
  });

  effectLevelSlider.noUiSlider.set(settings.max); // Установка значения слайдера
  effectLevelValue.value = settings.max; // Установка значения в поле

  applyEffect(settings.max); // Применение эффекта с максимальным значением
};

const onEffectChange = (evt) => { // Обработчик изменения выбора эффекта
  if (evt.target.type === 'radio') { // Проверка типа элемента
    updateSlider(evt.target.value); // Обновление слайдера для выбранного эффекта
  }
};

const clearEffects = () => { // Сбрасывает эффекты к состоянию по умолчанию
  currentEffect = 'none'; // Сброс текущего эффекта
  imagePreview.style.filter = 'none'; // Сброс фильтров изображения
  effectLevel.classList.add('hidden'); // Скрытие контейнера уровня эффекта
  effectLevelValue.value = ''; // Очистка значения

  const noneEffect = document.querySelector('#effect-none'); // Поиск радио-кнопки "Оригинал"
  if (noneEffect) {
    noneEffect.checked = true; // Активация кнопки "Оригинал"
  }

  if (effectLevelSlider.noUiSlider) { // Проверка инициализации слайдера
    effectLevelSlider.noUiSlider.updateOptions({ // Сброс настроек слайдера
      range: { min: 0, max: 100 },
      start: 100,
      step: 1,
    });
  }
};

const initEffects = () => { // Инициализирует элементы управления эффектами
  initSlider(); // Инициализация слайдера
  effectsList.addEventListener('change', onEffectChange); // Назначение обработчика выбора эффекта
  clearEffects(); // Сброс эффектов к начальному состоянию
};

const initializeImageEditor = () => { // Основная функция инициализации редактора изображений
  initScale(); // Инициализация масштаба
  initEffects(); // Инициализация эффектов
};

const resetImageEditorSettings = () => { // Сбрасывает все настройки редактора
  clearScale(); // Сброс масштаба
  clearEffects(); // Сброс эффектов
};

export { initializeImageEditor, resetImageEditorSettings }; // Экспорт функций инициализации и сброса
