/**
 * Factory: LoginFactory
 */
angular.module('AuroraApp')
    .factory('LoginFactory', ['$q', '$http', '$location', function LoginFactory($q, $http, $location) {
        'use strict';
        var exports = {};
        exports.data = {};

        exports.getData = function() {
            var deferred = $q.defer();

            $http.get('app/json/emails.json')
                .success(function(data) {
                    exports.data = data;
                    deferred.resolve(data);
                })
                .error(function(data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };

        return exports;
    }]);


/**
 * Factory: HomeFactory
 */
angular.module('AuroraApp')
    .factory('HomeFactory', ['$q', '$http', '$location', '$routeParams', function HomeFactory($q, $http, $location, $routeParams) {
        'use strict';
        var exports = {};
        exports.data = {};

		exports.getData = function() {
			var deferred = $q.defer();

			$http.get('app/json/positions.json')
			    .success(function(data) {
			        exports.data = data;
			        deferred.resolve(data);
			    })
			    .error(function(data) {
			        deferred.reject(data);
			    });
			return deferred.promise;
		};

        return exports;
    }]);

