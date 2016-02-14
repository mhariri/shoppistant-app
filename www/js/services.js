angular.module('app.services', [])
.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function() {
      var options = {
                  quality : 75,
                  destinationType : Camera.DestinationType.DATA_URL,
                  sourceType : Camera.PictureSourceType.CAMERA,
                  allowEdit : false,
                  encodingType: Camera.EncodingType.JPEG,
                  // targetWidth: 300,
                  // targetHeight: 300,
                  popoverOptions: CameraPopoverOptions,
                  saveToPhotoAlbum: false
              };
      var q = $q.defer();

      if(navigator.camera) {
        navigator.camera.getPicture(function(result) {
          // Do any magic you need
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
.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}]);
