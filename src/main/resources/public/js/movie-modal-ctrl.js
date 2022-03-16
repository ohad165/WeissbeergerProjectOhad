(function (angular) {
    'use strict';

angular.module('ohadApp')
    .controller('movieModalCtrl',
                function ($scope, movieModal) {

        $scope.init = function() {
            $scope.movieModal = movieModal;
        }
    })

})(angular);