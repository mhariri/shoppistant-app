angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



    .state('tabsController.addReceipt', {
      url: '/add_receipt',
      views: {
        'tab4': {
          templateUrl: 'templates/addReceipt.html',
          controller: 'addReceiptCtrl'
        }
      }
    })





    .state('tabsController.history', {
      url: '/history',
      views: {
        'tab5': {
          templateUrl: 'templates/history.html',
          controller: 'historyCtrl'
        }
      }
    })




    .state('tabsController', {
      url: '/tabs',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })

    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tabs/add_receipt');

});
