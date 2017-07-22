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


/* ----------------------- FILTE FOR THE ADD PAGE  ---------------------------- */
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

/* ----------------------- CONTROLLER FOR THE ADD PAGE ---------------------------- */
.controller('addPageCtrl', ['$scope', '$state', '$localStorage', 'webNotification',
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
        if (count == 0) $scope.errorMessage = "Sorry, we could not find anything :(";
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
