'use strict';

// Модуль, который работает с галереей изображений
var pictureInsert = document.querySelector('.pictures');

window.galleryRender = function (data) {
  var pictureTemplate = document.querySelector('#picture-template').content; // шаблон для клонирования

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

    largePhoto.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.date.ENTER_KEYCODE) {
        window.preview.openPicturePopup();
      }
    });
  }
  var filterLabels = filtersForm.querySelectorAll('label');
  for (i = 0; i < filterLabels.length; i++) {
    filterLabels[i].setAttribute('tabindex', 0);
  }
};
// Сортировка данных

var clearGallery = function (gallery) {
  while (gallery.lastChild) {
    gallery.removeChild(gallery.lastChild);
  }
};

var getFilteredPhotos = function (filterClass) {
  var newServerData = window.serverData.slice(0);

  if (filterClass === 'filter-popular') {
    newServerData = newServerData.sort(function (photo1, photo2) {
      return photo2.likes - photo1.likes;
    });
  } else if (filterClass === 'filter-discussed') {
    newServerData = newServerData.sort(function (photo1, photo2) {
      return photo2.comments.length - photo1.comments.length;
    });
  }
  return newServerData;
};

var shuffleArray = function (array) {
  var currentIndex = array.length;
  var indexArr = [];
  var newPhotoArray = [];
  while (currentIndex !== 0) {
    var randomIndex = Math.floor(Math.random() * array.length);
    if (indexArr.indexOf(randomIndex) !== -1) {
      continue;
    }
    indexArr.push(randomIndex);
    currentIndex -= 1;
    newPhotoArray.push(array[randomIndex]);
  }
  return newPhotoArray;
};


var formFilters = {
  'filter-recommend': function () {
    clearGallery(pictureInsert);
    window.galleryRender(window.serverData);
  },
  'filter-popular': function () {
    clearGallery(pictureInsert);
    window.galleryRender(getFilteredPhotos('filter-popular'));
  },
  'filter-discussed': function () {
    clearGallery(pictureInsert);
    window.galleryRender(getFilteredPhotos('filter-discussed'));
  },
  'filter-random': function () {
    clearGallery(pictureInsert);
    window.galleryRender(shuffleArray(window.serverData));
  }
};

var filtersForm = document.querySelector('.filters');
filtersForm.addEventListener('click', function (evt) {
  var filterField = evt.target.getAttribute('for');
  if (filterField) {
    window.debounce(formFilters[filterField]);
  }
});

filtersForm.addEventListener('keydown', function (evt) {
  var filterField = evt.target.getAttribute('for');
  if (evt.keyCode === window.date.ENTER_KEYCODE && filterField) {
    window.debounce(formFilters[filterField]);
  }
});
