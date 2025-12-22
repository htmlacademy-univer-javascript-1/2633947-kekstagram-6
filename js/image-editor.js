// Добавьте в начало файла
let isSliderInitialized = false;

// Обновите функцию initSlider
function initSlider() {
  if (!effectLevelSlider || isSliderInitialized) {
    return;
  }

  try {
    // Проверяем, доступен ли noUiSlider
    if (typeof noUiSlider === 'undefined') {
      console.warn('noUiSlider не загружен');
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
          return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
        },
        from: function (value) {
          return parseFloat(value);
        }
      }
    });

    isSliderInitialized = true;
    effectLevel.classList.add('hidden');

    effectLevelSlider.noUiSlider.on('update', (values) => {
      const value = values[0];
      if (effectLevelValue) {
        effectLevelValue.value = value;
      }
      applyEffect(value);
    });

  } catch (error) {
    console.error('Ошибка инициализации слайдера:', error);
  }
}

// Обновите функцию onEffectChange
function onEffectChange(evt) {
  if (!evt.target.matches('input[type="radio"]')) {
    return;
  }

  const newEffect = evt.target.value;

  // Инициализируем слайдер, если он еще не инициализирован
  if (!isSliderInitialized && newEffect !== 'none') {
    initSlider();
  }

  currentEffect = newEffect;

  // Сбрасываем масштаб при смене эффекта
  resetScaleToDefault();

  // Обновляем настройки слайдера
  if (newEffect !== 'none' && effectLevelSlider.noUiSlider) {
    updateSliderSettings(newEffect);
  }

  // Применяем эффект
  applyEffect(newEffect === 'none' ? '' : EFFECTS[newEffect].max);
}

// Обновите функцию applyEffect для работы с тестами
function applyEffect(value) {
  const previewImg = document.querySelector('.img-upload__preview img');
  if (!previewImg) {
    return;
  }

  if (currentEffect === 'none' || !value) {
    previewImg.style.filter = 'none';
    if (effectLevel) {
      effectLevel.classList.add('hidden');
    }
    return;
  }

  if (effectLevel) {
    effectLevel.classList.remove('hidden');
  }

  let filterValue = '';
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

  previewImg.style.filter = filterValue;
}
