app.filter("emptyifblank", function(){
  return function(object, query) {
    if (!query){
      return {};
    }
    else {
      return object;
    }
  }
});
app.controller('searchPageCtrl', ['$scope', '$state', '$localStorage', 'webNotification',
  function ($scope, $state, $localStorage, webNotification)
  {
    var ref = firebase.database().ref();
    var food = ref.orderByKey();

    if (!$localStorage.selectedFoodList){
      $localStorage.selectedFoodList=[];
    }

    console.log($localStorage.selectedFoodList);


    food.on("value", function(snap){
      $scope.foodDatabase = snap.val();
      $scope.foodKeys = Object.keys($scope.foodDatabase);
      // console.log($scope.foodList);
      // console.log(Object.keys($scope.foodList));
    })

    $scope.getParentScope = function() {
      return $scope;
    }

    $scope.addFood = function(food) {
      $localStorage.selectedFoodList.push(food);
      console.log(food + "is selected");
      var bodyMsg = "You have selected " + food;
      webNotification.showNotification('Xpiri', {
          body: bodyMsg

        })
    }
    // $scope.selectedFruit = function(selected){
    //
    //
    //   // alert("You have selected " + selected.title);
    //
    //   $state.go('search');
    // };
    $scope.Remove = function(x){

      $localStorage.selectedFoodList.splice(x, 1);
    };
    $scope.selectedFoodList=$localStorage.selectedFoodList;

    $scope.clearList = function() {
      $localStorage.selectedFoodList=[];
      $scope.selectedFoodList=[];
    }

    $scope.clear = function() {
      if ($scope.foodKey.length==0) {
        delete $scope.foodKey;
      }
    }






    }
]);
