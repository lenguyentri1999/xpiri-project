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

.filter("emptyifblank", function(){
  return function(object, query) {
    if (!query){
      return {};
    }
    else {
      return object;
    }
  };
})

.controller('testappPageCtrl', ['$scope', '$state', '$localStorage', 'webNotification',
  function ($scope, $state, $localStorage, webNotification)
  {
    var ref = firebase.database().ref();
    var food = ref.orderByKey();

    if (!$localStorage.selectedFoodList){
      $localStorage.selectedFoodList=[];
    }

    console.log($localStorage.selectedFoodList);

    //------ GET THE SNAPSHOT OF THE FOOD DATABASE--------------------
    food.on("value", function(snap){
      $scope.foodDatabase = snap.val();
      $scope.foodKeys = Object.keys($scope.foodDatabase);
    });

    //------- WHEN CLICK ON NG-REPEAT, IT RETURNS A NEW SCOPE--------
    $scope.getParentScope = function() {
      return $scope;
    };

    //-------- WHEN USER CLICK ON A FOOD, NOTIFICATION RETURN--------
    $scope.addFood = function(food) {
      $localStorage.selectedFoodList.push(food);
      console.log(food + "is selected");
      var bodyMsg = "You have selected " + food;
      webNotification.showNotification('Xpiri', {
          body: bodyMsg

        });
    };

    //------- DELETE FOOD OFF THE LIST -------------------------------
    $scope.Remove = function(x){
      $localStorage.selectedFoodList.splice(x, 1);
    };
    $scope.selectedFoodList=$localStorage.selectedFoodList;

    //--------- ERASE THE FOOD WHEN THE INPUT IS BLANK ---------------
    $scope.clearList = function() {
      $localStorage.selectedFoodList=[];
      $scope.selectedFoodList=[];
    };

    $scope.clear = function() {
      if ($scope.foodKey.length === 0) {
        delete $scope.foodKey;
      }
    };

    }
]);
