angular.module('app.routes', ['ui.router'])


.config(function($stateProvider,$urlRouterProvider) {
  $stateProvider

.state('home',{
  name: 'Home Page',
  url: '/homePage',
    templateUrl: 'home.html',
    controller: 'homePageCtrl'
})

.state('testapp',{
  name: 'Test App Page',
  url: '/testappPage',
    templateUrl: 'testapp.html',
    controller: 'testappPageCtrl'
});


$urlRouterProvider.otherwise('/homePage');

});
