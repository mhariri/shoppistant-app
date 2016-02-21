angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



    .state('tabsController.receipts', {
    url: '/receipts',
    views: {
      'tab4': {
        templateUrl: 'templates/receipts.html',
        controller: 'receiptsCtrl'
      }
    }
  })





  .state('tabsController.history', {
    url: '/shoppingList',
    views: {
      'tab5': {
        templateUrl: 'templates/shoppingList.html',
        controller: 'shoppingListCtrl'
      }
    }
  })

  .state('tabsController.recommendations', {
    url: '/recommendations',
    views: {
      'tab6': {
        templateUrl: 'templates/recommendations.html',
        controller: 'recommendationsCtrl'
      }
    }
  })




  .state('tabsController', {
    url: '/tabs',
    abstract: true,
    templateUrl: 'templates/tabsController.html'
  })

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tabs/shoppingList');

});
