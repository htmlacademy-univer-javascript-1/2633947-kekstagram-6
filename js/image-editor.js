const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const scaleControl = document.querySelector('.scale__control--value');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const previewImage = document.querySelector('.img-upload__preview img');

const effectLevel = document.querySelector('.img-upload__effect-level');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectsList = document.querySelector('.effects__list');

let currentScale = SCALE_DEFAULT;
let currentEffect = 'none';

const getEffectsSetting = (effectName) => {
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

const executeEffect = (value) => {
  if (currentEffect === 'none') {
    previewImage.style.filter = 'none';
    return;
  }

  const settings = getEffectsSetting(currentEffect);
  previewImage.style.filter = `${settings.filter}(${value}${settings.unit})`;
};

const updateScale = (value) => {
  currentScale = value;

  scaleControl.value = `${value}%`;

  previewImage.style.transform = `scale(${value / 100})`;
};

const onScaleSmallerClick = () => {
  const newValue = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
  updateScale(newValue);
};

const onScaleBiggerClick = () => {
  const newValue = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
  updateScale(newValue);
};

const clearScale = () => {
  updateScale(SCALE_DEFAULT);
};

const initScale = () => {
  scaleSmaller.addEventListener('click', onScaleSmallerClick);
  scaleBigger.addEventListener('click', onScaleBiggerClick);
  clearScale();
};

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
    executeEffect(value);
  });
};

const updateSlider = (effectName) => {
  currentEffect = effectName;

  if (effectName === 'none') {
    effectLevel.classList.add('hidden');
    previewImage.style.filter = 'none';
    effectLevelValue.value = '';
    return;
  }

  effectLevel.classList.remove('hidden');

  const settings = getEffectsSetting(effectName);

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

  executeEffect(settings.max);
};

const onEffectChange = (evt) => {
  if (evt.target.type === 'radio') {
    updateSlider(evt.target.value);
  }
};

const clearEffects = () => {
  currentEffect = 'none';
  previewImage.style.filter = 'none';
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

const initEffects = () => {
  initSlider();
  effectsList.addEventListener('change', onEffectChange);
  clearEffects();
};

const initializateImageEditor = () => {
  initScale();
  initEffects();
};

const resetImageEditor = () => {
  clearScale();
  clearEffects();
};

export { initializateImageEditor, resetImageEditor };
