'use strict';
(function () {
  // Модуль, который работает с галереей изображений. Использует вспомогательные модули: preview.js

  var pictureTemplate = document.querySelector('#picture-template').content; // шаблон для клонирования
  var pictureInsert = document.querySelector('.pictures');

  var createPictureDOMElement = function (picture, index) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('img').src = picture.url;
    pictureElement.querySelector('.picture-likes').textContent = picture.likes;
    pictureElement.querySelector('.picture-comments').textContent = picture.comments;
    pictureElement.querySelector('img').setAttribute('data', index);

    return pictureElement;
  };

  var fragmentForPicture = document.createDocumentFragment(); // фрагмент, состоящий из наполненных клонов шаблона

  for (var i = 0; i < window.data.amountPictures; i++) {
    fragmentForPicture.appendChild(createPictureDOMElement(window.data.picturesPreviews[i], i));
  }

  pictureInsert.appendChild(fragmentForPicture);
})()
