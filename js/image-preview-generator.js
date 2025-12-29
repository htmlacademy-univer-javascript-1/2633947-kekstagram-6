// Массив поддерживаемых форматов изображений
const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png'];
// Основное превью изображения
const mainImagePreview = document.querySelector('.img-upload__preview img');
// Превью для эффектов фильтров
const filterPreviews = document.querySelectorAll('.effects__preview');

 // Отображает выбранное пользователем изображение
const displaySelectedImage = (file) => {
  const imageFileName = file.name.toLowerCase(); // Приведение имени файла к нижнему регистру
  const isSupportedFormat = SUPPORTED_IMAGE_FORMATS.some((type) => imageFileName.endsWith(type)); // Проверка формата файла

  if (isSupportedFormat) {
    const imageObjectURL = URL.createObjectURL(file); // Создание URL для файла
    mainImagePreview.src = imageObjectURL;

    filterPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url('${imageObjectURL}')`;
    });

    return true;
  }

  return false;
};

// Сбрасывает превью к изображению по умолчанию
const clearPreview = () => {
  mainImagePreview.src = 'img/upload-default-image.jpg';
  filterPreviews.forEach((preview) => {
    preview.style.backgroundImage = 'url("img/upload-default-image.jpg")';
  });
};

export { displaySelectedImage, clearPreview };
