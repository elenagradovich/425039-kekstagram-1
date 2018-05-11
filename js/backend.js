'use strict';

(function () {
  var url = 'https://js.dump.academy/kekstagram';
  /*var CODE = {

  };*/
  var loadData = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json'; // браузер произведет необходимую трансформацию данных сам
    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          window.data = xhr.response;
          onLoad(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;
        default:
          error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = loadData(onLoad, onError);
      xhr.open('GET', url + '/data');
      xhr.send(); // отправка запроса
    },
    save: function (data, onLoad, onError) {
      var xhr = loadData(onLoad, onError);
      xhr.open('POST', url);
      xhr.send(data); // отправка запроса
    }
  };
})();
