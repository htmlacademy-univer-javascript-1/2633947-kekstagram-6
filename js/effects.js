const EFFECTS = {
  none: { min: 0, max: 100, step: 1, filter: '', unit: '', start: 100 },
  chrome: { min: 0, max: 1, step: 0.1, filter: 'grayscale', unit: '', start: 1 },
  sepia: { min: 0, max: 1, step: 0.1, filter: 'sepia', unit: '', start: 1 },
  marvin: { min: 0, max: 100, step: 1, filter: 'invert', unit: '%', start: 100 },
  phobos: { min: 0, max: 3, step: 0.1, filter: 'blur', unit: 'px', start: 3 },
  heat: { min: 1, max: 3, step: 0.1, filter: 'brightness', unit: '', start: 3 }
};

let currentEffect = 'none';
let slider = null;

function initSlider() {
  const sliderElement = document.querySelector('.effect-level__slider');
  const sliderContainer = document.querySelector('.img-upload__effect-level');

  if (!sliderElement) {
    return;
  }

  // Удаляем существующий слайдер, если он есть
  if (sliderElement.noUiSlider) {
    sliderElement.noUiSlider.destroy();
  }

  // Создаем новый слайдер
  slider = noUiSlider.create(sliderElement, {
    range: {
      min: 0,
      max: 100
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: function(value) {
        return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
      },
      from: function(value) {
        return parseFloat(value);
      }
    }
  });

  // Скрываем слайдер по умолчанию
  sliderContainer.classList.add('hidden');

  // Обработчик обновления слайдера
  slider.on('update', (values) => {
    const value = values[0];
    updateEffectValue(value);
  });
}

function updateSlider(min, max, step, start) {
  if (!slider) {
    return;
  }

  slider.updateOptions({
    range: {
      min: min,
      max: max
    },
    step: step,
    start: start
  });
}

function hideSlider() {
  const sliderContainer = document.querySelector('.img-upload__effect-level');
  if (sliderContainer) {
    sliderContainer.classList.add('hidden');
  }
}

function showSlider() {
  const sliderContainer = document.querySelector('.img-upload__effect-level');
  if (sliderContainer) {
    sliderContainer.classList.remove('hidden');
  }
}

function updateEffectValue(value) {
  const effectConfig = EFFECTS[currentEffect];
  if (effectConfig && effectConfig.filter) {
    const previewImg = document.querySelector('.img-upload__preview img');
    if (previewImg) {
      previewImg.style.filter = `${effectConfig.filter}(${value}${effectConfig.unit})`;
    }

    // Обновляем скрытое поле
    const effectLevelValue = document.querySelector('.effect-level__value');
    if (effectLevelValue) {
      effectLevelValue.value = value;
    }
  }
}

function onEffectChange(evt) {
  if (!evt.target.matches('input[type="radio"]')) {
    return;
  }

  const effect = evt.target.value;
  currentEffect = effect;

  const previewImg = document.querySelector('.img-upload__preview img');
  if (!previewImg) {
    return;
  }

  if (effect === 'none') {
    hideSlider();
    previewImg.style.filter = 'none';
    return;
  }

  const effectConfig = EFFECTS[effect];
  if (effectConfig) {
    showSlider();
    updateSlider(effectConfig.min, effectConfig.max, effectConfig.step, effectConfig.start);
    updateEffectValue(effectConfig.start);
  }
}

function resetEffects() {
  // Сбрасываем выбор эффекта
  const noneEffect = document.querySelector('#effect-none');
  if (noneEffect) {
    noneEffect.checked = true;
  }

  currentEffect = 'none';
  hideSlider();

  // Сбрасываем фильтр
  const previewImg = document.querySelector('.img-upload__preview img');
  if (previewImg) {
    previewImg.style.filter = 'none';
  }

  // Сбрасываем слайдер
  if (slider) {
    slider.updateOptions({
      range: {
        min: 0,
        max: 100
      },
      start: 100,
      step: 1
    });
  }

  // Сбрасываем скрытое поле
  const effectLevelValue = document.querySelector('.effect-level__value');
  if (effectLevelValue) {
    effectLevelValue.value = '';
  }
}

function initEffects() {
  // Инициализируем слайдер
  if (typeof noUiSlider !== 'undefined') {
    initSlider();
  }

  // Добавляем обработчики на радиокнопки эффектов
  const effectsList = document.querySelector('.effects__list');
  if (effectsList) {
    effectsList.addEventListener('change', onEffectChange);
  }

  // Устанавливаем эффект по умолчанию
  resetEffects();
}

export { initEffects, resetEffects };
