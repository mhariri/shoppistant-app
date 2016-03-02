angular.module('app.services', [])
.constant('BACKEND', window.location.search.indexOf("local") < 0 ?
                        "https://shoppistant.appspot.com" :
                        "http://localhost:8080")
.constant('DEVICE_ID', window.localStorage["DEVICE_ID"] ||
    // random id generator
    (window.localStorage["DEVICE_ID"]=[0,0,0].map(function(){return Math.random().toString(36).substring(2);}).join(""))
)
.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function() {
      var q = $q.defer();
      if(navigator.camera) {
          var options = {
                      quality : 75,
                      allowEdit : false,
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
    ['$q', '$http', 'BACKEND', 'DEVICE_ID', function($q, $http, BACKEND, DEVICE_ID){
    var RECEIPTS_URL = BACKEND + "/v1/receipts?device_id=" + DEVICE_ID;
    return  {
        addPicture: function(imageUri, progressCallback) {
            var q = $q.defer();
            if(typeof FileTransfer !== "undefined") {
                var options = new FileUploadOptions();
                options.fileKey = "image";
                options.fileName = imageUri.substr(imageUri.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                var ft = new FileTransfer();
                ft.onProgress = progressCallback;
                ft.upload(imageUri, RECEIPTS_URL,
                  function(result) {
                    // Success!
                    q.resolve(result);

                  }, function(err) {
                    // Error
                    q.reject(err);
                }, options);
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
.factory('RecommendationsService', ['$q', '$http', 'DEVICE_ID', function($q, $http, DEVICE_ID){
    return  {
      getRecommendations: function() {
          return $http.get("http://shoppistant.appspot.com/v1/recommendations?device_id=" + DEVICE_ID);
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
