//Main controller for the landing page of the application
app.controller('HomeCtrl', function($anchorScroll, $location, $scope, $http){
	$scope.test = 'We deliver quality and smile to our customers!';
	//Adding code for displaying 'carousal' sample
	$scope.myInterval = 4500;
	$scope.noWrapSlides = false;
	$scope.active = 0;
	var slides = $scope.slides = [];
	var currIndex = 0;

	$scope.addSlide = function() {
		var newWidth = 800 + slides.length + 1;
		slides.push({
		image: '//unsplash.it/' + newWidth + '/500',
		text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
		id: currIndex++
		});
	};

	//Function to send request to server on page load to fetch list
	$scope.getArtImageLinks = function(){
        $http.get('/getArtImages').then(function(response){
        	for(var i = 0; i < response.data.length; i++){
              slides.push({
              	image: response.data[i],
      			text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
              	id: i
              });
        	}
        }, function(error){

        });
	};

	$scope.randomize = function() {
		var indexes = generateIndexesArray();
		assignNewIndexesToSlides(indexes);
	};

	// Randomize logic below

	function assignNewIndexesToSlides(indexes) {
		for (var i = 0, l = slides.length; i < l; i++) {
		slides[i].id = indexes.pop();
		}
	}

	function generateIndexesArray() {
		var indexes = [];
		for (var i = 0; i < currIndex; ++i) {
		indexes[i] = i;
		}
		return shuffle(indexes);
	}

	// http://stackoverflow.com/questions/962802#962890
	function shuffle(array) {
		var tmp, current, top = array.length;

		if (top) {
		while (--top) {
		current = Math.floor(Math.random() * (top + 1));
		tmp = array[current];
		array[current] = array[top];
		array[top] = tmp;
		}
		}

		return array;
	}
	//Code for 'carousal' sample ends here
	//Code for anchor scroll in angular.js
	$scope.gotoAnchor = function(anchorId) {
		if ($location.hash() !== anchorId) {
		// set the $location.hash to `newHash` and
		// $anchorScroll will automatically scroll to it
		$location.hash(anchorId);
		} else {
		// call $anchorScroll() explicitly,
		// since $location.hash hasn't changed
		$anchorScroll();
		}
	};
      //Code for anchor scroll ends here
});