// Шаг изменения масштаба в процентах
const SCALE_ADJUSTMENT_STEP = 25;
// Минимальное значение масштаба
const MINIMUM_SCALE_VALUE = 25;
// Максимальное значение масштаба
const MAXIMUM_SCALE_VALUE = 100;
// Значение масштаба по умолчанию
const DEFAULT_SCALE_VALUE = 100;

// Поле отображения значения масштаба
const scaleValueDisplay = document.querySelector('.scale__control--intensityValue');
// Кнопка уменьшения масштаба
const scaleDecreaseButton = document.querySelector('.scale__control--smaller');
// Кнопка увеличения масштаба
const scaleIncreaseButton = document.querySelector('.scale__control--bigger');
// Элемент превью изображения
const editableImagePreview = document.querySelector('.img-upload__preview img');

// Контейнер уровня эффекта
const effectIntensityContainer = document.querySelector('.img-upload__effect-level');
// Значение уровня эффекта
const effectIntensityValue = document.querySelector('.effect-level__value');
// Слайдер уровня эффекта
const effectIntensitySlider = document.querySelector('.effect-level__slider');
// Список эффектов
const effectsSelectionList = document.querySelector('.effects__list');

// Текущее значение масштаба
let currentScaleValue = DEFAULT_SCALE_VALUE;
 // Текущий выбранный эффект
let selectedEffect = 'none';

// Возвращает настройки для указанного эффекта
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
    default: // none
      return { min: 0, max: 100, step: 1, unit: '', filter: 'none' };
  }
};

// Применяет выбранный эффект к изображению
const applyVisualEffect = (intensityValue) => {
  if (selectedEffect === 'none') {
    editableImagePreview.style.filter = 'none';
    return;
  }

  // Получение настроек текущего эффекта
  const effectConfiguration = getEffectConfiguration(selectedEffect);
  editableImagePreview.style.filter = `${effectConfiguration.filter}(${intensityValue}${effectConfiguration.unit})`;
};

// Обновляет масштаб изображения
const updateImageScale = (intensityValue) => {
  currentScaleValue = intensityValue;

  scaleValueDisplay.intensityValue = `${intensityValue}%`;

  editableImagePreview.style.transform = `scale(${intensityValue / 100})`;
};

 // Обработчик клика по кнопке уменьшения масштаба
const handleScaleDecrease = () => {
  const newValue = Math.max(currentScaleValue - SCALE_ADJUSTMENT_STEP, MINIMUM_SCALE_VALUE);
  updateImageScale(newValue);
};

// Обработчик клика по кнопке увеличения масштаба
const handleScaleIncrease = () => {
  const newValue = Math.min(currentScaleValue + SCALE_ADJUSTMENT_STEP, MAXIMUM_SCALE_VALUE);
  updateImageScale(newValue);
};

// Сбрасывает масштаб к значению по умолчанию
const resetImageScale = () => {
  updateImageScale(DEFAULT_SCALE_VALUE);
};

// Инициализирует элементы управления масштабом
const initializeScaleControls = () => {
  scaleDecreaseButton.addEventListener('click', handleScaleDecrease);
  scaleIncreaseButton.addEventListener('click', handleScaleIncrease);
  resetImageScale();
};

// Инициализирует слайдер уровня эффекта
const initializeEffectSlider = () => {
  if (typeof noUiSlider === 'undefined') {
    return;
  }

  if (!effectIntensitySlider) {
    return;
  }

  if (effectIntensitySlider.noUiSlider) {
    return;
  }

  // Создание слайдера noUiSlider
  noUiSlider.create(effectIntensitySlider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: (intensityValue) => {

        if (selectedEffect === 'chrome' || selectedEffect === 'sepia' ||
            selectedEffect === 'phobos' || selectedEffect === 'heat') {
          return Number(intensityValue).toFixed(1);
        }

        return Math.round(intensityValue);
      },
      from: (intensityValue) => parseFloat(intensityValue),
    },
  });

  effectIntensityContainer.classList.add('hidden');

  effectIntensitySlider.noUiSlider.on('update', () => {
    const intensityValue = effectIntensitySlider.noUiSlider.get();
    effectIntensityValue.intensityValue = intensityValue;
    applyVisualEffect(intensityValue);
  });
};

// Обновляет слайдер для указанного эффекта
const updateSlider = (effectType) => {
  selectedEffect = effectType;

  if (effectType === 'none') {
    effectIntensityContainer.classList.add('hidden');
    editableImagePreview.style.filter = 'none';
    effectIntensityValue.intensityValue = '';
    return;
  }

  effectIntensityContainer.classList.remove('hidden');
  // Получение настроек эффекта
  const effectConfiguration = getEffectConfiguration(effectType);

  effectIntensitySlider.noUiSlider.updateOptions({
    range: {
      min: effectConfiguration.min,
      max: effectConfiguration.max,
    },
    start: effectConfiguration.max,
    step: effectConfiguration.step,
  });

  effectIntensitySlider.noUiSlider.set(effectConfiguration.max);
  effectIntensityValue.intensityValue = effectConfiguration.max;

  applyVisualEffect(effectConfiguration.max);
};

// Обработчик изменения выбора эффекта
const onEffectChange = (evt) => {
  if (evt.target.type === 'radio') {
    updateSlider(evt.target.intensityValue);
  }
};

// Сбрасывает эффекты к состоянию по умолчанию
const resetVisualEffects = () => {
  selectedEffect = 'none';
  editableImagePreview.style.filter = 'none';
  effectIntensityContainer.classList.add('hidden');
  effectIntensityValue.intensityValue = '';

  const noneEffect = document.querySelector('#effect-none');
  if (noneEffect) {
    noneEffect.checked = true;
  }

  if (effectIntensitySlider.noUiSlider) {
    effectIntensitySlider.noUiSlider.updateOptions({
      range: { min: 0, max: 100 },
      start: 100,
      step: 1,
    });
  }
};

// Сбрасывает эффекты к состоянию по умолчанию
const initializeEffectControls = () => {
  initializeEffectSlider();
  effectsSelectionList.addEventListener('change', onEffectChange);
  resetVisualEffects();
};

// Основная функция инициализации редактора изображений
const initializeImageEditor = () => {
  initializeScaleControls();
  initializeEffectControls();
};

// Сбрасывает все настройки редактора
const resetImageEditorSettings = () => {
  resetImageScale();
  resetVisualEffects();
};

export { initializeImageEditor, resetImageEditorSettings };
