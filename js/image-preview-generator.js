//Массив поддерживаемых форматов изображений (расширения файлов)
const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png'];

// Элементы DOM для отображения превью изображений
const mainImagePreview = document.querySelector('.img-upload__preview img');
const filterPreviews = document.querySelectorAll('.effects__preview');

//Отображает выбранное пользователем изображение в превью

const displaySelectedImage = (imageFile) => {
  // Приводим имя файла к нижнему регистру для регистронезависимого сравнения
  const imageFileName = imageFile.name.toLowerCase();

  // Проверяем, что расширение файла соответствует поддерживаемым форматам
  const isSupportedFormat = SUPPORTED_IMAGE_FORMATS.some((format) =>
    imageFileName.endsWith(format)
  );

  // Если формат поддерживается, создаем и отображаем изображение
  if (isSupportedFormat) {
    const imageObjectURL = URL.createObjectURL(imageFile);

    // Устанавливаем основное превью изображения
    mainImagePreview.src = imageObjectURL;

    filterPreviews.forEach((filterPreview) => {
      filterPreview.style.backgroundImage = `url('${imageObjectURL}')`;
    });

    return true;
  }

  return false;
};

// Сбрасывает превью изображений к значениям по умолчанию
const clearImagePreview = () => {
  const defaultImageURL = 'img/upload-default-image.jpg';

  // Восстанавливаем основное превью
  mainImagePreview.src = defaultImageURL;

  //Восстанавливаем превью для всех фильтров/эффектов
  filterPreviews.forEach((filterPreview) => {
    filterPreview.style.backgroundImage = `url("${defaultImageURL}")`;
  });
};

export { displaySelectedImage, clearImagePreview };
