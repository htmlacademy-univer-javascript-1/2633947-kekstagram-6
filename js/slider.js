// slider.js
let slider = null;

function initSlider() {
  const sliderElement = document.querySelector('.effect-level__slider');
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

function resetSlider() {
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
}

export { initSlider, updateSlider, hideSlider, showSlider, resetSlider };
