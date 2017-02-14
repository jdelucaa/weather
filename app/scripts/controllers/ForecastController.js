/**
 * Created by joana on 11/02/2017.
 */
(function () {
    'use strict';

    angular
        .module('weatherApp')
        .constant("DEFAULT_LOCATION", "Blumenau,SC,Brazil")
        .controller('ForecastController', ForecastController);

    ForecastController.$inject = ['observationService', 'forecastService', 'DEFAULT_LOCATION'];

    function ForecastController(observationService, forecastService, DEFAULT_LOCATION) {

        var vm = this;

        vm.showObservation = false;
        vm.showForecast = false;
        vm.showWeekendForecast = false;

        vm.warm = true;
        vm.rain = false;
        vm.cold = false;

        vm.location = "";
        vm.newLocation = "";
        vm.image = "";
        vm.invalidLocation = false;
        vm.recMsg = "";

        setLocation();
        loadForecasts();

        function setLocation() {
            if (localStorage.getItem('location') === null) {
                vm.location = DEFAULT_LOCATION;
            } else {
                vm.location = localStorage.getItem('location');
            }
        }

        function loadForecasts() {
            vm.observation = observationService.getObservations().get({id: vm.location.trim()})
                .$promise.then(
                    function (response) {
                        vm.observation = response;
                        updateImage();
                        vm.showObservation = true;
                    },
                    function (response) {
                        vm.message = "Error: " + response.status + " " + response.statusText;
                    }
                );

            vm.forecast = forecastService.getForecasts().get({id: vm.location.trim()})
                .$promise.then(
                    function (response) {
                        vm.forecast = response;
                        findMinMaxTemps();
                        vm.showForecast = true;
                    },
                    function (response) {
                        vm.message = "Error: " + response.status + " " + response.statusText;
                    }
                );

            vm.weekendForecast = forecastService.getWeekendForecast().get({id: vm.location.trim()})
                .$promise.then(
                    function (response) {
                        vm.weekendForecast = response;
                        prepareRecomendation();
                        vm.showWeekendForecast = true;
                    },
                    function (response) {
                        vm.message = "Error: " + response.status + " " + response.statusText;
                    }
                );
        }

        vm.saveFavorite = function saveFavorite() {
            localStorage.setItem('location', vm.location.replace("-", ",").trim());
        };

        vm.updateLocation = function updateLocation() {
            var uglyLocation = vm.newLocation;

            if (hasNumbers(uglyLocation)) {
                vm.invalidLocation = true;
            } else {
                vm.invalidLocation = false;
                vm.location = uglyLocation.replace("-", ",").trim();
                loadForecasts();
            }
        };

        function hasNumbers(text) {
            var regex = /\d/g;
            return regex.test(text);
        }

        function prepareRecomendation() {
            var day = vm.weekendForecast.response[0].periods[1];

                var dayWeather = day.weather.toLowerCase(); 

                if (dayWeather.includes('rain') || dayWeather.includes('thunder') || dayWeather.includes('mostly cloudy')) {
                    vm.rain = true;
                    vm.warm = false;
                } else if (dayWeather.includes('snow') || day.maxTempC <= 22) {
                    vm.cold = true;
                    vm.warm = false;
                }     
        }

        function updateImage() {
            var weather = vm.observation.response.ob.weather.toLowerCase();

            if (weather.includes("sunny")) {
                vm.image = "images/sunny.png";
            } else if (weather.includes("rain") || weather.includes("showers")) {
                vm.image = "images/rain.png";
            } else if (weather.includes("thunder")) {
                vm.image = "images/thunder.png";
            } else if (weather.includes("mostly cloudy")) {
                vm.image = "images/cloudy.png";
            } else {
                vm.image = "images/pcloudy.png";
            }
        }

        function findMinMaxTemps() {
            var periods = vm.forecast.response[0].periods;
            var max = 0;
            var min = 99;
            var maxDate = "";
            var minDate = "";

            for (var i = 0; i < periods.length; i++) {
                var day = periods[i];
                if (day.maxTempC > max) {
                    max = day.maxTempC;
                    maxDate = day.validTime;
                }
                if (day.minTempC < min) {
                    min = day.minTempC;
                    minDate = day.validTime;
                }
            }
            vm.max = max;
            vm.maxDate = maxDate;
            vm.min = min;
            vm.minDate = minDate;
        }
    }
})();
