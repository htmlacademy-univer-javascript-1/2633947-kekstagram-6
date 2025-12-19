function renderFilteredPhotos(photos, renderFunction) {
  if (typeof renderFunction !== 'function') {
    return;
  }

  const filteredPhotos = getFilteredPhotos(photos, currentFilter);

  // Добавляем класс для анимации (опционально)
  const picturesContainer = document.querySelector('.pictures');
  if (picturesContainer) {
    picturesContainer.classList.add('pictures--updating');
  }

  // Используем requestAnimationFrame для плавного обновления
  requestAnimationFrame(() => {
    renderFunction(filteredPhotos);

    // Убираем класс после отрисовки
    if (picturesContainer) {
      requestAnimationFrame(() => {
        picturesContainer.classList.remove('pictures--updating');
      });
    }
  });
}
