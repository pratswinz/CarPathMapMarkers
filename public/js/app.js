// Declares the initial angular module "intelliCar". Module grabs other controllers and services.
var app = angular.module('intelliCar', ['addCtrl',  'headerCtrl', 'geolocation', 'gservice', 'ngRoute'])

    // Configures Angular routing -- showing the relevant view and controller when needed.
    .config(function($routeProvider){

        // Join Team Control Panel
        $routeProvider.when('/join', {
            controller: 'addCtrl',
            templateUrl: 'partials/addForm.html',

        // Find Teammates Control Panel
        }).otherwise({redirectTo:'/join'})
    });
