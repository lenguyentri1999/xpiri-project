angular.module('firebaseConfig', ['firebase'])

.run(function(){

    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyBhLTykFVw44fxAHI2pPUKnei60_nO9NaA",
    authDomain: "animal-guesser-28dcd-6cbe6.firebaseapp.com",
    databaseURL: "https://animal-guesser-28dcd-6cbe6.firebaseio.com",
    projectId: "animal-guesser-28dcd",
    storageBucket: "animal-guesser-28dcd.appspot.com",
    messagingSenderId: "754840513932"
  };
   firebase.initializeApp(config);

});
