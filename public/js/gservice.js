// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){

        var googleMapService = {};
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;

        // Array of locations obtained from API calls
        var locations = [];

        // User Selected Location (initialize to center of America)
        var selectedLat = 39.50;
        var selectedLong = -98.35;
		var icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

        // Functions
        // --------------------------------------------------------------
        // Refresh the Map with new data. Takes three parameters (lat, long, and filtering results)
        googleMapService.refresh = function(latitude, longitude, filteredResults){
			console.log('latitude, longitude, filteredResults:::::::'+latitude, longitude, filteredResults);
            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = latitude;
            selectedLong = longitude;

            // If filtered results are provided in the refresh() call...
            if (filteredResults){

                // Then convert the filtered results into map points.
                locations = convertToMapPoints(filteredResults);

                // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
                initialize(latitude, longitude, true);
            }

            // If no filter is provided in the refresh() call...
            else {

                // Perform an AJAX call to get all of the records in the db.
                $http.get('/users').success(function(response){
					console.log('inside gservice:'+JSON.stringify(response));
                    // Then convert the results into map points
                    locations = convertToMapPoints(response);
					
					console.log('locations:'+locations);

                    // Then initialize the map -- noting that no filter was used.
                    initialize(latitude, longitude, false);
                }).error(function(){});
            }
        };

        // Private Inner Functions
        // --------------------------------------------------------------

        // Convert a JSON of users into map points
        var convertToMapPoints = function(response){
			console.log('convertToMapPoints:::response:'+JSON.stringify(response));
            // Clear the locations holder
            var locations = [];

            // Loop through all of the JSON entries provided in the response
            for(var i= 0; i < response.length; i++) {
                var user = response[i];

                // Create popup windows for each record
                var  contentString = '<p><b>Car Number</b>: ' + user.carNumber + '</p>';
				user.pathHistory = JSON.parse(user.pathHistory); 
				
				var pathArray = [];
				
				user.pathHistory.pathHistory.forEach(function(e){
					pathArray.push(new google.maps.LatLng(parseFloat(e.lat), parseFloat(e.lon))); 
				});
				
                // Converts each of the JSON records into Google Maps Location format (Note Lat, Lng format).
                locations.push(
					new Location(
						new google.maps.LatLng(parseFloat(user.pathHistory.pathHistory[0].lat), parseFloat(user.pathHistory.pathHistory[0].lon)),
						new google.maps.LatLng(parseFloat(user.pathHistory.pathHistory[user.pathHistory.pathHistory.length-1].lat), parseFloat(user.pathHistory.pathHistory[user.pathHistory.pathHistory.length-1].lon)),
						new google.maps.InfoWindow({
							content: contentString,
							maxWidth: 320
						}),
						pathArray,
						user.carNumber
					)
				);
            }
			console.log('new locations:'+locations);
            // location is now an array populated with records in Google Maps format
            return locations;
        };

        // Constructor for generic location
        var Location = function(latlon,endLatlon,message,pathArray, carNumber){
            this.latlon = latlon;
			this.endLatlon = endLatlon;
			this.message = message;
			this.pathArray = pathArray;
            this.carNumber = carNumber
        };

        // Initializes the map
        var initialize = function(latitude, longitude, filter) {
			
			    var myLatLng = {lat: 22.012, lng: 56.201};

				// If map has not been created already...
				if (!map){

					// Create a new map and place in the index.html page
					var map = new google.maps.Map(document.getElementById('map'), {
						zoom: 3,
						center: myLatLng
					});
				}

            // Loop through each location in the array and place a marker
            locations.forEach(function(n, i){
				
				var jsonPathData = 
				console.log('value of n:'+n.message);
                var marker = new google.maps.Marker({
                   position: n.latlon,
                   map: map,
                   title: "Big Map",
                   icon: icon,
                });

                // For each marker created, add a listener that checks for clicks
                google.maps.event.addListener(marker, 'click', function(e){

                    // When clicked, open the selected marker's message
                    currentSelectedMarker = n;
                    n.message.open(map, marker);
                });
				
				var endMarker = new google.maps.Marker({
                   position: n.endLatlon,
                   map: map,
                   title: "Big Map",
                   icon: icon,
                });

                // For each marker created, add a listener that checks for clicks
                google.maps.event.addListener(endMarker, 'click', function(e){

                    // When clicked, open the selected marker's message
                    currentSelectedMarker = n;
                    n.message.open(map, endMarker);
                });
				
				console.log('n.latlon,n.endLatlon:'+n.latlon+'---'+n.endLatlon);
				
				var flightPath = new google.maps.Polyline({
				  path: n.pathArray,
				  geodesic: true,
				  strokeColor: getRandomColor(),
				  strokeOpacity: 1.0,
				  strokeWeight: 2
				});

				flightPath.setMap(map);

				
            });
        };
		
		var getRandomColor =  function() {
			var letters = '0123456789ABCDEF';
			var color = '#';
			for (var i = 0; i < 6; i++ ) {
				color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
		}

        // Refresh the page upon window load. Use the initial latitude and longitude
        google.maps.event.addDomListener(window, 'load',
            googleMapService.refresh(selectedLat, selectedLong));

        return googleMapService;
    });

