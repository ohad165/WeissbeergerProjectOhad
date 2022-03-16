(function (angular) {
    'use strict';

angular.module('ohadApp')
    .controller('movieModalCtrl',
                function ($scope, movieModal) {

        $scope.init = function() {
            $scope.movieModal = movieModal;
            const isWishListMovie = window.localStorage.getItem($scope.movieModal.Poster);
            if(isWishListMovie) {
                $scope.movieDetailsDto.isWishListMovie = true;
            }
        }

        $scope.wishListCheckBoxPressed = function() {
            if($scope.movieDetailsDto.isWishListMovie == true) {
                window.localStorage.setItem($scope.movieModal.Poster, $scope.movieModal.Title);
            } else {
                window.localStorage.removeItem($scope.movieModal.Poster);
            }
        }
    })

})(angular);