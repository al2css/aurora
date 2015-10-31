AuroraApp.controller('LoginCtrl', ['$scope', '$location', 'LoginFactory', '$routeParams',
    function($scope, $location, LoginFactory, $routeParams) {
        this.title = 'Login Page';
        this.data = {};

        console.log(' THIS IS LOGIN CONTROLLER: ', this);

        LoginFactory.getData()
            .then(angular.bind(this, function then() {
                this.data = LoginFactory.data;
                console.log(this.data);
            }));

        $scope.getClass = function(path) {
            if ($location.path().substr(0, path.length) == path) {
                return "current";
            } else {
                return "";
            }
        };

    }
]);


AuroraApp.controller('HomeCtrl', ['$scope', '$location', 'HomeFactory',
    function($scope, $location, HomeFactory) {
        this.title = 'Homepage';
        $scope.data = {};

        console.log(' THIS IS HOME CONTROLLER: ', this, $scope);

        HomeFactory.getData()
            .then(angular.bind(this, function then() {
                $scope.data = HomeFactory.data;

                // set map start
				L.mapbox.accessToken = 'pk.eyJ1IjoiYWxleGR1bGdoZXJ1IiwiYSI6ImNpZ2U5OTNraDBoNDd2amtyZmNtNjYzam4ifQ.LHqKhNMjBi_jY6KoocLRmg';
				var map = L.mapbox.map('map', 'mapbox.streets')
				    .setView([43.229, -79.453], 5);

				var myLayer = L.mapbox.featureLayer().addTo(map);

				// Add custom popups to each using our custom feature properties
				myLayer.on('layeradd', function(e) {
				    var marker = e.layer,
				        feature = marker.feature;

				    // Create custom popup content
				    var popupContent =  '<a target="_blank" class="popup" href="' + feature.properties.url + '">' +
				                            '<img src="' + feature.properties.image + '" />' +
				                            feature.properties.city +
				                        '</a>';

				    // http://leafletjs.com/reference.html#popup
				    marker.bindPopup(popupContent,{
				        closeButton: false,
				        minWidth: 320
				    });
				});

				// Add features to the map
				myLayer.setGeoJSON($scope.data);
				// set map end

                console.log($scope.data);
            }));

        $scope.getClass = function(path) {
            if ($location.path().substr(0, path.length) == path) {
                return "current";
            } else {
                return "";
            }
        };

    }
]);