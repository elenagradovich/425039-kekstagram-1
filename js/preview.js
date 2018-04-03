'use strict';
// Модуль для отрисовки изображения в полноэкранном режиме
(function () {

  var pictures = document.querySelectorAll('.picture');
  var picturesGallery = document.querySelector('.gallery-overlay');
  var picturesGalleryCloser = picturesGallery.querySelector('.gallery-overlay-close');

  var pictureCloseEscHandler = function (evt) {
    if (evt.keyCode === window.data.ESC_KEYCODE) {
      closePicturePopup();
    }
  };

  var closePicturePopup = function () {
    picturesGallery.classList.add('hidden');
    document.removeEventListener('keydown', pictureCloseEscHandler);
  };


  var openPicturePopup = function (evt, previewPctures) {
    evt.preventDefault();
    var pictureIndex = parseInt(evt.currentTarget.querySelector('img').getAttribute('data'), 10);
    picturesGallery.querySelector('.gallery-overlay-image').src = previewPctures[pictureIndex].url;
    picturesGallery.querySelector('.likes-count').textContent = previewPctures[pictureIndex].likes;
    picturesGallery.querySelector('.comments-count').textContent = previewPctures[pictureIndex].comments;
    picturesGallery.classList.remove('hidden');

    document.addEventListener('keydown', pictureCloseEscHandler);
  };

  for (var i = 0; i < pictures.length; i++) {
    pictures[i].addEventListener('click', function (evt) {
      openPicturePopup(evt, window.data.picturesPreviews);
    });

    pictures[i].addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.data.ENTER_KEYCODE) {
        openPicturePopup();
      }
    });
  }

  picturesGalleryCloser.addEventListener('click', function () {
    closePicturePopup();
  });
})()
