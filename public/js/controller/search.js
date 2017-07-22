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
    if (!$localStorage.expiryDates){
      $localStorage.expiryDates=[];
    }

    console.log($localStorage.selectedFoodList);


    food.on("value", function(snap){
      $scope.foodDatabase = snap.val();
      $scope.foodKeys = Object.keys($scope.foodDatabase);
      // console.log($scope.foodList);
      // console.log(Object.keys($scope.foodList));
      $scope.addFood = function(food) {
        var foodObj={};
        foodObj.text = food;
        console.log(foodObj.text);
        //foodTimestamp: how long it takes for a food to expire (in seconds)
        foodTimestamp = $scope.foodDatabase[food];

        //GET THE TIMESTAMP OF WHEN THE PERSON ADDED THE FOOD
        var dateTime = Date.now();
        var timestamp = Math.floor(dateTime/1000);

        //GET THE TIMESTAMP OF WHEN THE FOOD WILL EXPIRE
        var expiryDateTimestamp = timestamp + foodTimestamp;

        //CONVERT THAT TIMESTAMP INTO DAYS
        foodObj.day = Math.floor(foodTimestamp/86400);
        $localStorage.selectedFoodList.push(foodObj);


        console.log(foodObj.text + "is selected");
        console.log("timestamp of right now is " + timestamp);
        console.log("timestamp from the database is " + foodTimestamp);
        console.log("timestamp of " + foodObj.text + " is " + expiryDateTimestamp);
        console.log(foodObj.text + " expires in " + foodObj.day + "days");



      }
    })

    $scope.getParentScope = function() {
      return $scope;
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
      $state.reload();
    }

    $scope.clear = function() {
      if ($scope.foodKey.length==0) {
        delete $scope.foodKey;
      }
    }


    }

]);
