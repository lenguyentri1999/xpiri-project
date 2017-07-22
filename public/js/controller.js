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


/* ----------------------- CONTROLLER FOR THE HOME PAGE ---------------------------- */
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

.controller('addPageCtrl', ['$scope', '$state', '$localStorage', 'webNotification',
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



      };
    });

    $scope.getParentScope = function() {
      return $scope;
    };


    // };
    $scope.Remove = function(x){

      $localStorage.selectedFoodList.splice(x, 1);
    };
    $scope.selectedFoodList=$localStorage.selectedFoodList;

    $scope.clearList = function() {
      $localStorage.selectedFoodList=[];
      $scope.selectedFoodList=[];
      $state.reload();
    };

    $scope.clear = function() {
      if ($scope.foodKey.length ===0) {
        delete $scope.foodKey;
      }
    };
  }
])

/* ----------------------- CONTROLLER FOR THE PROGRESS PAGE ---------------------------- */
.controller('progressPageCtrl', ['$scope', '$state',
  function ($scope, $state){
}])


/* ----------------------- CONTROLLER FOR THE MAKE A RECIPE PAGE ---------------------------- */
.controller('recipePageCtrl', ['$scope', '$state', '$http',
  function ($scope, $state, $http){
    $scope.errorMessage = "";
    $scope.successMessage = "";
    $scope.title = "";

    //WHEN THE USER CLICK SUBMIT INGREDIENTS
    $scope.FindRecipe = function()
  {
    if (!$scope.item){
      $scope.errorMessage = "Please add an ingredient";
    }
    else{
      var ListArr = $scope.item.split(",");
      var stringUrl = "";
      for (var i = 0; i < ListArr.length; i++){
        stringUrl += ListArr[i] += "%2C+";
      }
      //GET METHOD TO FIND INGREDIENTS FROM FOOD2FORK
      $http({
        method: 'GET',
        url: 'https://community-food2fork.p.mashape.com/search?key=7c9d9e4fc98c0b81faf9b5527c44e1c5&q=' + stringUrl,
        headers: {
          "X-Mashape-Key": "7KmMenc8lRmshcGvbHEKIagWX3WHp1XarlFjsna1HQNyLnMVlv",
          "Accept": "application/json"
        }
      }).
      then(function success(result){
        console.log(result.data);
        var count = result.data.count;
        if (count === 0) $scope.errorMessage = "Sorry, we could not find anything :(";
        else {
          //OUTPUT THE DATA TO THE USER
          $scope.title = result.data.recipes[0].title;
          $scope.img = result.data.recipes[0].image_url;
          $scope.publisher = result.data.recipes[0].publisher;
          $scope.source = result.data.recipes[0].source_url;

          //SEND THE THE SUCCESS MESSAGE AND A SMILEY FACE!
          $scope.successMessage = "We find you some recipes :)";
           $state.go('recipe');
        }
      });

    }
  };
}]);
