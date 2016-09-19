//Initializing the application
var app = angular.module('tataeArtsApp', ['ngAnimate','ui.bootstrap']);

//Function to scroll into the anchor by another 0 pixels extra
app.run(['$anchorScroll', function($anchorScroll) {
    $anchorScroll.yOffset = 85;   // always scroll by 0 extra pixels
  }]);