'use strict';
angular.module('weatherApp', ['ui.router', 'ngResource', 'googlechart'])

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: 'views/header.html'
                    },
                    'content': {
                        templateUrl: 'views/home.html',
                        controller: 'ForecastController',
                        controllerAs: 'vm'
                    },
                    'footer': {
                        templateUrl: 'views/footer.html'
                    }
                }
            });
        $urlRouterProvider.otherwise('/');
    });
