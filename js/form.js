'use strict';
// Модуль, который работает с формой редактирования изображения
(function () {

  // Загрузка изображения и показ формы редактирования
  var uploadPopup = document.querySelector('.upload-overlay');
  var uploadFileForm = document.querySelector('#upload-file');
  var uploadCloser = document.querySelector('.upload-form-cancel');
  var uploadFormDescription = document.querySelector('.upload-form-description');
  var picturePreview = document.querySelector('.upload-form-preview');
  var pictureEffectPreviews = document.querySelectorAll('.upload-effect-preview');
  var picturePreviewImage = picturePreview.querySelector('img');

  var openUploadPopup = function (e) {
    var file = e.target.files[0];
    var readerFile = new FileReader();

    readerFile.addEventListener('loadend', function () {
      picturePreviewImage.src = readerFile.result;
      for (var i = 0; i < pictureEffectPreviews.length; i++) {
        pictureEffectPreviews[i].style.backgroundImage = 'url(' + readerFile.result + ')';
      }
    });

    if (file) {
      readerFile.readAsDataURL(file);

    } else {
      picturePreviewImage.src = '';
    }

    uploadPopup.classList.remove('hidden');
    document.addEventListener('keydown', uploadPopupCloseEscHandler);
    return picturePreviewImage;
  };

  var closeUploadPopup = function () {
    uploadPopup.classList.add('hidden');
    changePreviewClass();
    resetEffect();
  };

  var uploadPopupCloseEscHandler = function (evt) {
    if (evt.keyCode === window.data.ESC_KEYCODE) {
      if (document.activeElement !== uploadFormDescription) {
        closeUploadPopup();
      }
    }
  };

  uploadFileForm.addEventListener('change', function (evt) {
    openUploadPopup(evt);
  });

  uploadCloser.addEventListener('click', function () {
    document.querySelector('#upload-file').value = '';
    closeUploadPopup();
    document.removeEventListener('keydown', uploadPopupCloseEscHandler);
  });

  // Редактирование размера изображения

  var resizeControls = document.querySelector('.upload-resize-controls');
  var declineControlPictureSize = resizeControls.querySelector('.upload-resize-controls-button-dec');
  var increaseControlPictureSize = resizeControls.querySelector('.upload-resize-controls-button-inc');
  var controlPicturePreviewValue = resizeControls.querySelector('.upload-resize-controls-value');

  var pictureSizeValue = 100;
  var maxPictureSize = 100;
  var minPictureSize = 25;

  var changePictureSize = function () {
    controlPicturePreviewValue.setAttribute('value', pictureSizeValue + '%');
    picturePreview.setAttribute('style', 'transform: scale(' + pictureSizeValue / maxPictureSize + ')');
  };

  increaseControlPictureSize.addEventListener('click', function () {
    if (pictureSizeValue < maxPictureSize) {
      pictureSizeValue += minPictureSize;
    }
    changePictureSize();
  });

  declineControlPictureSize.addEventListener('click', function () {
    if (pictureSizeValue > minPictureSize) {
      pictureSizeValue -= minPictureSize;
    }
    changePictureSize();
  });

  // Наложение эффекта на изображение
  // Изменение глубины эффекта перетаскиванием бегунка слайдера

  var uploadEffectControls = document.querySelectorAll('.upload-effect-controls > input');
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

  var changePreviewClass = function () {
    picturePreview.querySelector('img').setAttribute('class', '');
    picturePreview.querySelector('img').setAttribute('class', picturePreviewClass);
  };

  var resetEffect = function () {
    uploadEffectControlsValue.hidden = true;
    picturePreviewImage.removeAttribute('style');
  };
  var setUploadEffectHandler = function (effect) {
    changePreviewClass();
    if (effect !== 'effect-none') {
      picturePreviewImage.style.filter = imagePreviewProperties[effect].effect +
       '(' + imagePreviewProperties[effect].max + imagePreviewProperties[effect].unit + ')';
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

  var mouseMoveHandler = function (evtMove) {
    evtMove.preventDefault();
    if (evtMove.clientX >= lineEffectCoords.left && evtMove.clientX <= lineEffectCoords.right) {
      var shift = (evtMove.clientX - lineEffectCoords.left) * 100 / (lineEffectCoords.right - lineEffectCoords.left);
      effectLevelPin.style.left = shift + '%';
      effectLevelValue.style.width = shift + '%';
      applyEffectLevelPreviewPicture(shift / 100);
    }
  };

  var mouseUpHandler = function (evtUp) {
    evtUp.preventDefault();
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  effectLevelLine.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    mouseMoveHandler(evt);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  // Валидация хэштэгов

  var inputHashtags = document.querySelector('.upload-form-hashtags');
  var maxHashtagsAmount = 5;
  var maxHashtagLength = 20;

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
      if (hashtag.length > maxHashtagLength) {
        target.setCustomValidity('Максимальная длина хэштэга ' + maxHashtagLength + ' символов');
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
      } else if (hashtagCount > maxHashtagsAmount) {
        target.setCustomValidity('Укажите не больше ' + maxHashtagsAmount + ' хэштэгов');
      }
    }
  };

  inputHashtags.addEventListener('input', checkHashtagHandler);
})()
