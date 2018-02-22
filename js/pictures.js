'use strict';
var maxAmountPictures = 25;
var minAmountLikes = 15;
var maxAmountLikes = 200;
var availableComments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var getRandom = function (minNumber, maxNumber) {
  var random = minNumber + Math.floor(Math.random() * (maxNumber - minNumber));
  return random;
};

var createPictureObject = function (number) {
  return {
    'url': 'photos/' + (number + 1) + '.jpg',
    'likes': getRandom(minAmountLikes, maxAmountLikes),
    'comments': availableComments[getRandom(0, availableComments.length)],
    'data': number
  };
};

var arrayPicturesObjects = [];
for (var i = 0; i < maxAmountPictures; i++) {
  arrayPicturesObjects.push(createPictureObject(i));
}

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
for (i = 0; i < maxAmountPictures; i++) {
  fragmentForPicture.appendChild(createPictureDOMElement(arrayPicturesObjects[i], i));
}

pictureInsert.appendChild(fragmentForPicture);

// Загрузка изображения и показ формы редактирования
var uploadPopup = document.querySelector('.upload-overlay');
var uploadFileForm = document.querySelector('#upload-file');
var uploadCloser = document.querySelector('.upload-form-cancel');
var uploadFormDescription = document.querySelector('.upload-form-description');

var openUploadPopup = function () {
  uploadPopup.classList.remove('hidden');
  document.addEventListener('keydown', uploadPopupCloseEscHandler);
};

var closeUploadPopup = function () {
  uploadPopup.classList.add('hidden');
};

var uploadPopupCloseEscHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    if (document.activeElement !== uploadFormDescription) {
      closeUploadPopup();
    }
  }
};

uploadFileForm.addEventListener('change', function () {
  openUploadPopup();
});

uploadCloser.addEventListener('click', function () {
  document.querySelector('#upload-file').value = '';
  closeUploadPopup();
  document.removeEventListener('keydown', uploadPopupCloseEscHandler);
});


// Показ изображения в полноэкранном режиме
var pictures = document.querySelectorAll('.picture');
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var picturesGallery = document.querySelector('.gallery-overlay');
var picturesGalleryCloser = picturesGallery.querySelector('.gallery-overlay-close');

var pictureCloseEscHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePicturePopup();
  }
};

var closePicturePopup = function () {
  picturesGallery.classList.add('hidden');
  document.removeEventListener('keydown', pictureCloseEscHandler);
};

var openPicturePopup = function (evt) {
  evt.preventDefault();
  var pictureIndex = parseInt(evt.currentTarget.querySelector('img').getAttribute('data'), 10);
  picturesGallery.querySelector('.gallery-overlay-image').src = arrayPicturesObjects[pictureIndex].url;
  picturesGallery.querySelector('.likes-count').textContent = arrayPicturesObjects[pictureIndex].likes;
  picturesGallery.querySelector('.comments-count').textContent = arrayPicturesObjects[pictureIndex].comments;
  picturesGallery.classList.remove('hidden');

  document.addEventListener('keydown', pictureCloseEscHandler);
};

for (i = 0; i < pictures.length; i++) {
  pictures[i].addEventListener('click', function (evt) {
    openPicturePopup(evt);
  });

  pictures[i].addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      openPicturePopup();
    }
  });
}

picturesGalleryCloser.addEventListener('click', function () {
  closePicturePopup();
});

// Применение эффекта для изображения и Редактирование размера изображения
// Изменение масштаба изображения

var resizeControls = document.querySelector('.upload-resize-controls');
var declineControlPictureSize = resizeControls.querySelector('.upload-resize-controls-button-dec');
var increaseControlPictureSize = resizeControls.querySelector('.upload-resize-controls-button-inc');
var controlPicturePreviewValue = resizeControls.querySelector('.upload-resize-controls-value');
var picturePreview = document.querySelector('.upload-form-preview');
var pictureSizeValue = 100;

var changePictureSize = function () {
  controlPicturePreviewValue.setAttribute('value', pictureSizeValue + '%');
  picturePreview.setAttribute('style', 'transform: scale(' + pictureSizeValue / 100 + ')');
};

increaseControlPictureSize.addEventListener('click', function () {
  if (pictureSizeValue < 100) {
    pictureSizeValue += 25;
  }
  changePictureSize();
});

declineControlPictureSize.addEventListener('click', function () {
  if (pictureSizeValue > 25) {
    pictureSizeValue -= 25;
  }
  changePictureSize();
});

// Наложение эффекта на изображение

var uploadEffectControls = document.querySelector('.upload-effect-controls');
var uploadEffectOriginal = uploadEffectControls.querySelector('#upload-effect-none');
var uploadEffectChrome = uploadEffectControls.querySelector('#upload-effect-chrome');
var uploadEffectSepia = uploadEffectControls.querySelector('#upload-effect-sepia');
var uploadEffectMarvin = uploadEffectControls.querySelector('#upload-effect-marvin');
var uploadEffectPhobos = uploadEffectControls.querySelector('#upload-effect-phobos');
var uploadEffectHeat = uploadEffectControls.querySelector('#upload-effect-heat');
var picturePreviewImage = picturePreview.querySelector('img');
var picturePreviewClass = picturePreviewImage.getAttribute('class');
var uploadEffectControlsValue = uploadEffectControls.querySelector('.upload-effect-level');

var setUploadEffectHandler = function (effect) {
  uploadEffectControlsValue.removeAttribute('hidden');
  picturePreview.querySelector('img').setAttribute('class', '');
  picturePreview.querySelector('img').setAttribute('class', picturePreviewClass);
  picturePreview.querySelector('img').classList.add(effect);
};

uploadEffectChrome.addEventListener('click', function () {
  setUploadEffectHandler('effect-chrome');
});

uploadEffectSepia.addEventListener('click', function () {
  setUploadEffectHandler('effect-sepia');
});

uploadEffectMarvin.addEventListener('click', function () {
  setUploadEffectHandler('effect-marvin');
});

uploadEffectPhobos.addEventListener('click', function () {
  setUploadEffectHandler('effect-phobos');
});

uploadEffectHeat.addEventListener('click', function () {
  setUploadEffectHandler('effect-heat');
});

uploadEffectOriginal.addEventListener('click', function () {
  uploadEffectControlsValue.hidden = true;
  picturePreview.querySelector('img').setAttribute('class', '');
  picturePreview.querySelector('img').setAttribute('class', picturePreviewClass);
});



// Валидация хэштэгов

var inputHashtags = document.querySelector('.upload-form-hashtags');

var checkRepetitiveHashtags = function (arrayHashtags) {
  for (i = 0; i < arrayHashtags.length - 2; i++) {
    var element = arrayHashtags[i];
    var value = arrayHashtags.indexOf(element, (i + 1));
    if (value !== -1) {
      return true;
    }
  }
  return false;
};

var checkError = function (comment) {
  inputHashtags.setAttribute('style', 'border: 2px solid red');
  inputHashtags.setCustomValidity(comment);
};

var checkHashtagHandler = function (evt) {
  var target = evt.target;
  var hashtags = target.value.toLowerCase();
  var hashtagsArray = hashtags.split(' ');

  inputHashtags.setCustomValidity('');
  var hashtagCount = hashtagsArray.length;
  var isError = false;
  for (var j = 0; j < hashtagCount; j++) {
    var hashtag = hashtagsArray[j];
    if (hashtag.length === 0) {
      hashtagsArray.splice(j, 1);
      j--;
      hashtagCount--;
      continue;
    }
    if (hashtag.length > 20) {
      checkError('Максимальная длина хэштэга 20 символов');
      isError = true;
      break;
    } else if (hashtag[0] !== '#') {
      checkError('Хэштэг должен начинаться с символа #');
      isError = true;
      break;
    } else {
      inputHashtags.removeAttribute('style', 'border: 2px solid red');
      target.setCustomValidity('');
      isError = false;
    }
  }
  if (!isError) {
    if (checkRepetitiveHashtags(hashtagsArray)) {
      checkError('Поле содержит повторяющиеся хэштэги');
    } else if (hashtagCount > 5) {
      checkError('Укажите не больше 5 хэштэгов');
    } else if (inputHashtags.value === '') {
      inputHashtags.removeAttribute('style', 'border: 2px solid red');
    }
  }
};

inputHashtags.addEventListener('input', checkHashtagHandler);
