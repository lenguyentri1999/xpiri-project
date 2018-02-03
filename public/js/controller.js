var app = angular.module('app.controllers', ['ngStorage', 'firebase']);
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

//-------------------------------- PAGE TO ADD THE FOOD --------------------------
.controller('addPageCtrl', ['$scope', '$state', '$localStorage', 'webNotification',
  function ($scope, $state, $localStorage, webNotification)
  {
    var ref = firebase.database().ref("food");
    var food = ref.orderByKey();

    if (!$localStorage.selectedFoodList){
      $localStorage.selectedFoodList=[];
    }
    else{
        console.log($localStorage.selectedFoodList);
    }
    console.log($localStorage.selectedFoodList);


    food.on("value", function(snap){
      $scope.foodDatabase = snap.val();
      $scope.foodKeys = Object.keys($scope.foodDatabase);
      console.log($scope.foodDatabase);
      $scope.addFood = function(food) {
        var foodObj={};
        foodObj.text = food;

        //foodTimestamp: how long it takes for a food to expire (in seconds)
        foodTimestamp = $scope.foodDatabase[food];
        foodObj.foodTimestamp = foodTimestamp;

        //GET THE TIMESTAMP OF WHEN THE PERSON ADDED THE FOOD
        //timeAdded: timestamp of when user adds the food
        var dateTime = Date.now();
        var timeAdded = Math.floor(dateTime/1000);
        foodObj.timeAdded = timeAdded;
        console.log("User added this food at: " + timeAdded);

        //GET THE TIMESTAMP OF WHEN THE FOOD WILL EXPIRE
        var expiryDateTimestamp = timeAdded + foodTimestamp;
        //STORE WHEN FOOD WILL EXPIRE
        foodObj.expiryDateTimestamp = expiryDateTimestamp;

        //CONVERT THAT TIMESTAMP INTO DAYS
        foodObj.days = Math.floor(foodTimestamp/86400);


        $localStorage.selectedFoodList.push(foodObj);


        //----------------------- CALCULATE TIME STAMP ----------------------- --
        console.log(foodObj.text + "is selected");
        console.log("timestamp of right now is " + timeAdded);
        console.log("timestamp from the database is " + foodTimestamp);
        console.log("timestamp of " + foodObj.text + " is " + expiryDateTimestamp);
        console.log(foodObj.text + " expires in " + foodObj.days + "days");



      };
    });

    //-------- NOT SURE WHAT THIS CODE DOES BUT WITHOUT IT, THE WEBSITE DOESN'T WORK ¯\_(ツ)_/¯
    $scope.getParentScope = function() {
      return $scope;
    };

    //---------------- FUNCTION TO REMOVE FOOD -------------
    $scope.Remove = function(x){
        $localStorage.selectedFoodList.splice(x, 1);
    };
    $scope.selectedFoodList=$localStorage.selectedFoodList;

    //------- CLEAR A LIST OF FOOD -----------
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
.controller('progressPageCtrl', ['$scope', '$state', '$localStorage',
  function ($scope, $state, $localStorage)
{
  //-------- CALCULATING TIME STAMP OF FOOD PROGRESS --------
    $scope.selectedFoodList = $localStorage.selectedFoodList;

    //------ STORE ROTTEN FOOD FOR IMPORT FEATURES ----------
    $localStorage.rottenFoods = [];
    var currentTimestamp = Date.now();
    currentTimestamp = Math.floor(currentTimestamp/1000);


    //------- TAKE INFO OF STORAGE STRING ON THE DATABASE ------
    var statusRef = firebase.database().ref("status");
    var countRef = firebase.database().ref("count");

    //------ VARIABLES TO BE USED -----
    $scope.expiredStr = "";
    $scope.staleStr = "";
    $scope.goodStr = "";
    $scope.e = 0;
    $scope.s = 0;
    $scope.g = 0;



    //--------  A LOOP TO CALCULATE EXPIRATION DATE FOR ALL FOOD OBJECTS -------
    for (i = 0; i<$localStorage.selectedFoodList.length;i++){

      //------------------ CALCULATE EXPIRATION DATE ---------------
      var foodObj = $localStorage.selectedFoodList[i];
      var difference = foodObj.expiryDateTimestamp - currentTimestamp;
      console.log("The difference is: " + difference);
      foodObj.timeLeft = difference;
      foodObj.daysLeft = Math.ceil(difference/86400);
      foodObj.percent = Math.floor(foodObj.daysLeft/foodObj.days*100);
      if (foodObj.percent<30){
        $localStorage.rottenFoods.push(foodObj);
      }

      //--------------------- UPDATE DATA ON FIREBASE ---------------
      var foodName = foodObj.text.substring(0,foodObj.text.indexOf('('));
      var foodRef = firebase.database().ref("storage").child(foodName);
      foodRef.update(foodObj);


      //--------------- UPDATE STATUS DATABASE -----------
      if (foodObj.percent > 70){
          $scope.goodStr = $scope.goodStr + foodName + ",";
          $scope.g += 1;
      }
      else if (foodObj.pecent > 30 ){
          $scope.staleStr = $scope.staleStr + foodName + ",";
          $scope.s += 1;
      }
      else{
          $scope.expiredStr = $scope.expiredStr + foodname;
          $scope.e += 1;
      }
      foodName = "";

    }

    //----------- JUST SOME GRAMMAR STUFF -----------
    if ($scope.expiredStr == "") {$scope.expiredStr = "none";}
    if ($scope.goodStr == "") {$scope.goodStr = "none";}
    if ($scope.staleStr == "") {$scope.staleStr = "none";}

    //----------- UPDATE THE STORAGE DATABASE ----------
    statusRef.update({"good": $scope.goodStr});
    statusRef.update({"stale": $scope.staleStr});
    statusRef.update({"expired": $scope.expiredStr});
    countRef.update({
        "e": $scope.e,
        "g": $scope.g,
        "s": $scope.s
    });


  //----------- FILLING PROGRESS BAR -----------
    $scope.setBar = function(foodObj){
      var widthfood = foodObj.percent - 3 + '%';
      if (foodObj.percent > 70){
        var fresh = {
          'width': widthfood,
          'background-color': '#117A65'
        };
        return fresh;
      }

      //---------- IF FOOD IS STALE --------
      else if (foodObj.percent > 30){
        var stale = {
          'width': widthfood,
          'background-color': '#D35400'
        };
        return stale;
      }

      //-------- IF FOOD IS ROTTEN ----------
      else if(foodObj.percent > 0){
        var rot = {
          'width': widthfood,
          'background-color': '#B03A2E'
        };
        return rot;
      }

      //------- IF FOOD EXPIRED -------------
      else{
        var expired = {
          'width': '0px',
          'background-color': 'black',
          'padding-left': '20px'
        };
        return expired;
      }
    };
}])


/* ----------------------- CONTROLLER FOR THE MAKE A RECIPE PAGE ---------------------------- */
.controller('recipePageCtrl', ['$scope', '$state', '$http', '$localStorage',
  function ($scope, $state, $http, $localStorage){
    $scope.errorMessage = "";
    $scope.successMessage = "";
    $scope.title = "";

    //---------------- GET ROTTEN FOOD TO CREATE A RECIPE --------------------
    $scope.getRottenFoods = function() {
      var str = "";
      if ($localStorage.rottenFoods.length==0){
        $scope.importMessage = "You don't have any stale food. Good job!";
      }
      else{
        for (i = 0; i<$localStorage.rottenFoods.length;i++){
          str+=$localStorage.rottenFoods[i].text;
          str+=", ";
        }
        $scope.item = str.substring(0,str.length-1);
        $scope.importMessage = "All your stale food has been imported!";

      }
      $state.go('recipe');
    }

    //--------------- WHEN THE USER CLICK SUBMIT INGREDIENTS--------------
    $scope.FindRecipe = function(){
    if (!$scope.item){
      $scope.errorMessage = "Please add an ingredient";
    }
    else{
      var ListArr = $scope.item.split(",");
      var stringUrl = "";
      for (var i = 0; i < ListArr.length; i++){
        stringUrl += ListArr[i] += "%2C+";
      }
      //---------------------------------- GET METHOD TO FIND INGREDIENTS FROM FOOD2FORK ----------- ---------------
      $http({
        method: 'GET',
        url: 'https://community-food2fork.p.mashape.com/search?key=7c9d9e4fc98c0b81faf9b5527c44e1c5&q=' + stringUrl,
        headers: {
          "X-Mashape-Key": "7KmMenc8lRmshcGvbHEKIagWX3WHp1XarlFjsna1HQNyLnMVlv",
          "Accept": "application/json"
        }
      })

      //--------------------- IF SUCCESSFULLY GET EXTERNAL API REQUEST ----------------
      .then(function success(result){
        var count = result.data.count;

        //------------------- IF THERE WAS NO RECIPE TO BE FOUND ---------------------
        if (count === 0) $scope.errorMessage = "Sorry, we could not find anything :(";
        else {

          //--------- IF FOUND RECIPE, OUTPUT THE DATA TO THE USER ---------------
          $scope.title = result.data.recipes[0].title;
          $scope.img = result.data.recipes[0].image_url;
          $scope.publisher = result.data.recipes[0].publisher;
          $scope.source = result.data.recipes[0].source_url;

          //--------SEND THE THE SUCCESS MESSAGE AND A SMILEY FACE! --------------
          $scope.successMessage = "We found you some recipes :)";
          firebase.database().ref("recipetitle").set({"title": $scope.title});
          $state.go('recipe');
        }
      });
    }
  };
}])

/* ----------------------- CONTROLLER FOR THE HOME PAGE ---------------------------- */
.controller('blankPageCtrl', ['$scope', '$state',
  function ($scope, $state){
    $scope.progressVal = 50;

}]);
