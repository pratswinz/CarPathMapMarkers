// Creates the addCtrl Module and Controller. Note that it depends on 'geolocation' and 'gservice' modules.
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Set initial coordinates to the bangalore
    //$scope.formData.longitude = 12.801;
    //$scope.formData.latitude = 77.706;

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data){

        // Set the latitude and longitude equal to the HTML5 coordinates
        //coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textboxes rounded to three decimal points
        //$scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        //$scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

        // Display message confirming that the coordinates verified.
        //$scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";

        //gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    });

    // Functions
    // ----------------------------------------------------------------------------

    // Get coordinates based on mouse click. When a click event is detected....
    //$rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
      //  $scope.$apply(function(){
        //    $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
          //  $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
          //  $scope.formData.htmlverified = "random location";
        //});
    //});

    // Function for refreshing the HTML5 verified location (used by refresh button)
    /*$scope.refreshLoc = function(){
        geolocation.getLocation().then(function(data){
            coords = {lat:data.coords.latitude, long:data.coords.longitude};

            $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
            $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
            $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";
            gservice.refresh(coords.lat, coords.long);
        });
    };*/
	
	function randomIntFromInterval(min,max)
	{
		return Math.floor(Math.random()*(max-min+1)+min);
	}
	
	function createRandomPathHistory(){
		var x = randomIntFromInterval(-30,60);
		var y = randomIntFromInterval(-90,90);
		var pathHistory = {"pathHistory":[]};
		var pathArr = [];
		pathArr.push(latLonObject(x,y));
		pathArr.push(latLonObject(x+2,y+2));
		pathArr.push(latLonObject(x+4,y+5));
		pathArr.push(latLonObject(x+6,y+8));
		pathArr.push(latLonObject(x+5,y+10));
		pathHistory.pathHistory = pathArr;
		
		console.log("pathArr:"+JSON.stringify(pathHistory));
		return pathHistory;
	}
	
	function latLonObject(x,y){
		var latLon = {
						"lat": randomIntFromInterval(x,x+10),
						"lon": randomIntFromInterval(y,y+20)
					};
		console.log("latLon::"+JSON.stringify(latLon));			
		return latLon;		
	}
	
	function getRandomCarNumber(){
		var registration = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var regNum = "0123456789";
		var carNum = returnRandom(registration,2)+ " " + returnRandom(regNum,2) +" " + returnRandom(registration,2)+ " " + returnRandom(regNum,4);
		console.log("carNum:"+carNum);
		return carNum;
	}
	
	function returnRandom(str,len){
		var text = "";
		for( var i=0; i < len; i++ )
			text += str.charAt(Math.floor(Math.random() * str.length));

		return text;
	}

    // Creates a new user based on the form fields
    $scope.createUser = function() {

        // Grabs all of the text box fields
        /*var userData = {
            carNumber: $scope.formData.carNumber,
            location: [$scope.formData.longitude, $scope.formData.latitude],
			endLocation: [$scope.formData.endlongitude, $scope.formData.endlatitude],
            htmlverified: $scope.formData.htmlverified
        };*/
		var userData = {
            carNumber: $scope.formData.carNumber,
            pathHistory: $scope.formData.pathHistory,
            htmlverified: $scope.formData.htmlverified
        };
		
		console.log('in normal add user :'+JSON.stringify(userData));

        // Saves the user data to the db
        saveUserData(userData);
    };
	
	 $scope.createRandomUser = function() {
		var userData = {
            carNumber: getRandomCarNumber(),
            pathHistory: JSON.stringify(createRandomPathHistory()),
            htmlverified: false
        };
		
		console.log('in add random user  :'+JSON.stringify(userData));

        // Saves the user data to the db
        saveUserData(userData);
    };
	
	function saveUserData(userData){
		$http.post('/users', userData)
            .success(function (data) {

                // Once complete, clear the form (except location)
                $scope.formData.CarNumber = "";

                // Refresh the map with new data
                gservice.refresh($scope.formData.pathHistory);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
	}
});

