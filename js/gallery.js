'use strict';
window.gallery = function (data) {
  // Модуль, который работает с галереей изображений

  var pictureTemplate = document.querySelector('#picture-template').content; // шаблон для клонирования
  var pictureInsert = document.querySelector('.pictures');

  var createPictureDOMElement = function (picture, index) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('img').src = picture.url;
    pictureElement.querySelector('.picture-likes').textContent = picture.likes;
    pictureElement.querySelector('.picture-comments').textContent = picture.comments.length;
    pictureElement.querySelector('img').setAttribute('data', index);

    return pictureElement;
  };

  var fragmentForPicture = document.createDocumentFragment(); // фрагмент, состоящий из наполненных клонов шаблона

  for (var i = 0; i < data.length; i++) {
    fragmentForPicture.appendChild(createPictureDOMElement(data[i], i));
  }
  pictureInsert.appendChild(fragmentForPicture);

  for (i = 0; i < pictureInsert.children.length; i++) {
    var largePhoto = pictureInsert.children[i];
    largePhoto.addEventListener('click', function (evt) {
      window.preview.openPicturePopup(evt, data);
    });

    pictureInsert.children[i].addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.date.ENTER_KEYCODE) {
        window.preview.openPicturePopup();
      }
    });
  }
};
