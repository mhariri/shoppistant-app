angular.module('app.controllers', [])

.controller('receiptsCtrl', function($scope, Camera, ReceiptsService) {
  $scope.addReceipt = function() {
    Camera.getPicture().then(function(imageUri) {
      console.log(imageUri);
      $scope.isUploading = true;
      ReceiptsService.addPicture(imageUri, function(progress) {

      }).then(function() {
          $scope.isUploading = false;

      }, function(err) {
          $scope.isUploading = false;

      });


    }, function(err) {
      console.err(err);
    });
  };
  $scope.refreshReceipts = function() {
    ReceiptsService.getReceipts().then(function(response) {
        $scope.receipts = response.data;
        for(receipt in $scope.receipts) {
            $scope.receipts[receipt].date = new Date($scope.receipts[receipt].date);
        }
        $scope.$broadcast('scroll.refreshComplete');

    });
  };
  $scope.refreshReceipts();
})

.controller('shoppingListCtrl', function($scope, ShoppingList) {
    $scope.getShoppingList = function() { return ShoppingList.get(); };
    $scope.clearChecked = function() {
        ShoppingList.get()
            .filter(function(i) { return i.checked()})
            .forEach(function(i) { ShoppingList.remove(i); });
    }
})

.controller('recommendationsCtrl', function($scope, RecommendationsService,
                                            ShoppingList) {
    $scope.refreshRecommendations = function() {
      RecommendationsService.getRecommendations().then(function(response) {
          $scope.recommendations = response.data;
          $scope.$broadcast('scroll.refreshComplete');

      });
    };
    $scope.addToShoppingList = function(name) {
        ShoppingList.add(name);
    }
    $scope.refreshRecommendations();
})
