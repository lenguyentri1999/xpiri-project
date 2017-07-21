var app = angular.module('app.controllers',['ngStorage', 'firebase']);
//Handle file input
app.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
})

.controller('homePageCtrl', ['$scope', '$state',
  function ($scope, $state){
}])

.controller('testappPageCtrl', ['$scope', '$state',
  function ($scope, $state){
}]); 
