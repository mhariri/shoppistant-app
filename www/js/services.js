angular.module('app.services', [])
.constant('BACKEND', window.location.search.indexOf("local") < 0 ?
                        "https://shoppistant.appspot.com" :
                        "http://localhost:8080")
.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function() {
      var q = $q.defer();
      if(navigator.camera) {
          var options = {
                      quality : 75,
                      destinationType : Camera.DestinationType.FILE_URI,
                      sourceType : Camera.PictureSourceType.CAMERA,
                      allowEdit : false,
                      encodingType: Camera.EncodingType.JPEG,
                      // targetWidth: 300,
                      // targetHeight: 300,
                      popoverOptions: CameraPopoverOptions,
                      saveToPhotoAlbum: false
                  };
        navigator.camera.getPicture(function(result) {
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, options);
      }else{
          var ff = angular.element("<input type='file' />");
          document.body.appendChild(ff[0]);
          ff[0].click();
          ff.bind('change', function() {
                q.resolve(ff[0].files[0]);
          });
      }

      return q.promise;
    }
  }
}])
.factory('ReceiptsService',
    ['$q', '$http', 'BACKEND', function($q, $http, BACKEND){
    var RECEIPTS_URL = BACKEND + "/v1/receipts";
    return  {
        addPicture: function(imageUri, progressCallback) {
            var q = $q.defer();
            if(typeof FileTransfer !== "undefined") {
                var ft = new FileTransfer();
                ft.upload(RECEIPTS_URL, imageUri)
                  .then(function(result) {
                    // Success!
                    q.resolve(result);

                  }, function(err) {
                    // Error
                    q.reject(err);
                }, progressCallback);
            }else{
                var fd = new FormData();
                fd.append('image', imageUri);
                $http.post(RECEIPTS_URL, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function(){
                    window.setTimeout(function() {
                        q.resolve();
                    }, 2000);
                })
                .error(function(){
                });
            }
          return q.promise;

      },
      getReceipts: function() {
          return $http.get(RECEIPTS_URL);
    }
  };
}])
.factory('RecommendationsService', ['$q', '$http', function($q, $http){
    return  {
      getRecommendations: function() {
          return $http.get("http://shoppistant.appspot.com/v1/recommendations");
    }
  };
}])
.factory('ShoppingList', ['$q', '$localStorage', 'ShoppingListItem',
    function($q, $localStorage, ShoppingListItem){
        var shoppingList = Array.prototype.map.call(
                                $localStorage.getObject("shoppingList")
                                .values || [],
                                ShoppingListItem.fromJson);
        var service = {
          add: function(name) {
              var s = ShoppingListItem.from(name);
              s.setObserver(this);
              shoppingList.push(s);
              this.onChange();
          },
          get: function() {
              return shoppingList;
          },
          remove: function(item) {
              shoppingList.splice(shoppingList.indexOf(item), 1);
              this.onChange();
          },
          onChange: function() {
              $localStorage.setObject("shoppingList",
                {"values": shoppingList.map(ShoppingListItem.toJson)});
          }
        };
        // observe changes of shopping list items
        shoppingList.forEach(function(i) {
            i.setObserver(this);
        }, service);

        return service;
}])
.factory('$localStorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])
.factory('ShoppingListItem', ['$http', function($http) {
    function ShoppingListItem(name, checked) {
        this._name = name;
        this._checked = checked || false;
    };

    ShoppingListItem.prototype = {
      checked: function(value) {
          if(arguments.length) {
              this._checked = value;
              this.notify();
          }
          return this._checked;
      },
      name: function(value) {
          if(arguments.length) {
              this._name = value;
              this.notify();
          }
          return this._name;
      },
      setObserver: function(observer) {
          this._observer = observer;
      },
      notify: function() {
          if(this._observer) {
              this._observer.onChange();
          }
      }
  };
  return {
      from: function(name) {
          return new ShoppingListItem(name);
      },
      fromJson: function(json) {
          return new ShoppingListItem(json.name, json.checked);
      },
      toJson: function(item) {
          return {'name': item.name(), 'checked': item.checked()};
      }
  };
}]);
