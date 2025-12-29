const FILE_TYPES = ['jpg', 'jpeg', 'png']; // Массив поддерживаемых форматов изображений

const previewImage = document.querySelector('.img-upload__preview img'); // Основное превью изображения
const effectsPreviews = document.querySelectorAll('.effects__preview'); // Превью для эффектов фильтров

const displaySelectedImage = (file) => { // Отображает выбранное пользователем изображение
  const fileName = file.name.toLowerCase(); // Приведение имени файла к нижнему регистру
  const matches = FILE_TYPES.some((type) => fileName.endsWith(type)); // Проверка формата файла

  if (matches) { // Если формат поддерживается
    const imageUrl = URL.createObjectURL(file); // Создание URL для файла
    previewImage.src = imageUrl; // Установка изображения в основное превью

    effectsPreviews.forEach((preview) => { // Обновление превью для всех эффектов
      preview.style.backgroundImage = `url('${imageUrl}')`; // Установка фонового изображения
    });

    return true; // Успешное отображение
  }

  return false; // Неподдерживаемый формат
};

const clearPreview = () => { // Сбрасывает превью к изображению по умолчанию
  previewImage.src = 'img/upload-default-image.jpg'; // Восстановление основного превью
  effectsPreviews.forEach((preview) => { // Сброс превью для всех эффектов
    preview.style.backgroundImage = 'url("img/upload-default-image.jpg")'; // Восстановление фонового изображения
  });
};

export { displaySelectedImage, clearPreview };
