var AuroraApp = angular.module('AuroraApp', ['ngRoute', 'ngTouch', 'ngSanitize', 'ui.bootstrap','LocalStorageModule']);

AuroraApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/login', {
                controller: 'LoginCtrl',
                templateUrl: 'app/partials/_login.html',
                controllerAs: 'login'
            })
            .when('/home', {
                controller: 'HomeCtrl',
                templateUrl: 'app/partials/_home.html',
                controllerAs: 'home'
            })
            .otherwise({
                redirectTo: '/login'
            });
    }
]);