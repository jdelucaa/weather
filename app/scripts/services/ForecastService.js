/**
 * Created by joana on 11/02/2017.
 */
(function () {
    'use strict';

    angular
        .module('weatherApp')
        .constant("BASE_URL", "http://api.aerisapi.com/")
        .constant("CLIENT_ID", "f8f39QDiA7Yo0Q32oZcbb")
        .constant("CLIENT_PASS", "WXgU1OyulTT4IBswo1rlFAMbYt7jd0sNRDExhH3O")
        .factory('forecastService', forecastService);

    forecastService.$inject = ['$resource', 'BASE_URL', 'CLIENT_ID', 'CLIENT_PASS'];

    function forecastService($resource, BASE_URL, CLIENT_ID, CLIENT_PASS) {

        return {
            getForecasts: getForecasts,
            getWeekendForecast: getWeekendForecast
        };

        function getForecasts() {
            return $resource(BASE_URL + "forecasts/:id?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_PASS + "", null);
        }

        function getWeekendForecast() {
            return $resource(BASE_URL + "forecasts/:id?from=saturday&to=+1days&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_PASS + "", null);
        }
    }
})();