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
  window.changePreviewClass();
  window.resetEffect();
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
// Изменение глубины эффекта перетаскиванием бегунка слайдера

var uploadEffectControls = document.querySelectorAll('.upload-effect-controls > input');
var picturePreviewImage = picturePreview.querySelector('img');
var picturePreviewClass = picturePreviewImage.getAttribute('class');
var uploadEffectControlsValue = document.querySelector('.upload-effect-level');
var effectLevelLine = uploadEffectControlsValue.querySelector('.upload-effect-level-line');
var effectLevelValue = uploadEffectControlsValue.querySelector('.upload-effect-level-val');
var effectLevelPin = uploadEffectControlsValue.querySelector('.upload-effect-level-pin');
var lineEffectCoords = effectLevelLine.getBoundingClientRect();
var imagePreviewProperties = {
  'effect-chrome': {
    effect: 'grayscale',
    max: 1,
    unit: ''
  },
  'effect-sepia': {
    effect: 'sepia',
    max: 1,
    unit: ''
  },
  'effect-marvin': {
    effect: 'invert',
    max: 100,
    unit: '%'
  },
  'effect-phobos': {
    effect: 'blur',
    max: 3,
    unit: 'px'
  },
  'effect-heat': {
    effect: 'brightness',
    max: 3,
    unit: ''
  }
};

var changePreviewClass = function(){
  picturePreview.querySelector('img').setAttribute('class', '');
  picturePreview.querySelector('img').setAttribute('class', picturePreviewClass);
};

var resetEffect = function() {
  uploadEffectControlsValue.hidden = true;
  picturePreviewImage.removeAttribute('style');
};
var setUploadEffectHandler = function (effect) {
  changePreviewClass();
  if (effect !== 'effect-none') {
    picturePreviewImage.style.filter = imagePreviewProperties[effect].effect + '(' + imagePreviewProperties[effect].max + imagePreviewProperties[effect].unit+ ')';
    uploadEffectControlsValue.removeAttribute('hidden');
    effectLevelPin.style.left = '100%';
    effectLevelValue.style.width = '100%';
    picturePreview.querySelector('img').classList.add(effect);
  } else {
    resetEffect();
  }
};
var changeEffect = function (effect) {
  effect.addEventListener('click', function () {
    setUploadEffectHandler('effect-' + effect.value);
  });
};

for (var i = 0; i < uploadEffectControls.length; i++) {
  changeEffect(uploadEffectControls[i]);
}

var applyEffectLevelPreviewPicture = function (shiftPercent) {
  var previewImageClassName = picturePreviewImage.classList[1];
  var effectValue = (imagePreviewProperties[previewImageClassName].max * shiftPercent).toFixed(2);
  var effectUnit = imagePreviewProperties[previewImageClassName].unit;
  picturePreviewImage.style.filter = imagePreviewProperties[previewImageClassName].effect + '(' + effectValue + effectUnit + ')';
};

effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var mouseMoveHandler = function (evtMove) {
      var lineEffectCoords = effectLevelLine.getBoundingClientRect();
      evtMove.preventDefault();
      if (evtMove.clientX >= lineEffectCoords.left && evtMove.clientX <= lineEffectCoords.right) {
        var shift = (evtMove.clientX - lineEffectCoords.left) * 100 / (lineEffectCoords.right - lineEffectCoords.left);
        effectLevelPin.style.left = shift  + '%';
        effectLevelValue.style.width = shift  + '%';
        applyEffectLevelPreviewPicture(shift / 100);
      }
    };

    var mouseUpHandler = function (evtUp) {
      evtUp.preventDefault();
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }
);

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
      target.setCustomValidity('Максимальная длина хэштэга 20 символов');
      isError = true;
      break;
    } else if (hashtag[0] !== '#') {
      target.setCustomValidity('Хэштэг должен начинаться с символа #');
      isError = true;
      break;
    } else {
      target.setCustomValidity('');
      isError = false;
    }
  }
  if (!isError) {
    if (checkRepetitiveHashtags(hashtagsArray)) {
      target.setCustomValidity('Поле содержит повторяющиеся хэштэги');
    } else if (hashtagCount > 5) {
      target.setCustomValidity('Укажите не больше 5 хэштэгов');
    }
  }
};

inputHashtags.addEventListener('input', checkHashtagHandler);

