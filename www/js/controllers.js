angular.module('app.controllers', [])

.controller('receiptsCtrl', function($scope, Camera) {
  $scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      console.log(imageURI);
    }, function(err) {
      console.err(err);
    });
  };
})

.controller('shoppingListCtrl', function($scope) {

})

.controller('recommendationsCtrl', function($scope) {

})
