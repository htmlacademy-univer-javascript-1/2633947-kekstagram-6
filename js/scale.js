const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;

function updateScale(value) {
  const scaleControl = document.querySelector('.scale__control--value');
  const previewImg = document.querySelector('.img-upload__preview img');

  if (scaleControl) {
    scaleControl.value = `${value}%`;
  }

  if (previewImg) {
    previewImg.style.transform = `scale(${value / 100})`;
  }
}

function decreaseScale() {
  const scaleControl = document.querySelector('.scale__control--value');
  const currentValue = parseInt(scaleControl.value, 10);
  const newValue = Math.max(currentValue - SCALE_STEP, SCALE_MIN);
  updateScale(newValue);
}

function increaseScale() {
  const scaleControl = document.querySelector('.scale__control--value');
  const currentValue = parseInt(scaleControl.value, 10);
  const newValue = Math.min(currentValue + SCALE_STEP, SCALE_MAX);
  updateScale(newValue);
}

function resetScale() {
  updateScale(SCALE_MAX);
}

export { decreaseScale, increaseScale, resetScale };
