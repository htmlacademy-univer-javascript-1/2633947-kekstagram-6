//Шаг изменения масштаба в процентах
const SCALE_ADJUSTMENT_STEP = 25;

//Минимально допустимое значение масштаба в процентах

const MINIMUM_SCALE_VALUE = 25;

//Максимально допустимое значение масштаба в процентах

const MAXIMUM_SCALE_VALUE = 100;

//Значение масштаба по умолчанию при загрузке

const DEFAULT_SCALE_VALUE = 100;

// Элементы DOM для управления масштабом
const scaleValueDisplay = document.querySelector('.scale__control--value');
const scaleDecreaseButton = document.querySelector('.scale__control--smaller');
const scaleIncreaseButton = document.querySelector('.scale__control--bigger');
const editableImagePreview = document.querySelector('.img-upload__preview img');

// Элементы DOM для управления эффектами
const effectIntensityContainer = document.querySelector('.img-upload__effect-level');
const effectIntensityValue = document.querySelector('.effect-level__value');
const effectIntensitySlider = document.querySelector('.effect-level__slider');
const effectsSelectionList = document.querySelector('.effects__list');

//Текущее значение масштаба изображения (в процентах)

let currentScaleValue = DEFAULT_SCALE_VALUE;

//Текущий выбранный эффект для изображения

let selectedEffect = 'none';

//Возвращает конфигурационные параметры для указанного эффекта
const getEffectConfiguration = (effectType) => {
  switch (effectType) {
    case 'chrome':
      return { min: 0, max: 1, step: 0.1, unit: '', filter: 'grayscale' };
    case 'sepia':
      return { min: 0, max: 1, step: 0.1, unit: '', filter: 'sepia' };
    case 'marvin':
      return { min: 0, max: 100, step: 1, unit: '%', filter: 'invert' };
    case 'phobos':
      return { min: 0, max: 3, step: 0.1, unit: 'px', filter: 'blur' };
    case 'heat':
      return { min: 1, max: 3, step: 0.1, unit: '', filter: 'brightness' };
    default:
      return { min: 0, max: 100, step: 1, unit: '', filter: 'none' };
  }
};

//Применяет визуальный эффект к изображению с заданной интенсивностью

const applyVisualEffect = (intensityValue) => {
  if (selectedEffect === 'none') {
    editableImagePreview.style.filter = 'none';
    return;
  }

  // Получаем конфигурацию для текущего эффекта
  const effectConfiguration = getEffectConfiguration(selectedEffect);

  // Применяем CSS фильтр с указанной интенсивностью
  editableImagePreview.style.filter = `${effectConfiguration.filter}(${intensityValue}${effectConfiguration.unit})`;
};

//Обновляет масштаб изображения и синхронизирует UI

const updateImageScale = (scaleValue) => {
  // Сохраняем текущее значение масштаба
  currentScaleValue = scaleValue;

  // Обновляем отображаемое значение в интерфейсе
  scaleValueDisplay.value = `${scaleValue}%`;

  // Применяем трансформацию масштабирования к изображению
  editableImagePreview.style.transform = `scale(${scaleValue / 100})`;
};

//Обработчик клика по кнопке уменьшения масштаба
const handleScaleDecrease = () => {
  const newScaleValue = Math.max(currentScaleValue - SCALE_ADJUSTMENT_STEP, MINIMUM_SCALE_VALUE);
  updateImageScale(newScaleValue);
};

//Обработчик клика по кнопке увеличения масштаба
const handleScaleIncrease = () => {
  const newScaleValue = Math.min(currentScaleValue + SCALE_ADJUSTMENT_STEP, MAXIMUM_SCALE_VALUE);
  updateImageScale(newScaleValue);
};

//Сбрасывает масштаб изображения к значению по умолчанию
const resetImageScale = () => {
  updateImageScale(DEFAULT_SCALE_VALUE);
};

//Инициализирует элементы управления масштабом изображения
const initializeScaleControls = () => {
  scaleDecreaseButton.addEventListener('click', handleScaleDecrease);
  scaleIncreaseButton.addEventListener('click', handleScaleIncrease);
  resetImageScale();
};

//Инициализирует слайдер для управления интенсивностью эффектов
const initializeEffectSlider = () => {
  // Проверяем наличие библиотеки noUiSlider
  if (typeof noUiSlider === 'undefined') {
    console.warn('Библиотека noUiSlider не загружена');
    return;
  }

  // Проверяем существование элемента слайдера
  if (!effectIntensitySlider) {
    console.error('Элемент слайдера не найден');
    return;
  }

  // Проверяем, не был ли слайдер уже инициализирован
  if (effectIntensitySlider.noUiSlider) {
    return;
  }

  // Создаем экземпляр слайдера с базовыми настройками
  noUiSlider.create(effectIntensitySlider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: (value) => {
        if (selectedEffect === 'chrome' || selectedEffect === 'sepia' ||
            selectedEffect === 'phobos' || selectedEffect === 'heat') {
          return Number(value).toFixed(1);
        }
        return Math.round(value);
      },
      from: (value) => parseFloat(value),
    },
  });

  // Скрываем контейнер интенсивности по умолчанию
  effectIntensityContainer.classList.add('hidden');

  //Обработчик обновления значения слайдера
  effectIntensitySlider.noUiSlider.on('update', () => {
    const intensityValue = effectIntensitySlider.noUiSlider.get();
    effectIntensityValue.value = intensityValue;
    applyVisualEffect(intensityValue);
  });
};

//Обновляет настройки слайдера в соответствии с выбранным эффектом
const updateEffectSliderSettings = (effectType) => {
  selectedEffect = effectType;

  // Если эффект не выбран, скрываем слайдер и сбрасываем фильтры
  if (effectType === 'none') {
    effectIntensityContainer.classList.add('hidden');
    editableImagePreview.style.filter = 'none';
    effectIntensityValue.value = '';
    return;
  }

  effectIntensityContainer.classList.remove('hidden');

  const effectConfiguration = getEffectConfiguration(effectType);

  // Обновляем параметры слайдера
  effectIntensitySlider.noUiSlider.updateOptions({
    range: {
      min: effectConfiguration.min,
      max: effectConfiguration.max,
    },
    start: effectConfiguration.max,
    step: effectConfiguration.step,
  });

  // Устанавливаем слайдер на максимальное значение
  effectIntensitySlider.noUiSlider.set(effectConfiguration.max);
  effectIntensityValue.value = effectConfiguration.max;

  applyVisualEffect(effectConfiguration.max);
};

//Обработчик изменения выбора эффекта

const handleEffectSelection = (event) => {
  if (event.target.type === 'radio') {
    updateEffectSliderSettings(event.target.value);
  }
};

//Сбрасывает все визуальные эффекты к состоянию по умолчанию

const resetVisualEffects = () => {
  selectedEffect = 'none';
  editableImagePreview.style.filter = 'none';
  effectIntensityContainer.classList.add('hidden');
  effectIntensityValue.value = '';

  // Активируем радио-кнопку "Оригинал"
  const noneEffectRadio = document.querySelector('#effect-none');
  if (noneEffectRadio) {
    noneEffectRadio.checked = true;
  }

  // Сбрасываем слайдер к базовым настройкам
  if (effectIntensitySlider.noUiSlider) {
    effectIntensitySlider.noUiSlider.updateOptions({
      range: { min: 0, max: 100 },
      start: 100,
      step: 1,
    });
  }
};

//Инициализирует элементы управления эффектами

const initializeEffectControls = () => {
  initializeEffectSlider();
  effectsSelectionList.addEventListener('change', handleEffectSelection);
  resetVisualEffects();
};

//Основная функция инициализации редактора изображений

const initializeImageEditor = () => {
  initializeScaleControls();
  initializeEffectControls();
};

//Сбрасывает все настройки редактора изображений к состоянию по умолчанию

const resetImageEditorSettings = () => {
  resetImageScale();
  resetVisualEffects();
};

export { initializeImageEditor, resetImageEditorSettings };
