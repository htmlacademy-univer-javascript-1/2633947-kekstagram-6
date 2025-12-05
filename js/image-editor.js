// Константы
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
const imgUploadPreview = uploadForm.querySelector('.img-upload__preview img');
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
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
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
function resetScale() {
  currentScale = SCALE_DEFAULT;
  updateScale();
}

// Функция применения эффекта
function applyEffect(value) {
  const effect = EFFECTS[currentEffect];

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
  resetScale();

  // Обновляем настройки слайдера
  updateSliderSettings(currentEffect);

  // Применяем эффект с максимальным значением
  const { max } = EFFECTS[currentEffect];
  applyEffect(max);
}

// Функция сброса редактора
function resetEditor() {
  // Сбрасываем масштаб
  resetScale();

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

  // Инициализируем эффект "none" по умолчанию
  updateSliderSettings('none');
}

// Экспортируем функции
export { initImageEditor, resetEditor };
