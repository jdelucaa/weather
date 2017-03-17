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

    it('should have observation as defined', function () {
        expect(scope.forecast.observation).toBeDefined();
    });
});
