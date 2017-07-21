app.controller('searchPageCtrl', ['$scope', '$state', '$localStorage', 'webNotification',
  function ($scope, $state, $localStorage, webNotification)
  {
    var ref = firebase.database().ref('freshfruit');
    if (!$localStorage.selectedFruitList){
      $localStorage.selectedFruitList=[];
    }

    console.log($localStorage.selectedFruitList);


    ref.on("value", function(snap){
      $scope.fruitList = snap.val();
    })
    $scope.selectedFruit = function(selected){
      $localStorage.selectedFruitList.push(selected.title);
      var bodyMsg = "You have selected " + selected.title;

      // alert("You have selected " + selected.title);
      webNotification.showNotification('Xpiri', {
        body: bodyMsg

      })
      $state.go('search');
    };
    $scope.Remove = function(x){

      $localStorage.selectedFruitList.splice(x, 1);
    };
    $scope.selectedFruitList=$localStorage.selectedFruitList;


    console.log($scope.selectedFruitList);
    $scope.clearList = function() {
      $localStorage.selectedFruitList=[];
      $scope.selectedFruitList=[];
    }







    }
]);
