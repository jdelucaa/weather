/**
 * Created by joana on 11/02/2017.
 */
(function () {
    'use strict';

    angular
        .module('weatherApp')
        .directive('googleplace', googleplace);

        function googleplace() {
            var directive = {
                scope: {
                    newPlace: '='
                },
                link: link
            };

            return directive;

            function link(scope, element) {
                var options = {
                    types: ['(cities)']
                };
                
                scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

                google.maps.event.addListener(scope.gPlace, 'place_changed', function() {                    
                    scope.$apply(function() {
                        scope.newPlace = element.val();
                    });
                });
            }
        }
})();