/**
 * Created by joana on 11/02/2017.
 */
(function () {
    'use strict';

    angular
        .module('weatherApp')
        .constant("DEFAULT_LOCATION", "Blumenau,SC,Brazil")
        .controller('ForecastController', ForecastController);

    ForecastController.$inject = ['observationService', 'forecastService', 'DEFAULT_LOCATION', '$filter', '$scope', '$log'];

    function ForecastController(observationService, forecastService, DEFAULT_LOCATION, $filter, $scope, $log) {

        var vm = this;

        vm.showObservation = false;
        vm.showForecast = false;
        vm.showWeekendForecast = false;
        vm.myChartObject = {};
        vm.lineChart = lineChart;

        vm.newLocation = "";
        vm.location = "";
        vm.image = "";
        vm.invalidLocation = false;

        vm.warmRecommends = ['Beach','Beer','Open Air Activities'];
        vm.coldRecommends = ['Hot Chocolate','Movies','Warm Clothes'];
        vm.rainRecommends = ['Movies','Umbrella'];

        vm.saveFavorite = saveFavorite;

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
                        vm.obsTempC = vm.observation.response.ob.tempC;
                        vm.obsWeather = vm.observation.response.ob.weather;
                        vm.obsHumidity = vm.observation.response.ob.humidity; 
                        vm.obsPressure = vm.observation.response.ob.pressureMB;
                        vm.obsWind = vm.observation.response.ob.windKPH;
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
                        loadChart();
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
                        vm.satMinTemp = vm.weekendForecast.response[0].periods[0].minTempC;
                        vm.satMaxTemp = vm.weekendForecast.response[0].periods[0].maxTempC;
                        vm.sunMinTemp = vm.weekendForecast.response[0].periods[1].minTempC;
                        vm.sunMaxTemp = vm.weekendForecast.response[0].periods[1].maxTempC;
                        prepareRecomendation();
                        vm.showWeekendForecast = true;
                    },
                    function (response) {
                        vm.message = "Error: " + response.status + " " + response.statusText;
                    }
                );
        }
        
        function saveFavorite() {
            localStorage.setItem('location', vm.location.replace("-", ",").trim());
        };

        $scope.$watch('forecastCtrl.newLocation', function(current, original) {
            $log.info('forecastCtrl.newLocation was %s', original);
            $log.info('forecastCtrl.newLocation is now %s', current);

            if (vm.newLocation !== undefined && vm.newLocation !== "") {
                updateLocation();
            }
        });

        function updateLocation() {
            var uglyLocation = vm.newLocation;

            if (hasNumbers(uglyLocation)) {
                vm.invalidLocation = true;
            } else {
                vm.invalidLocation = false;
                vm.location = uglyLocation.replace("-", ",").trim();
                loadForecasts();
            }
        }

        function hasNumbers(text) {
            var regex = /\d/g;
            return regex.test(text);
        }

        function prepareRecomendation() {
            vm.warm = true;
            vm.rain = false;
            vm.cold = false;

            var day = vm.weekendForecast.response[0].periods[1];

            var dayWeather = day.weather.toLowerCase();

            if (dayWeather.includes('rain') || dayWeather.includes('thunder') || dayWeather.includes('drizzle') || dayWeather.includes('mostly cloudy')) {
                vm.rain = true;
                vm.warm = false;
            } else if (dayWeather.includes('snow') || day.maxTempC <= 22) {
                vm.cold = true;
                vm.warm = false;
            }
        }

        function updateImage() {
            var weather = vm.observation.response.ob.weather.toLowerCase();

            if (weather.includes("sunny") || weather.includes('clear')) {
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

        function lineChart(selectedItem) {
            var col = selectedItem.column;
            if (selectedItem.row === null) {
                if (vm.myChartObject.view.columns[col] === col) {
                    vm.myChartObject.view.columns[col] = {
                        label: vm.myChartObject.data.cols[col].label,
                        type: vm.myChartObject.data.cols[col].type,
                        calc: function () {
                            return null;
                        }
                    };
                    vm.myChartObject.options.colors[col - 1] = '#CCCCCC';
                }
                else {
                    vm.myChartObject.view.columns[col] = col;
                    vm.myChartObject.options.colors[col - 1] = vm.myChartObject.options.defaultColors[col - 1];
                }
            }
        }

        function loadChart() {
            var forecast = vm.forecast.response[0];

            vm.myChartObject.type = "LineChart";
            vm.myChartObject.displayed = false;
            vm.myChartObject.data = {
                "cols": [{
                    id: "day",
                    label: "Day",
                    type: "string"
                }, {
                    id: "maxtemp-id",
                    label: "Max. Temp",
                    type: "number"
                }, {
                    id: "mintemp-id",
                    label: "Min. Temp",
                    type: "number"
                }],
                "rows": [{
                    c: [{
                        v: $filter("date")(forecast.periods[1].validTime, "EEEE")
                    }, {
                        v: forecast.periods[1].maxTempC
                    }, {
                        v: forecast.periods[1].minTempC
                    }]
                }, {
                    c: [{
                        v: $filter("date")(forecast.periods[2].validTime, "EEEE")
                    }, {
                        v: forecast.periods[2].maxTempC
                    }, {
                        v: forecast.periods[2].minTempC
                    }]

                }, {
                    c: [{
                        v: $filter("date")(forecast.periods[3].validTime, "EEEE")
                    }, {
                        v: forecast.periods[3].maxTempC
                    }, {
                        v: forecast.periods[3].minTempC
                    }]
                }, {
                    c: [{
                        v: $filter("date")(forecast.periods[4].validTime, "EEEE")
                    }, {
                        v: forecast.periods[4].maxTempC
                    }, {
                        v: forecast.periods[4].minTempC
                    }]
                }, {
                    c: [{
                        v: $filter("date")(forecast.periods[5].validTime, "EEEE")
                    }, {
                        v: forecast.periods[5].maxTempC
                    }, {
                        v: forecast.periods[5].minTempC
                    }]
                }]
            };
            vm.myChartObject.options = {
                "colors": ['#CC0000', '#468bcb'],
                "defaultColors": ['#CC0000', '#468bcb'],
                "isStacked": "true",
                "fill": 20,
                "displayExactValues": true,
                "vAxis": {
                    "title": "Temperature",
                    "gridlines": {
                        "count": 10
                    }
                },
                "hAxis": {
                    "title": "Week Days"
                }
            };

            vm.myChartObject.view = {
                columns: [0, 1, 2]
            };
        }
    }
})();