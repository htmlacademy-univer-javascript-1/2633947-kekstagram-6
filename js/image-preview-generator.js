const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'png'];

const uploadPreviewImage = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

const openSelectedImage = (file) => {
  const fileTitle = file.name.toLowerCase();
  const matchedItems = IMAGE_FILE_TYPES.some((type) => fileTitle.endsWith(type));

  if (matchedItems) {
    const imageUrl = URL.createObjectURL(file);
    uploadPreviewImage.src = imageUrl;

    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url('${imageUrl}')`;
    });

    return true;
  }

  return false;
};

const clearPreview = () => {
  uploadPreviewImage.src = 'img/upload-default-image.jpg';
  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = 'url("img/upload-default-image.jpg")';
  });
};

export { openSelectedImage, clearPreview };
