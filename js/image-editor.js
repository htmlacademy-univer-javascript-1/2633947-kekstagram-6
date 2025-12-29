// Шаг изменения масштаба в процентах
const SCALE_STEP = 25;
// Минимальное значение масштаба
const SCALE_MIN = 25;
// Максимальное значение масштаба
const SCALE_MAX = 100;
// Значение масштаба по умолчанию
const SCALE_DEFAULT = 100;

// Поле отображения значения масштаба
const scaleControl = document.querySelector('.scale__control--value');
// Кнопка уменьшения масштаба
const scaleSmaller = document.querySelector('.scale__control--smaller');
// Кнопка увеличения масштаба
const scaleBigger = document.querySelector('.scale__control--bigger');
// Элемент превью изображения
const imagePreview = document.querySelector('.img-upload__preview img');

// Контейнер уровня эффекта
const effectLevel = document.querySelector('.img-upload__effect-level');
// Значение уровня эффекта
const effectLevelValue = document.querySelector('.effect-level__value');
// Слайдер уровня эффекта
const effectLevelSlider = document.querySelector('.effect-level__slider');
// Список эффектов
const effectsList = document.querySelector('.effects__list');

// Текущее значение масштаба
let currentScale = SCALE_DEFAULT;
 // Текущий выбранный эффект
let currentEffect = 'none';

// Возвращает настройки для указанного эффекта
const getEffectSettings = (effectName) => {
  switch (effectName) {
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
const applyEffect = (value) => {
  if (currentEffect === 'none') {
    imagePreview.style.filter = 'none';
    return;
  }

  // Получение настроек текущего эффекта
  const settings = getEffectSettings(currentEffect);
  imagePreview.style.filter = `${settings.filter}(${value}${settings.unit})`;
};

// Обновляет масштаб изображения
const updateScale = (value) => {
  currentScale = value;

  scaleControl.value = `${value}%`;

  imagePreview.style.transform = `scale(${value / 100})`;
};

 // Обработчик клика по кнопке уменьшения масштаба
const onScaleSmallerClick = () => {
  const newValue = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
  updateScale(newValue);
};

// Обработчик клика по кнопке увеличения масштаба
const onScaleBiggerClick = () => {
  const newValue = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
  updateScale(newValue);
};

// Сбрасывает масштаб к значению по умолчанию
const clearScale = () => {
  updateScale(SCALE_DEFAULT);
};

// Инициализирует элементы управления масштабом
const initScale = () => {
  scaleSmaller.addEventListener('click', onScaleSmallerClick);
  scaleBigger.addEventListener('click', onScaleBiggerClick);
  clearScale();
};

// Инициализирует слайдер уровня эффекта
const initSlider = () => {
  if (typeof noUiSlider === 'undefined') {
    return;
  }

  if (!effectLevelSlider) {
    return;
  }

  if (effectLevelSlider.noUiSlider) {
    return;
  }

  // Создание слайдера noUiSlider
  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: (value) => {

        if (currentEffect === 'chrome' || currentEffect === 'sepia' ||
            currentEffect === 'phobos' || currentEffect === 'heat') {
          return Number(value).toFixed(1);
        }

        return Math.round(value);
      },
      from: (value) => parseFloat(value),
    },
  });

  effectLevel.classList.add('hidden');

  effectLevelSlider.noUiSlider.on('update', () => {
    const value = effectLevelSlider.noUiSlider.get();
    effectLevelValue.value = value;
    applyEffect(value);
  });
};

// Обновляет слайдер для указанного эффекта
const updateSlider = (effectName) => {
  currentEffect = effectName;

  if (effectName === 'none') {
    effectLevel.classList.add('hidden');
    imagePreview.style.filter = 'none';
    effectLevelValue.value = '';
    return;
  }

  effectLevel.classList.remove('hidden');
  // Получение настроек эффекта
  const settings = getEffectSettings(effectName);

  effectLevelSlider.noUiSlider.updateOptions({
    range: {
      min: settings.min,
      max: settings.max,
    },
    start: settings.max,
    step: settings.step,
  });

  effectLevelSlider.noUiSlider.set(settings.max);
  effectLevelValue.value = settings.max;

  applyEffect(settings.max);
};

// Обработчик изменения выбора эффекта
const onEffectChange = (evt) => {
  if (evt.target.type === 'radio') {
    updateSlider(evt.target.value);
  }
};

// Сбрасывает эффекты к состоянию по умолчанию
const clearEffects = () => {
  currentEffect = 'none';
  imagePreview.style.filter = 'none';
  effectLevel.classList.add('hidden');
  effectLevelValue.value = '';

  const noneEffect = document.querySelector('#effect-none');
  if (noneEffect) {
    noneEffect.checked = true;
  }

  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.updateOptions({
      range: { min: 0, max: 100 },
      start: 100,
      step: 1,
    });
  }
};

// Сбрасывает эффекты к состоянию по умолчанию
const initEffects = () => {
  initSlider();
  effectsList.addEventListener('change', onEffectChange);
  clearEffects();
};

// Основная функция инициализации редактора изображений
const initializeImageEditor = () => {
  initScale();
  initEffects();
};

// Сбрасывает все настройки редактора
const resetImageEditorSettings = () => {
  clearScale();
  clearEffects();
};

export { initializeImageEditor, resetImageEditorSettings };
