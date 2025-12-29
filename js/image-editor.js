<<<<<<< HEAD
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
=======
const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const EFFECTS = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    unit: ''
  },
  chrome: {
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  sepia: {
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  marvin: {
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%'
  },
  phobos: {
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px'
  },
  heat: {
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: ''
  }
};

// Элементы
const uploadForm = document.querySelector('.img-upload__form');
const uploadFileInput = uploadForm.querySelector('#upload-file');
const imgUploadPreview = uploadForm.querySelector('.img-upload__preview img');
const effectsPreviews = uploadForm.querySelectorAll('.effects__preview');
const scaleControlValue = uploadForm.querySelector('.scale__control--value');
const scaleControlSmaller = uploadForm.querySelector('.scale__control--smaller');
const scaleControlBigger = uploadForm.querySelector('.scale__control--bigger');
const effectsList = uploadForm.querySelector('.effects__list');
const effectLevel = uploadForm.querySelector('.img-upload__effect-level');
const effectLevelSlider = uploadForm.querySelector('.effect-level__slider');
const effectLevelValue = uploadForm.querySelector('.effect-level__value');

// Переменные состояния
let currentScale = SCALE_DEFAULT;
let currentEffect = 'none';

// Инициализация noUiSlider
function initSlider() {
  if (!effectLevelSlider) {
    return;
  }

  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100
>>>>>>> 5b08c58b69231c934818936e0997605e6f8312c9
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
<<<<<<< HEAD
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
=======
      to: function (value) {
        if (Number.isInteger(value)) {
          return value.toFixed(0);
        }
        return value.toFixed(1);
      },
      from: function (value) {
        return parseFloat(value);
      }
    }
  });

  // Скрываем слайдер по умолчанию
  effectLevel.classList.add('hidden');

  // Обработчик изменения слайдера
  effectLevelSlider.noUiSlider.on('update', (values) => {
    const value = values[0];
    effectLevelValue.value = value;
    applyEffect(value);
  });
}

// Функция обновления масштаба
function updateScale() {
  scaleControlValue.value = `${currentScale}%`;
  imgUploadPreview.style.transform = `scale(${currentScale / 100})`;
}

// Функция уменьшения масштаба
function onScaleSmallerClick() {
  currentScale = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
  updateScale();
}

// Функция увеличения масштаба
function onScaleBiggerClick() {
  currentScale = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
  updateScale();
}

// Функция сброса масштаба
function resetScaleToDefault() {
  currentScale = SCALE_DEFAULT;
  updateScale();
}

// Функция применения эффекта
function applyEffect(value) {
  if (currentEffect === 'none') {
    imgUploadPreview.style.filter = 'none';
    effectLevel.classList.add('hidden');
    return;
  }

  effectLevel.classList.remove('hidden');

  let filterValue;
  switch (currentEffect) {
    case 'chrome':
      filterValue = `grayscale(${value})`;
      break;
    case 'sepia':
      filterValue = `sepia(${value})`;
      break;
    case 'marvin':
      filterValue = `invert(${value}%)`;
      break;
    case 'phobos':
      filterValue = `blur(${value}px)`;
      break;
    case 'heat':
      filterValue = `brightness(${value})`;
      break;
    default:
      filterValue = 'none';
  }

  imgUploadPreview.style.filter = filterValue;
}

// Функция обновления настроек слайдера
function updateSliderSettings(effect) {
  if (!effectLevelSlider.noUiSlider) {
    return;
  }

  const { min, max, step } = EFFECTS[effect];

  effectLevelSlider.noUiSlider.updateOptions({
    range: {
      min,
      max
    },
    start: max,
    step
  });

  effectLevelValue.value = max;
}

// Функция обработки изменения эффекта
function onEffectChange(evt) {
  if (!evt.target.matches('input[type="radio"]')) {
    return;
  }

  currentEffect = evt.target.value;

  // Сбрасываем масштаб при смене эффекта
  resetScaleToDefault();

  // Обновляем настройки слайдера
  updateSliderSettings(currentEffect);

  // Применяем эффект с максимальным значением
  const { max } = EFFECTS[currentEffect];
  applyEffect(max);
}

// Функция для загрузки пользовательской фотографии
function loadUserPhoto(file) {
  if (!file || !file.type.startsWith('image/')) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function (evt) {
    // Устанавливаем загруженное изображение в основное поле предпросмотра
    imgUploadPreview.src = evt.target.result;

    // Устанавливаем то же изображение для всех превью эффектов
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url('${evt.target.result}')`;
    });
  };

  reader.readAsDataURL(file);
}

// Функция сброса редактора
function resetEditor() {
  // Сбрасываем масштаб
  resetScaleToDefault();

  // Сбрасываем эффект на "none"
  const noneEffect = uploadForm.querySelector('#effect-none');
  if (noneEffect) {
    noneEffect.checked = true;
  }
  currentEffect = 'none';

  // Сбрасываем фильтр
  imgUploadPreview.style.filter = 'none';

  // Скрываем слайдер
  effectLevel.classList.add('hidden');

  // Сбрасываем значение слайдера
  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.updateOptions({
      range: {
        min: 0,
        max: 100
      },
      start: 100
    });
  }

  // Сбрасываем значение поля
  effectLevelValue.value = '';

  // Сбрасываем изображение на стандартное
  imgUploadPreview.src = '';

  // Сбрасываем превью эффектов
  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = '';
  });
}

// Обработчик изменения файла
function onFileInputChange(evt) {
  const file = evt.target.files[0];

  if (file) {
    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      return;
    }

    // Загружаем фотографию пользователя
    loadUserPhoto(file);
  }
}

// Инициализация модуля
function initImageEditor() {
  // Инициализируем слайдер
  initSlider();

  // Устанавливаем начальный масштаб
  updateScale();

  // Добавляем обработчики для масштабирования
  scaleControlSmaller.addEventListener('click', onScaleSmallerClick);
  scaleControlBigger.addEventListener('click', onScaleBiggerClick);

  // Добавляем обработчик для эффектов
  effectsList.addEventListener('change', onEffectChange);

  // Добавляем обработчик для загрузки файла
  uploadFileInput.addEventListener('change', onFileInputChange);

  // Инициализируем эффект "none" по умолчанию
  updateSliderSettings('none');
}

// Экспортируем функции
export { initImageEditor, resetEditor, loadUserPhoto };
>>>>>>> 5b08c58b69231c934818936e0997605e6f8312c9
