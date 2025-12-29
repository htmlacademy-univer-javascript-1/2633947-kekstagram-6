const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const previewImage = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

// Показать выбранное изображение
const displaySelectedImage = (file) => {
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((type) => fileName.endsWith(type));

  if (matches) {
    const imageUrl = URL.createObjectURL(file);
    previewImage.src = imageUrl;

    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url('${imageUrl}')`;
    });

    return true;
  }

  return false;
};

// Сбросить превью на дефолтное
const clearPreview = () => {
  previewImage.src = 'img/upload-default-image.jpg';
  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = 'url("img/upload-default-image.jpg")';
  });
};

export { displaySelectedImage, clearPreview };
