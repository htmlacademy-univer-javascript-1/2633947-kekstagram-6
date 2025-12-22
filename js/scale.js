// scale.js
const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;

let currentScale = 100;

function updateScale(value) {
  currentScale = value;
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
  const newScale = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
  updateScale(newScale);
}

function increaseScale() {
  const newScale = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
  updateScale(newScale);
}

function resetScale() {
  updateScale(SCALE_MAX);
}

export { decreaseScale, increaseScale, resetScale, updateScale };
