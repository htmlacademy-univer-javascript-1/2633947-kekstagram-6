// effects.js
const EFFECTS = {
  none: { min: 0, max: 100, step: 1, filter: '', unit: '' },
  chrome: { min: 0, max: 1, step: 0.1, filter: 'grayscale', unit: '' },
  sepia: { min: 0, max: 1, step: 0.1, filter: 'sepia', unit: '' },
  marvin: { min: 0, max: 100, step: 1, filter: 'invert', unit: '%' },
  phobos: { min: 0, max: 3, step: 0.1, filter: 'blur', unit: 'px' },
  heat: { min: 1, max: 3, step: 0.1, filter: 'brightness', unit: '' }
};

let currentEffect = 'none';
let slider = null;

function initEffects() {
  const effectsList = document.querySelector('.effects__list');
  const effectLevel = document.querySelector('.img-upload__effect-level');

  if (effectsList) {
    effectsList.addEventListener('change', (evt) => {
      if (evt.target.matches('input[type="radio"]')) {
        changeEffect(evt.target.value);
      }
    });
  }

  // Инициализируем слайдер
  const sliderElement = document.querySelector('.effect-level__slider');
  if (sliderElement && typeof noUiSlider !== 'undefined') {
    slider = noUiSlider.create(sliderElement, {
      range: { min: 0, max: 100 },
      start: 100,
      step: 1,
      connect: 'lower'
    });

    slider.on('update', (values) => {
      updateEffect(values[0]);
    });
  }
}

function changeEffect(effect) {
  currentEffect = effect;
  const sliderContainer = document.querySelector('.img-upload__effect-level');

  if (effect === 'none') {
    if (sliderContainer) {
      sliderContainer.classList.add('hidden');
    }
    updateEffect('');
    return;
  }

  if (sliderContainer) {
    sliderContainer.classList.remove('hidden');
  }

  const effectConfig = EFFECTS[effect];
  if (slider && effectConfig) {
    slider.updateOptions({
      range: { min: effectConfig.min, max: effectConfig.max },
      start: effectConfig.max,
      step: effectConfig.step
    });
  }
}

function updateEffect(value) {
  const previewImg = document.querySelector('.img-upload__preview img');
  if (!previewImg) return;

  if (currentEffect === 'none' || !value) {
    previewImg.style.filter = 'none';
    return;
  }

  const effectConfig = EFFECTS[currentEffect];
  if (effectConfig) {
    previewImg.style.filter = `${effectConfig.filter}(${value}${effectConfig.unit})`;
  }
}

export { initEffects, changeEffect, updateEffect };
