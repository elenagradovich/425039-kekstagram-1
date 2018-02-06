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
    'comments': availableComments[getRandom(0, availableComments.length)]
  };
};

var arrayPicturesObjects = [];

for (var i = 0; i < maxAmountPictures; i++) {
  arrayPicturesObjects.push(createPictureObject(i));
}

var pictureTemplate = document.querySelector('#picture-template').content; // шаблон для клонирования
var pictureInsert = document.querySelector('.pictures');

var createPictureDOMElement = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('img').src = picture.url;
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;
  pictureElement.querySelector('.picture-comments').textContent = picture.comments;

  return pictureElement;
};

var fragmentForPicture = document.createDocumentFragment(); // фрагмент, состоящий из наполненных клонов шаблона
for (i = 0; i < maxAmountPictures; i++) {
  fragmentForPicture.appendChild(createPictureDOMElement(arrayPicturesObjects[i]));
}

pictureInsert.appendChild(fragmentForPicture);
var picturesGallery = document.querySelector('.gallery-overlay');


picturesGallery.querySelector('.gallery-overlay-image').src = arrayPicturesObjects[0].url;
picturesGallery.querySelector('.likes-count').textContent = arrayPicturesObjects[0].likes;
picturesGallery.querySelector('.comments-count').textContent = arrayPicturesObjects[0].comments;

picturesGallery.classList.remove('hidden');
