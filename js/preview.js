'use strict';
// Модуль для отрисовки изображения в полноэкранном режиме
(function () {

  var picturesGallery = document.querySelector('.gallery-overlay');
  var picturesGalleryCloser = picturesGallery.querySelector('.gallery-overlay-close');
  window.preview = {
    pictureCloseEscHandler: function (evt) {
      if (evt.keyCode === window.date.ESC_KEYCODE) {
        window.preview.closePicturePopup();
      }
    },
    closePicturePopup: function () {
      picturesGallery.classList.add('hidden');
      document.removeEventListener('keydown', window.preview.pictureCloseEscHandler);
    },
    openPicturePopup: function (evt, previewPictures) {
      evt.preventDefault();
      var pictureIndex = parseInt(evt.currentTarget.querySelector('img').getAttribute('data'), 10);
      picturesGallery.querySelector('.gallery-overlay-image').src = previewPictures[pictureIndex].url;
      picturesGallery.querySelector('.likes-count').textContent = previewPictures[pictureIndex].likes;
      picturesGallery.querySelector('.comments-count').textContent = previewPictures[pictureIndex].comments.length;
      picturesGallery.classList.remove('hidden');
      document.addEventListener('keydown', window.preview.pictureCloseEscHandler);
    }
  };
  picturesGalleryCloser.addEventListener('click', function () {
    window.preview.closePicturePopup();
  });
})();
