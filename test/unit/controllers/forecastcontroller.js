/**
 * Created by joana on 06/03/2017.
 */
describe('Controller: ForecastController', function () {

    // load the controller's module
    beforeEach(module('weatherApp'));

    var ForecastController, scope, $httpBackend;

    //workaround for Karma/ui-router conflict
    beforeEach(module(function ($urlRouterProvider) {
        $urlRouterProvider.deferIntercept();
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, _$httpBackend_, $rootScope, forecastService, observationService) {

        // place here mocked dependencies
        $httpBackend = _$httpBackend_;

        jasmine.getJSONFixtures().fixturesPath = 'base/test/mock';

        $httpBackend.expectGET("http://api.aerisapi.com/observations/Blumenau,SC,Brazil?client_id=f8f39QDiA7Yo0Q32oZcbb&client_secret=WXgU1OyulTT4IBswo1rlFAMbYt7jd0sNRDExhH3O").respond(
            getJSONFixture('observation.json')
        );

        $httpBackend.expectGET("http://api.aerisapi.com/forecasts/Blumenau,SC,Brazil?client_id=f8f39QDiA7Yo0Q32oZcbb&client_secret=WXgU1OyulTT4IBswo1rlFAMbYt7jd0sNRDExhH3O").respond(
            getJSONFixture('forecasts.json')
        );

        $httpBackend.expectGET("http://api.aerisapi.com/forecasts/Blumenau,SC,Brazil?from=saturday&to=+1days&client_id=f8f39QDiA7Yo0Q32oZcbb&client_secret=WXgU1OyulTT4IBswo1rlFAMbYt7jd0sNRDExhH3O").respond(
            getJSONFixture('weekendforecast.json')
        );

        scope = $rootScope.$new();
        ForecastController = $controller('ForecastController as forecast', {
            $scope: scope,
            forecastService: forecastService,
            observationService: observationService
        });
        $httpBackend.flush();

    }));

    it('should have observation as defined and showObservation as true', function () {
        expect(scope.forecast.observation).toBeDefined();
        expect(scope.forecast.showObservation).toBeTruthy();
    });

    it('should have image as cloudy', function () {
        expect(scope.forecast.image).toBe("images/cloudy.png");
    });

    it('should have forecast as defined and showForecast as true', function () {
        expect(scope.forecast.forecast).toBeDefined();
        expect(scope.forecast.showForecast).toBeTruthy();
    });

    it('should have weeks maxTemp as 32 and maxTempDate as 02/17/2017', function () {
        expect(scope.forecast.maxDate).toBe("2017-02-17T07:00:00-02:00");
        expect(scope.forecast.max).toBe(32);
    });

    it('should have weeks minTemp as 20 and minTempDate as 02/11/2017', function () {
        expect(scope.forecast.minDate).toBe("2017-02-11T07:00:00-02:00");
        expect(scope.forecast.min).toBe(20);
    });

    it('should have myChartObject as defined', function () {
        expect(scope.forecast.myChartObject).toBeDefined();
    });

    it('should have weekendForecast as defined and showWeekendForecast as true', function () {
        expect(scope.forecast.weekendForecast).toBeDefined();
        expect(scope.forecast.showWeekendForecast).toBeTruthy();
    });

    it('should have rain as false, cold as false and warm as true as recomendation info for the weekend', function () {
        expect(scope.forecast.rain).toBeFalsy();
        expect(scope.forecast.cold).toBeFalsy();
        expect(scope.forecast.warm).toBeTruthy();
    });

    it('should have saturday minTemp as 20 and saturday maxTemp as 27', function () {
        expect(scope.forecast.satMinTemp).toBe(20);
        expect(scope.forecast.satMaxTemp).toBe(27);
    });

    it('should have sunday minTemp as 19 and saturday maxTemp as 24', function () {
        expect(scope.forecast.sunMinTemp).toBe(19);
        expect(scope.forecast.sunMaxTemp).toBe(24);
    });
});
