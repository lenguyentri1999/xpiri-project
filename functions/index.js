const functions = require('firebase-functions');
const messaging = firebase.messaging();
messaging.requestPermission()
  .then(function() {
    console.log("I now have permission!");
  })

exports.alertFoodStatus = functions.database
  .ref('/freshfruit')
  .onWrite(event=> {

  })
