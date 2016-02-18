angular.module('app.services', [])
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
        q.resolve("img/test.jpg");
      }

      return q.promise;
    }
  }
}])
.factory('ReceiptsService', ['$q', '$http', function($q, $http){
    return  {
        addPicture: function(imageUri, progressCallback) {
            var q = $q.defer();
            if(typeof FileTransfer !== "undefined") {
                var ft = new FileTransfer();
                ft.upload("http://shoppistant.appspot.com/v1/receipts", imageUri)
                  .then(function(result) {
                    // Success!
                    q.resolve(result);

                  }, function(err) {
                    // Error
                    q.reject(err);
                }, progressCallback);
            }else{
                window.setTimeout(function() {
                    q.resolve();
                }, 3000);
            }
          return q.promise;

      },
      getReceipts: function() {
          return $http.get("http://shoppistant.appspot.com/v1/receipts");
    }
  };
}])
.factory('RecommendationsService', ['$q', '$http', function($q, $http){
    return  {
      getRecommendations: function() {
          return $http.get("http://shoppistant.appspot.com/v1/recommendations");
    }
  };
}]);
