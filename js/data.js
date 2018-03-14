'use strict';

// Модуль, который создает данные
(function () {
  var maxAmountPictures =  25;
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
  window.data = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    amountPictures: maxAmountPictures,
    picturesPreviews: arrayPicturesObjects
  }
})()
