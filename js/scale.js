const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

let currentScale = SCALE_DEFAULT;

function getCurrentScale() {
  return currentScale;
}

function setScale(newScale) {
  currentScale = Math.max(SCALE_MIN, Math.min(SCALE_MAX, newScale));
}

function increaseScale() {
  setScale(currentScale + SCALE_STEP);
}

function decreaseScale() {
  setScale(currentScale - SCALE_STEP);
}

function resetScale() {
  currentScale = SCALE_DEFAULT;
}

export { getCurrentScale, setScale, increaseScale, decreaseScale, resetScale, SCALE_DEFAULT };
